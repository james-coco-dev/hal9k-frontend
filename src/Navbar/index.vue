<template>
  <div class="nav-bar">
    <button class="connect-but" @click="connectWallet">Connect Wallet</button>
  </div>
</template>
<script>
import Web3 from "../utils/Web3Wrapper";
export default {
  methods: {
    async connectWallet() {
      await Web3.connect();
    },
  },
  mounted() {},
};
</script>
<style scoped>
.nav-bar {
  text-align: right;
  padding: 5px 2rem;
}
</style>
