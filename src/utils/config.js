require("dotenv").config();

export const API_URL = process.env.NODE_ENV === "development" ? "http://0.0.0.0:8080" : 
  process.env.NODE_ENV === 'production' ? "http://api.hal9k.ai" : "";
console.log("API_URL : ", API_URL);

export const POOLS_KEY = "https://api.hal9k.ai/pools/";

export const Artifact = {
  rinkeby: {
    hal9k: "0xA68db5D24bd8Ed566821997225F9642753A24fb5",
    hal9kVault: "0x70E2a4F61746aCd1973E37FcBFDe2cFC3A737Cdc",
    hal9kLtd: "0x6aFb66f0D3188e400A4bBFA589CfF01E6c9F91b3",
    hal9kNftPool: "0x2e0Ee634bBF62dF4ad1B444Faf1163320Cbf81dF",
    hal9kv1Router: "0xe3400365f90cf5442F997Cf7E230334025889973",
    pairAddress: "0xf702C5865eDE9E58F62f68E9857D7Caa8a6AD4ff",
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
  NumberOfNFTsByClass: {
    common: [1000, 1000, 1000, 1000],
    rare: [250, 250, 250],
    epic: [100, 100],
    legendary: [25],
    upgrade: [25],
  },
  // Stage number starts from 1. So you have to wait 1 day to get on stage 1.
  // and need to wait 2 more to get on stage 2 ...
  // after stage 3, we'll use the same variable as in stage 3 
  DaysToWaitPerStage: [1, 2, 2], 
  NumberOfNFTsPerStage: {
    stage1: [],
    stage2: [],
    stage3: [],
  },
  // Step1 is to identify all users in every stage
  // Step2 collect their wallet addresses
  // Step3 calculate the amount of each card ... lets say you have 50 users in the pool
  // and a dropchance of 90%, then you need to select 45 wallets for the common card
  // Here the drop chance percentage determines how many wallet addresses we'll choose among all LP holders who kept LP for 1 day in Stage 1.
  DropChanceByStage: {
    stage1: [98, 1.75, 0.25, 0],
    stage2: [60, 37, 2.8, 0.2],
    stage3: [50, 40, 7.3, 2.7],
  }
  // After user claims his NFT in certain stage, we should move him one stage back.
  // So we should enable them either claim NFT or Move to the next stage, not both at the same time.

  // We should have graphical interface that shows their progress and probabilities for their current stage.
}

