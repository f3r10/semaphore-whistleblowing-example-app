import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@semaphore-protocol/hardhat";
import "./tasks/deploy";

const config: HardhatUserConfig = {
  solidity: "0.8.23",
  networks: {
    // sepolia: {
    //  url: "https://rpc.sepolia.org/",
    //  accounts: [process.env.PRIVATE_KEY],
    // },
    // mumbai: {
    //  url: "https://rpc-mumbai.maticvigil.com",
    //  accounts: [process.env.PRIVATE_KEY],
    // },
    hardhat: {
      // url: "http://127.0.0.1:8545",
      // accounts: ["ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"]
      // forking: {
      //   url: `https://eth-sepolia.g.alchemy.com/v2/sXR_B6MuM83UTLoc0yoVIrLEx9fh12mo`,
      //   //  enabled: process.env.FORK === 'true',
      //   blockNumber: 6637611,
      // },
    },
  },
};

export default config;
