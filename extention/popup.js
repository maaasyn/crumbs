const accountElement = document.getElementById("account");
const chainIdElement = document.getElementById("chainId");
const connectButton = document.getElementById("connectButton");

const port = chrome.runtime.connect();

port.onMessage.addListener(function (msg) {
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
