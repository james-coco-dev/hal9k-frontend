<template>
  <div class="shop-page">
    <div class="background-1"></div>
    <div class="signal">
      <img src="@/static/images/glow-mobile.gif" />
    </div>
    <div class="caption">NFT Gallery</div>
    <div class="pool-container">
      <pool-item
        :pools="pools"
        buttonText="Check Open Sea"
        @click="checkOpenSea"
      />
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import axios from "axios";
import PoolItem from "@/components/PoolItem";
import { POOLS_KEY } from "@/utils/config";
export default {
  data: () => ({
    pools: [],
  }),
  components: {
    PoolItem,
  },
  async mounted() {
    await this.loadPool("V1968");
  },
  methods: {
    checkOpenSea(id) {},
    async loadPool(pool) {
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
