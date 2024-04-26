import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { createPublicClient, http } from "viem";
import { sepolia } from "viem/chains";
import maskotSvg from "./assets/maskot.svg";

import { crumbsAbi } from "./crumbs-abi";
import { keccakHashResolver } from "./hash-resolver";
// import "./index.css";

// Creating a dedicated root with Shadow DOM
const rootElement = document.createElement("div");
// get the first div
rootElement.id = "crumbs-root";
// rootElement.style.position = "fixed";
// rootElement.style.bottom = "0 !important";
// rootElement.style.display = 'none'

// document.body.insertAdjacentHTML("beforeend", rootElement);

// Insert the root element into the first div

document.body.appendChild(rootElement);

function Tooltip({ onClose }: { onClose: () => void }) {
  const [comments, setComments] = useState([] as readonly string[]);
  const [isFetched, setIsFetched] = useState(false);

  const loadComments = async () => {
    const CRUMBS_ADDRESS_SEPOLIA = "0x97fcB3d3Ca78e74b710A8f0D1EE1f6BDA814cb2f";

    const client = createPublicClient({
      chain: sepolia,
      transport: http(),
    });

    const url = window.location.href;

    const data = await client.readContract({
      address: CRUMBS_ADDRESS_SEPOLIA,
      abi: crumbsAbi,
      functionName: "getCommentsByUrl",
      args: [url],
    });

    const dataResolved = data.map(keccakHashResolver);

    setIsFetched(true);
    setComments(dataResolved as readonly string[]);
  };

  useEffect(() => {
    loadComments();
  }, []);

  return (
    <div
      className="tooltip grecaptcha-badge"
      style={{
        display: "block",
        transition: "right 0.3s ease 0s",
        overflow: "hidden",
        position: "fixed",
        bottom: "120px",
        left: "20px",
        backgroundColor: "white",
        color: "black",
        zIndex: 9999, // High z-index
        borderRadius: "10px", // Rounded corners
        padding: "10px", // Some padding
        width: "300px", // Fixed width
        maxHeight: "400px", // Maximum height
        overflowY: "auto", // Scrollable
      }}>
      <button
        onClick={onClose}
        style={{
          float: "right",
          border: "none",
          background: "none",
          color: "black",
        }}>
        X
      </button>
      <h3 style={{ color: "orange" }}>Crumbs</h3>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {!isFetched ? (
          <li>Loading scrumbs...</li>
        ) : comments.length === 0 ? (
          <li>No scrumbs yet. Be the first!</li>
        ) : (
          comments.map((comment, index) => (
            <li
              key={index}
              style={{
                backgroundColor: "orange",
                color: "white",
                padding: "10px",
                borderRadius: "20px",
                margin: "10px 0",
                maxWidth: "80%",
                wordBreak: "break-word",
              }}>
              {comment}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

function Content() {
  const [showTooltip, setShowTooltip] = useState(false);

  // Click handler to toggle tooltip visibility
  const handleToggleTooltip = () => {
    setShowTooltip(!showTooltip);
  };

  return (
    <>
      {showTooltip && <Tooltip onClose={handleToggleTooltip} />}

      <img
        id="maskot"
        src={chrome.runtime.getURL(maskotSvg)}
        alt="mascot"
        style={{
          width: "100px",
          position: "fixed",
          bottom: "10px",
          left: "10px",
          zIndex: 9998, // Slightly lower z-index than the tooltip
        }}
        onClick={handleToggleTooltip}
      />
    </>
  );
}

// Using ReactDOM to create root inside the Shadow DOM
const reactRoot = ReactDOM.createRoot(rootElement);
reactRoot.render(
  <React.StrictMode>
    <Content />
  </React.StrictMode>
);
