import { useEffect, useState } from "react";
import "./App.css";

import { createPublicClient, http } from "viem";
import { sepolia } from "viem/chains";

import { MetaMaskInpageProvider } from "@metamask/providers";

declare global {
  interface Window {
    ethereum: MetaMaskInpageProvider;
  }
}

function App() {
  const [block, setBlock] = useState(0n);
  const [account, setAccount] = useState("not connected");
  const [chain, setChain] = useState("not connected");
  const client = createPublicClient({ chain: sepolia, transport: http() });

  useEffect(() => {
    fetchLatestBlock();
  }, []);

  const fetchLatestBlock = async () => {
    try {
      const latestBlock = await client.getBlock({ blockTag: "latest" });
      setBlock(latestBlock.number);
    } catch (error) {
      console.error("Error fetching latest block:", error);
    }
  };

  const handleConnectOnClick = async () => {
    console.log("Right there");
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      console.log("Im here");
      chrome.scripting
        .executeScript({
          target: { tabId: tabs[0].id!, allFrames: true },
          func: async () => {
            console.log({ "window.ethereum": window.ethereum });

            const chainId = (await window.ethereum.request({
              method: "eth_chainId",
            })) as string;
            const account = (await window.ethereum.request({
              method: "eth_requestAccounts",
            })) as string[];

            console.log({ chainId, account });

            return { chainId, account };
          },
          world: "MAIN",
        })
        .then((results) => {
          console.log({ results });
          setChain(results[0].result?.chainId as string);
          setAccount(results[0].result?.account[0] as unknown as string);
        });
    });
  };

  return (
    <>
      <div>
        <a href="https://github.com/maaasyn" target="_blank">
          <span className="logo react">🍪</span>
        </a>
      </div>
      <h1>Crumbs</h1>
      <div className="card">
        <button onClick={fetchLatestBlock}>Fetch Latest Block</button>

        <button onClick={() => handleConnectOnClick()}>Connect</button>

        <p>Account: {account}</p>

        <p>Chain: {chain}</p>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
        <p>Latest block: {block.toString()}</p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
