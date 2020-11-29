<template>
  <div class="shop-page">
    <div class="background-1"></div>
    <div class="signal">
      <img src="@/static/images/glow-mobile.gif" />
    </div>
    <div class="caption">My Deck</div>
    <div class="stage-container">Stage {{ stage }}</div>
    <div class="pool-container" v-if="myDeck.length">
      <pool-item :pools="myDeck" buttonText="Upgrade" @click="upgrade" />
    </div>
    <div class="no-nft" v-else>
      You don't own any NFTs.
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import axios from "axios";
import PoolItem from "@/components/PoolItem";
import { Artifact, API_URL, NFTConfig } from "../utils/config";
export default {
  data: () => ({
    myDeck: [],
  }),
  components: {
    PoolItem,
  },
  computed: {
    ...mapState({
      stage: (state) => state.account.stage,
      address: (state) => state.account.address,
      balance: (state) => state.account.balance,
      reward: (state) => state.account.reward,
      hal9kLtd: (state) => state.contract.hal9kLtd,
    }),
  },
  methods: {
    async readBalance(addresses, ids) {
      if (!this.hal9kLtd) return;
      const res = await this.hal9kLtd.methods.balanceOfBatch(addresses, ids).call();
      for (let i = 0; i < 11; i ++) {
        console.log(res[i], i + 1);
        if (res[i] > 0) {
          this.getCardInfo(i + 1, res[i]);
        }
      }
      this.$store.commit("account/setBalance", res);
    },
    upgrade(item) {
      console.log("upgrade", item);
    },
    async getCardInfo(reward, count) {
      const response = await axios.get("https://api.hal9k.ai/hals/" + reward);
      this.myDeck.push({
        id: reward,
        image: response.data.image,
        name: response.data.name,
        description: response.data.description,
        max_supply: response.data.attributes[2].value,
        owns: count,
      })
    }
  },
  async mounted() {
    let addresses = [];
    let ids = [];
    for (let i = 1; i < 11; i ++) {
      ids.push(i);
      addresses.push(this.address);
    }
    await this.readBalance(addresses, ids);
  },
};
</script>
<style lang="scss" scoped>
.stage-container {
  font-size: 1rem;
  text-align: center;
}
.no-nft {
  margin-top: 5rem;
  font-size: 1rem;
  color: white;
  text-align: center;
  display: flex;
  justify-content: center;
}
</style>
