<template>
  <div class="shop-page">
    <div class="background-1"></div>
    <div class="signal">
      <img src="@/static/images/glow-mobile.gif" />
    </div>
    <div class="pool-container">
      <div v-for="(nft, index) in pools" :key="index" class="pool-item">
        <div class="pool-image">
          <img :src="nft.image" :alt="nft.name" />
          <div class="supply">{{ nft.max_supply }} Minted</div>
        </div>
        <div class="pool-info">
          <div class="nft-name">{{ nft.name }}</div>
          <div class="nft-description">{{ nft.description }}</div>
          <button class="opensea-button">Check Open Sea</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import axios from "axios";
import { POOLS_KEY } from "@/utils/config";
export default {
  data: () => ({
    pools: [],
  }),
  computed: {
    ...mapState({
      address: (state) => state.account.address,
      hal9kVault: (state) => state.contract.hal9kVault,
      hal9kWethPair: (state) => state.contract.hal9kWethPair,
      hal9kNftPool: (state) => state.contract.hal9kNftPool,
      web3: (state) => state.metamask.web3,
      provider: (state) => state.metamask.provider,
    }),
  },
  async mounted() {
    await this.onSelectPool("V1968");
  },
  methods: {
    async onSelectPool(pool) {
      this.loading = true;
      this.$store.commit("loading", true);
      const { data } = await axios.get(POOLS_KEY + pool);
      this.$store.commit("loading", false);
      this.pools = data;
    },
  },
};
</script>
<style lang="scss" scoped></style>
