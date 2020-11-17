import detectEthereumProvider from "@metamask/detect-provider";
import { Artifact } from './config';
import Hal9kJson from './abi/Hal9k.json';
import Hal9kLtdJson from './abi/Hal9kLtd.json';
import Hal9kNftPoolJson from './abi/Hal9kNftPool.json';
import Hal9kVaultJson from './abi/Hal9kVault.json';
import store from "../store";
import Web3 from 'web3';

class Web3Wrapper {
  constructor() {
    this.provider = null;
    this.chainId = null;
    this.hal9k = null;
    this.hal9kVault = null;
    this.hal9kLtd = null;
    this.hal9kNftPool = null;
    this.web3 = null;
  }

  handleChainChanged = (_chainId) => {
    console.log("chainid========>", _chainId);
  };

  handleAccountsChanged = (accounts) => {
    console.log("address ===>", accounts);
    const { address } = store.state.account;
    if (accounts.length === 0) {
      store.dispatch("account/disconnect");
    } else if (accounts[0] !== address) {
      store.commit("account/setAddress", accounts[0]);
    }
  };

  disconnect = () => {
    store.dispatch("account/disconnect");
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
      this.provider = provider;
      this.provider.on("accountsChanged", this.handleAccountsChanged);
      this.provider.on("chainChanged", this.handleChainChanged);
      this.provider.on("disconnect", (res) => {
        store.dispatch("account/disconnect");
      });
      this.provider
        .request({ method: "eth_requestAccounts" })
        .then(this.handleAccountsChanged)
        .catch((err) => {
          console.error(err);
          store.dispatch("account/disconnect");
        });
      
      this.web3 = new Web3(this.provider);
      
      this.hal9k = new this.web3.eth.Contract(Hal9kJson, Artifact.rinkeby.hal9k);
      this.hal9k.setProvider(this.provider);

      this.hal9kLtd = new this.web3.eth.Contract(Hal9kLtdJson, Artifact.rinkeby.hal9kLtd);
      this.hal9kLtd.setProvider(this.provider);

      this.hal9kNftPool = new this.web3.eth.Contract(Hal9kNftPoolJson, Artifact.rinkeby.hal9kNftPool);
      this.hal9kNftPool.setProvider(this.provider);

      this.hal9kVault = new this.web3.eth.Contract(Hal9kVaultJson, Artifact.rinkeby.hal9kVault);
      this.hal9kVault.setProvider(this.provider);
    } catch (err) {
      console.error(err);
      store.dispatch("account/disconnect");
    }
  };
}

const HalWeb3 = new Web3Wrapper();
export default HalWeb3;
