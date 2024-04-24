console.log("Background script loaded");

chrome.runtime.onConnect.addListener(function (port) {
  console.log("Connected to content script");

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
