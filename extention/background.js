console.log("Background script loaded");

// Inbox for messages from the popup script
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "toContent") {
    console.log("Sending fancy message... 2/3");
    // Forward the fancyMessage to the content script of the specified tab
    chrome.tabs.sendMessage(request.tabId, { ...request });
  }

  if (request.action === "toggleMaskot") {
    console.log("Toggling Maskot... 2/3");
    chrome.tabs.sendMessage(request.tabId, { ...request });
  }

  if (request.action === "setBadge") {
    console.log("Setting badge text to:", request.text);

    console.log({ action: chrome.action });
    chrome.action.setBadgeText({ text: request.text });
    chrome.action.setBadgeBackgroundColor({
      color: "#FF0000",
    });
  }

  if (request.action === "clearBadge") {
    console.log("Clearing badge");
    chrome.action.setBadgeText({ text: "" });
  }
});

const onUpdate = async (url) => {
  // chrome.runtime.sendMessage({ action: "urlChange", url });
  console.log("onUpdate", url);
};

chrome.webNavigation.onHistoryStateUpdated.addListener(function (details) {
  var newUrl = details.url;

  console.log("webNavigation", details);

  onUpdate(newUrl);
});

chrome.tabs.onActivated.addListener(function (activeInfo) {
  chrome.tabs.get(activeInfo.tabId, function (tab) {
    console.log("onActivated", tab.url);
    onUpdate(tab.url);
  });
});

chrome.runtime.onConnect.addListener(function (port) {
  port.onMessage.addListener(function (msg) {
    console.log("Received message in background:", msg);

    if (msg.action === "getAccount") {
      port.postMessage({ action: "connect" });
    } else if (msg.action === "getChainId") {
      port.postMessage({ action: "connect" });
    } else if (msg.account) {
      console.log("Current account:", msg.account);
    } else if (msg.chainId) {
      console.log("Current chain ID:", msg.chainId);
    } else if (msg.error) {
      console.error("Error:", msg.error);
    }
  });
});
