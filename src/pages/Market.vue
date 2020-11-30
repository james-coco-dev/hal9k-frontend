<template>
  <div class="shop-page">
    <div class="background-1"></div>
    <div class="signal">
      <img src="@/static/images/glow-mobile.gif" />
    </div>
    <div class="caption">Market</div>
    <div class="pool-container">
      <pool-item :pools="pools" buttonText="Buy" @click="buy" />
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
  computed: {
    ...mapState({
      provider: (state) => state.metamask.provider,
      address: (state) => state.account.address,
      hal9kLtd: (state) => state.contract.hal9kLtd,
    }),
  },
  watch: {
    async provider() {
      await this.loadContract();
    },
    async address() {
      await this.loadContract();
    },
  },
  async mounted() {
    await this.loadContract();
  },
  methods: {
    async loadContract() {
      this.$store.commit("loading", true);
      const { data } = await axios.get(POOLS_KEY + "V1968");
      const upgradeCards = data.filter((elem) => elem.rarity === "Upgrade");
      try {
      } catch (error) {
        console.error(error);
        this.$snotify.error(error.message);
      }
      this.$store.commit("loading", false);
      this.pools = upgradeCards;
    },
    buy(id) {},
  },
};
</script>
<style lang="scss" scoped></style>
