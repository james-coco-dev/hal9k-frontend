<template>
  <div class="shop-page">
    <div class="background-1"></div>
    <div class="signal">
      <img src="@/static/images/glow-mobile.gif" />
    </div>
    <div class="deck-container">My Deck</div>
    <div class="stage-container">Stage {{ stage }}</div>
    <div class="pool-container">
      <div v-for="(nft, index) in myDeck" :key="index" class="pool-item">
        <div class="pool-image">
          <img :src="nft.image" :alt="nft.name" />
          <div class="supply">{{ nft.max_supply }} Minted</div>
        </div>
        <div class="pool-info">
          <div class="nft-name">{{ nft.name }}</div>
          <div class="nft-description">{{ nft.description }}</div>
          <button class="button-3">Upgrade</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import axios from "axios";
//import { POOLS_KEY } from "@/utils/config";
export default {
  data: () => ({
    stage: 1,
    myDeck: [
      {
        //this is an example, should be retrieve from the backend or contract
        image: "https://images.hal9k.ai/Chair_1x1.jpg",
        name: "Chair",
        description: "Common chair",
        max_supply: 2500,
      },
    ],
  }),
  mounted() {},
  methods: {},
};
</script>
<style lang="scss" scoped>
.stage-container {
  font-size: 1rem;
  text-align: center;
}
.deck-container {
  font-size: 2rem;
  text-align: center;
  margin-bottom: 10px;
}
</style>
