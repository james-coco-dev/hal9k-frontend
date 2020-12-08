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
import { UPGRADE_ID } from "../utils/config";
export default {
  data: () => ({
    pools: [],
  }),
  components: {
    PoolItem,
  },
  computed: {
    ...mapState({
      web3: (state) => state.metamask.web3,
      provider: (state) => state.metamask.provider,
      hal9kLtd: (state) => state.contract.hal9kLtd,
    }),
  },
  watch: {
    async address() {
      await this.loadContract();
    },
  },
  async mounted() {
    await this.loadContract();
  },
  methods: {
    async loadContract() {
      if (!this.hal9kLtd) return;
      this.$store.commit("loading", true);
      const { data } = await axios.get(POOLS_KEY + "V1968");
      const upgradeCards = data.filter((elem) => elem.rarity === "Upgrade");
      try {
        upgradeCards.map(async (card) => {
          const res = await this.hal9kLtd.methods.totalSupply(card.id).call();
          this.pools = [...this.pools, { ...card, minted: parseInt(res) }];
        });
      } catch (error) {
        console.error(error);
        this.$snotify.error(error.message);
      }
      this.$store.commit("loading", false);
    },
    buy(item) {
      console.log(item.id);
    },
  },
};
</script>
<style lang="scss" scoped></style>
