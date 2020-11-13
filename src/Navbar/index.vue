<template>
  <div class="nav-bar">
    <Menu />
    <button class="green" v-if="address" @click="disconnect">
      {{ compressAddress(address, 10, 5) }}
    </button>
    <button class="white" v-else @click="connectWallet">
      Connect Wallet
    </button>
  </div>
</template>
<script>
import { mapState } from "vuex";
import Menu from "./Menu";
import Metamask from "../utils/Metamask";
export default {
  components: {
    Menu,
  },
  computed: {
    ...mapState({
      address: (state) => state.account.address,
    }),
  },
  async mounted() {
    if (this.address) await this.connectWallet();
  },
  methods: {
    async connectWallet() {
      await Metamask.connect();
    },
    compressAddress(address, leftOffset, rightOffset) {
      return (
        address.substr(0, leftOffset) +
        "..." +
        address.substr(address.length - rightOffset, address.length)
      );
    },
    nftshop() {
      this.$router.push("/shop");
    },
    disconnect() {
      Metamask.disconnect();
    },
  },
};
</script>
<style scoped>
.nav-bar {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  gap: 10px;
  padding: 5px 2rem;
}
</style>
