import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { createPublicClient, http } from "viem";
import { sepolia } from "viem/chains";
import maskotSvg from "./assets/maskot.svg";

import { keccakHashResolver } from "./hash-resolver";
import "./index.css";

const abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "url",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "commentHash",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
    ],
    name: "CommentStored",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "commentsByUrl",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_url",
        type: "string",
      },
    ],
    name: "getCommentsByUrl",
    outputs: [
      {
        internalType: "bytes32[]",
        name: "",
        type: "bytes32[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "url",
        type: "bytes32",
      },
    ],
    name: "getCommentsByUrlHash",
    outputs: [
      {
        internalType: "bytes32[]",
        name: "",
        type: "bytes32[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_url",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "_commentHash",
        type: "bytes32",
      },
    ],
    name: "storeComment",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_url",
        type: "string",
      },
      {
        internalType: "string",
        name: "_comment",
        type: "string",
      },
    ],
    name: "storeCommentByUrlAndString",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "comment",
        type: "string",
      },
      {
        internalType: "string",
        name: "_url",
        type: "string",
      },
    ],
    name: "verifyComment",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

// Creating a dedicated root with Shadow DOM
const rootElement = document.createElement("div");
rootElement.id = "root";
rootElement.style.position = "absolute";
document.body.appendChild(rootElement);

function Tooltip() {
  const [comments, setComments] = useState([] as readonly string[]);

  const loadComments = async () => {
    const CRUMBS_ADDRESS_SEPOLIA = "0x97fcB3d3Ca78e74b710A8f0D1EE1f6BDA814cb2f";

    // Fetching comments from a smart contract
    const client = createPublicClient({
      chain: sepolia,
      transport: http(),
    });

    const url = window.location.href;

    const data = await client.readContract({
      address: CRUMBS_ADDRESS_SEPOLIA,
      abi,
      functionName: "getCommentsByUrl",
      args: [url],
    });

    const dataResolved = data.map(keccakHashResolver);

    setComments(dataResolved as readonly string[]);
  };

  useEffect(() => {
    loadComments();
  }, []);
  return (
    <div
      className="tooltip"
      style={{
        position: "fixed",
        bottom: "120px",
        right: "20px",
        backgroundColor: "darkgray",
        zIndex: 9999, // High z-index
      }}>
      <h3>Comments</h3>
      <ul>
        {comments.map((comment, index) => (
          <li key={index}>{comment}</li>
        ))}
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
      {showTooltip && <Tooltip />}
      <img
        id="maskot"
        src={chrome.runtime.getURL(maskotSvg)}
        alt="mascot"
        style={{
          width: "100px",
          position: "fixed",
          bottom: "10px",
          right: "10px",
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
