import detectEthereumProvider from "@metamask/detect-provider";
import { Artifact } from "./config";
import Hal9kJson from "./abi/Hal9k.json";
import Hal9kLtdJson from "./abi/Hal9kLtd.json";
import Hal9kNftPoolJson from "./abi/Hal9kNftPool.json";
import Hal9kVaultJson from "./abi/Hal9kVault.json";
import Hal9kv1Router from "./abi/Hal9kv1Router.json";
import ERC20 from "./abi/ERC20.json";
import store from "../store";
import Web3 from "web3";

class Web3Wrapper {
  handleChainChanged = (_chainId) => {
    store.commit("account/setChainId", _chainId);
  };

  handleAccountsChanged = (accounts) => {
    const { address } = store.state.account;
    if (accounts.length === 0) {
      this.disconnect();
    } else if (accounts[0] !== address) {
      store.commit("account/setAddress", accounts[0]);
    }
  };

  disconnect = () => {
    store.dispatch("account/disconnect");
    store.commit("metamask/clearProvider");
    store.commit("contract/clearContracts");
  };

  connect = async () => {
    try {
      const provider = await detectEthereumProvider();
      if (provider) {
        if (provider !== window.ethereum)
          throw new Error("Do you have multiple wallets installed?");
      } else {
        throw new Error("Please install MetaMask!");
      }
      provider.on("accountsChanged", this.handleAccountsChanged);
      provider.on("chainChanged", this.handleChainChanged);
      provider.on("disconnect", (res) => {
        store.dispatch("account/disconnect");
      });
      provider
        .request({ method: "eth_requestAccounts" })
        .then(this.handleAccountsChanged)
        .catch((err) => {
          console.error(err);
          store.dispatch("account/disconnect");
        });
      store.commit("metamask/setProvider", provider);
      const web3 = new Web3(provider);
      store.commit("metamask/setWeb3", web3);
      const hal9k = new web3.eth.Contract(Hal9kJson, Artifact.rinkeby.hal9k);
      hal9k.setProvider(provider);

      const hal9kLtd = new web3.eth.Contract(
        Hal9kLtdJson,
        Artifact.rinkeby.hal9kLtd
      );
      hal9kLtd.setProvider(provider);

      const hal9kNftPool = new web3.eth.Contract(
        Hal9kNftPoolJson,
        Artifact.rinkeby.hal9kNftPool
      );
      hal9kNftPool.setProvider(provider);

      const hal9kVault = new web3.eth.Contract(
        Hal9kVaultJson,
        Artifact.rinkeby.hal9kVault
      );
      hal9kVault.setProvider(provider);

      const hal9kv1Router = new web3.eth.Contract(
        Hal9kv1Router,
        Artifact.rinkeby.hal9kv1Router
      );
      hal9kv1Router.setProvider(provider);

      const hal9kWethPair = new web3.eth.Contract(
        ERC20,
        Artifact.rinkeby.pairAddress
      );
      hal9kWethPair.setProvider(provider);
      store.commit("contract/setContracts", {
        hal9k,
        hal9kLtd,
        hal9kNftPool,
        hal9kVault,
        hal9kv1Router,
        hal9kWethPair,
      });
    } catch (err) {
      console.error(err);
      this.disconnect();
    }
  };
}

const HalWeb3 = new Web3Wrapper();
export default HalWeb3;
