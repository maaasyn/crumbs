const accountElement = document.getElementById("account");
const chainIdElement = document.getElementById("chainId");
const connectButton = document.getElementById("connectButton");
const action1Button = document.getElementById("action1Button");
const action2Button = document.getElementById("action2Button");
const action3Button = document.getElementById("action3Button");
const action4Button = document.getElementById("action4Button");

// outbox for messages to the background script
action1Button.addEventListener("click", function () {
  chrome.runtime.sendMessage({ action: "setBadge", text: "*" });
});

action2Button.addEventListener("click", function () {
  chrome.runtime.sendMessage({ action: "clearBadge" });
});

action3Button.addEventListener("click", function () {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    console.log("Sending fancy message... 1/3");

    let fancyMessage = {
      action: "toContent",
      content: "Hello from popup!",
      description: "This is a message from the popup script",
    };

    chrome.runtime.sendMessage({
      tabId: tabs[0].id,
      ...fancyMessage,
    });
  });
});

action4Button.addEventListener("click", function () {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    console.log("Toggling Maskot... 1/3");
    chrome.runtime.sendMessage({
      tabId: tabs[0].id,
      action: "toggleMaskot",
    });
  });
});

const port = chrome.runtime.connect();

port.onMessage.addListener(function (msg) {
  console.log(msg);

  if (msg.account) {
    accountElement.textContent = msg.account;
  } else if (msg.chainId) {
    chainIdElement.textContent = msg.chainId;
  } else if (msg.error) {
    console.error(msg.error);
  }
});

chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  connectButton.addEventListener("click", function () {
    chrome.scripting
      .executeScript({
        target: { tabId: tabs[0].id, allFrames: true },
        func: async () => {
          const chainId = await window.ethereum.request({
            method: "eth_chainId",
          });
          const account = await window.ethereum.request({
            method: "eth_requestAccounts",
          });

          return { chainId, account };
        },
        world: "MAIN",
      })
      .then((results) => {
        const { chainId, account } = results[0].result;
        console.log({ chainId });
        const port = chrome.runtime.connect();
        port.postMessage({ chainId });
        port.postMessage({ account });
        chainIdElement.textContent = parseInt(chainId);
        accountElement.textContent = account[0];
      });
  });
});
