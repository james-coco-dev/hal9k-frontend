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
    myDeck: [
      {
        //this is an example, should be retrieve from the backend or contract
        id: 1,
        image: "https://images.hal9k.ai/Chair_1x1.jpg",
        name: "Chair",
        description: "Common chair",
        max_supply: 2500,
        owns: 100,
      },
    ],
  }),
  components: {
    PoolItem,
  },
  computed: {
    ...mapState({
      stage: (state) => state.account.stage,
      address: (state) => state.account.address,
      reward: (state) => state.account.reward,
    }),
  },
  mounted() {
    console.log(this.reward);
    if (this.reward > 0 && this.reward < 11) {
      this.getCardInfo(this.reward);
    }
  },
  methods: {
    upgrade(item) {
      console.log("upgrade", item);
    },
    async getCardInfo(reward) {
      const response = await axios.get("http://api.hal9k.ai/hals/" + reward);
      this.myDeck = [{
        id: reward,
        image: response.data.image,
        name: response.data.name,
        description: response.data.description,
        max_supply: response.data.attributes[2].value
      }]
    }
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
