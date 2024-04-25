function getRandomColor() {
  let letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

console.log("Content script loaded");

// Inbox for messages from the background script
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  console.log({ message });

  if (message.action === "toContent") {
    // background color change
    document.body.style.backgroundColor = getRandomColor();
  }

  if (message.action === "toggleMaskot") {
    // Toggle the maskot
    console.log("Toggling Maskot... 3/3");
    const img = document.createElement("img");
    img.src = chrome.runtime.getURL("icons/maskot.svg");
    img.style.position = "fixed";
    img.style.bottom = "0";
    img.style.right = "0";
    img.style.width = "100px";
    img.style.height = "100px";
    img.style.zIndex = "9999";
    img.style.transition = "all 0.5s ease";
    img.style.transform = "rotate(0deg)";
    document.body.appendChild(img);
  }

  sendResponse({ result: "Message received from content.js" });
});

// chrome-extension://hcbehmiencpobjbfllbjjebfejnffaih/popup.html
