require("dotenv").config();

export const API_URL =
  process.env.NODE_ENV === "development"
    ? "http://0.0.0.0:8080"
    : process.env.NODE_ENV === "production"
    ? "https://api.hal9k.ai"
    : "";
console.log("API_URL : ", API_URL);

export const POOLS_KEY = "https://api.hal9k.ai/pools/";

export const Artifact = {
  rinkeby: {
    hal9k: "0x53dEf6252a3b5e3f5aea8009B6Da528DA02D7a65",
    hal9kLtd: "0xA1A94F6348E18C9c70b41B7803c1a0fAceCEdDBf",
    hal9kVault: "0x50a22b99Ad350cD7A6C2FfC643D78fdD4F97e468",
    hal9kNftPool: "0xe7FBdc4B11405431e480F165734D53258EF52C48",
    hal9kv1Router: "0x880307AD33CB38895c1AB242dF76fDd6Ce1435BA",
    pairAddress: "0x3C7218C374DFB29b07a9255736DC95919f2b74cb",
  },
  mainnet: {
    hal9k: "",
    hal9kVault: "",
    hal9kLtd: "",
    hal9kNftpool: "",
    hal9kv1Router: "",
    pairAddress: "",
  },
};

// NOTE: This NFT config is all changeable
export const NFTConfig = {
  numberOfNFTsByClass: {
    common: [2500, 2500, 2500, 2500],
    rare: [100, 100, 100],
    epic: [30, 30],
    legendary: [3],
    upgrade: [150],
  },
  // Stage number starts from 1. So you have to wait 1 day to get on stage 1.
  // and need to wait 2 more to get on stage 2 ...
  // after stage 3, we'll use the same variable as in stage 3
  daysToWaitPerStage: [1, 2, 2],
  numberOfUpgradesPerStage: {
    stage1: [],
    stage2: [],
    stage3: [],
  },
  // Step1 is to identify all users in every stage
  // Step2 collect their wallet addresses
  // Step3 calculate the amount of each card ... lets say you have 50 users in the pool
  // and a dropchance of 90%, then you need to select 45 wallets for the common card
  // Here the drop chance percentage determines how many wallet addresses we'll choose among all LP holders who kept LP for 1 day in Stage 1.
  dropChanceByStage: {
    stage1: [3000, 50, 10, 0],
    stage1Total: 3060,
    stage2: [4000, 100, 20, 2],
    stage2Total: 4122,
    stage3: [5000, 200, 40, 5],
    stage3Total: 5245,
  },
  // After user claims his NFT in certain stage, we should move him one stage back.
  // So we should enable them either claim NFT or Move to the next stage, not both at the same time.

  // We should have graphical interface that shows their progress and probabilities for their current stage.
};
