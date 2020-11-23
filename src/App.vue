<template>
  <div>
    <loading v-if="loading" />
    <nav-bar />
    <router-view />
    <vue-snotify />
  </div>
</template>
<script>
import { mapState } from "vuex";
import { Artifact, API_URL } from "./utils/config";
import axios from 'axios';
import Loading from "./Loading";
export default {
  components: {
    Loading,
  },
  computed: {
    ...mapState({
      loading: (state) => state.loading,
      address: (state) => state.account.address,
      hal9kVault: (state) => state.contract.hal9kVault,
      hal9kWethPair: (state) => state.contract.hal9kWethPair,
      hal9kNftPool: (state) => state.contract.hal9kNftPool,
      web3: (state) => state.metamask.web3,
      provider: (state) => state.metamask.provider,
    }),
  },
  methods: {
    async getUserInformation(address) {
      const userData = { address: address };
      console.log(address);
      const response = await axios.get(API_URL + "/hal9k-user", { params: {address:address}});
      console.log(response);
    },
    async createUser(address, balance, startTime, stage) {
      const userData = { address: address, balance: balance, lastUpdateTime: startTime, stage: stage };
      const response = await axios.put(API_URL + "/hal9k-user", userData);
      if (response.data === address) {
        this.$snotify.info("Your NFT dropchance has started!");
      }
    },
  },
  async mounted() {
    this.createUser("0x5518876726c060b2d3fcda75c0b9f31f13b78d07", 500, 1606127925, 0);
    // this.getUserInformation(this.address);
  }
};
</script>
<style lang="scss">
@import "./css/style.scss";
</style>
