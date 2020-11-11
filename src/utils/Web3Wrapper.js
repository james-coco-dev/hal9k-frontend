import detectEthereumProvider from "@metamask/detect-provider";

class Web3Wrapper {
  constructor() {
    this.provider = null;
    this.account = null;
    this.chainId = null;
  }
  handleChainChanged = (_chainId) => {
    console.log("chainid========>", _chainId);
  };
  handleAccountsChanged = (accounts) => {
    console.log(accounts);
    if (accounts.length === 0) {
      console.log("Please connect to MetaMask.");
    } else if (accounts[0] !== this.account) {
      this.account = accounts[0];
    }
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
      this.provider.on("disconnect", (res) => {
        console.log("disconnect", res);
      });
      this.provider
        .request({ method: "eth_requestAccounts" })
        .then(this.handleAccountsChanged)
        .catch((err) => {
          console.error(err);
        });
    } catch (err) {
      console.error(err);
    }
  };
}

const Web3 = new Web3Wrapper();
export default Web3;
