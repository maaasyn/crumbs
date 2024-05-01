import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { createPublicClient, http } from "viem";
// import { sepolia } from "viem/chains";
import maskotSvg from "./assets/maskot.svg";

import { crumbsAbi } from "./crumbs-abi";
import { keccakHashResolver } from "./hash-resolver";
// import { config } from "./wagmi/config";
// import "./index.css";

import { QueryClientProvider } from "@tanstack/react-query";
// import { http } from "wagmi";
import { sepolia } from "wagmi/chains";
import { queryClient } from "./wagmi/react-query";

const rootElement = document.createElement("div");
rootElement.id = "crumbs-root";

document.body.appendChild(rootElement);

function Tooltip({ onClose }: { onClose: () => void }) {
  const [comments, setComments] = useState([] as readonly string[]);
  const [isFetched, setIsFetched] = useState(false);
  const [message, setMessage] = useState(""); // New state for the current message

  const handleMessageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };

  const handleSendMessage = () => {
    // Here you can add the code to send the message
    // For now, we'll just add it to the comments list
    setComments((prevComments) => [...prevComments, message]);
    setMessage("");
  };

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
        bottom: "60px",
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
      <form
        onSubmit={(event) => {
          event.preventDefault();
          handleSendMessage();
        }}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
        <input
          type="text"
          value={message}
          onChange={handleMessageChange}
          style={{
            width: "80%",
            padding: "10px",
            borderRadius: "10px",
            margin: "10px 0",
          }}
        />
        <button
          type="submit"
          style={{
            width: "18%",
            padding: "10px",
            borderRadius: "10px",
            margin: "10px 1%",
            backgroundColor: "orange",
            color: "white",
            border: "none",
          }}>
          Send
        </button>
      </form>
    </div>
  );
}

function Content() {
  // console.log(config.chains);
  const [mascotVisible, setMascotVisible] = useState(true);
  const [showTooltip, setShowTooltip] = useState(false);

  // useEffect(() => {
  //   window.addEventListener("eip6963:announceProvider", (event) => {
  //     console.log(event);
  //   });

  //   window.dispatchEvent(new Event("eip6963:requestProvider"));

  //   return () => {
  //     window.removeEventListener("eip6963:announceProvider", (event) => {
  //       console.log(event);
  //     });
  //   };
  // }, []);

  useEffect(() => {
    // Function to run when storage changes
    const handleStorageChange = (
      changes: { [key: string]: chrome.storage.StorageChange },
      areaName: string
    ) => {
      if (areaName === "sync" && changes.mascotVisible) {
        if (changes.mascotVisible.newValue === false) {
          setShowTooltip(false);
        }
        setMascotVisible(changes.mascotVisible.newValue);
      }
    };

    // Set initial value
    chrome.storage.sync.get("mascotVisible", ({ mascotVisible }) => {
      setShowTooltip(false);
      setMascotVisible(mascotVisible);
    });

    // Add listener
    chrome.storage.onChanged.addListener(handleStorageChange);

    // Remove listener when component unmounts
    return () => {
      chrome.storage.onChanged.removeListener(handleStorageChange);
      setShowTooltip(false);
    };
  }, []);

  // Click handler to toggle tooltip visibility
  const handleToggleTooltip = () => {
    // console.log(window.ethereum.chainId);
    setShowTooltip(!showTooltip);
  };

  return (
    <>
      {showTooltip && <Tooltip onClose={handleToggleTooltip} />}

      {mascotVisible && (
        <>
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
      )}
    </>
  );
}

const MiniApp = () => {
  return (
    // <WagmiProvider config={config}>
    <QueryClientProvider client={queryClient}>
      <Content />
    </QueryClientProvider>
    // </WagmiProvider>
  );
};
// Using ReactDOM to create root inside the Shadow DOM
const reactRoot = ReactDOM.createRoot(rootElement);

reactRoot.render(
  <React.StrictMode>
    <MiniApp />
  </React.StrictMode>
);
