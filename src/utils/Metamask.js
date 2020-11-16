import detectEthereumProvider from "@metamask/detect-provider";
import store from "../store";
class Web3Wrapper {
  constructor() {
    this.provider = null;
    this.chainId = null;
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
    } catch (err) {
      console.error(err);
      store.dispatch("account/disconnect");
    }
  };
}

const Web3 = new Web3Wrapper();
export default Web3;
