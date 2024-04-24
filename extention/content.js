console.log("Content script loaded");

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "potato") {
    console.log("Connect button was clicked!");
    console.log({ windowEthereum: window.ethereum });

    if (window.ethereum) {
      sendResponse({ result: "[[Content.js]]#window.ethereum exists" });
    } else {
      sendResponse({
        result: "[[Content.js]]#window.ethereum does not exists",
      });
    }
    //? fallback
    sendResponse({ result: "Message received from content.js" });
  }
});

// const port = chrome.runtime.connect();

// port.onMessage.addListener(function (msg) {
//   if (msg.action === "potato") {
//     console.log("Connect!");
//   }
//   if (msg.action === "connect") {
//     console.log({ windowEthereum: window.ethereum });
//     if (window.ethereum) {
//       window.ethereum
//         .request({ method: "eth_requestAccounts" })
//         .then((accounts) => {
//           port.postMessage({ account: accounts[0] });
//           window.ethereum
//             .request({ method: "eth_chainId" })
//             .then((chainId) => {
//               port.postMessage({ chainId });
//             })
//             .catch((error) => {
//               console.error("Error getting chain ID:", error);
//               port.postMessage({ error: error.message });
//             });
//         })
//         .catch((error) => {
//           console.error("Error getting accounts:", error);
//           port.postMessage({ error: error.message });
//         });
//     } else {
//       port.postMessage({ error: "No Ethereum provider detected" });
//     }
//   }
// });
