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
      const response = await axios.post(API_URL + "/hal9k-user", userData);
      console.log(response);
    },
  },
  async mounted() {
    this.getUserInformation(this.address);
  }
};
</script>
<style lang="scss">
@import "./css/style.scss";
</style>
