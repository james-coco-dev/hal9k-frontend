<template>
  <div class="shop-page">
    <div class="background-1"></div>
    <div class="set-container">
      <div class="signal">
        <img src="@/static/images/glow-mobile.gif" />
      </div>
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
    loading: false,
  }),
  async mounted() {
    await this.onSelectPool("V1968");
  },
  methods: {
    async onSelectPool(pool) {
      this.loading = true;
      const { data } = await axios.get(POOLS_KEY + pool);
      console.log(data);
      this.pools = data;
      this.loading = false;
    },
  },
};
</script>
<style lang="scss" scoped>
.pool-container {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  grid-gap: 50px;
  width: 60%;
  margin: auto;
  margin-bottom: 2rem;
}
.pool-item {
  height: 100%;
  background: rgba(2, 18, 33, 0.85);
  border: #0084ff 1px solid;
  .pool-image {
    position: relative;
    display: inline-grid;
    img {
      max-width: 100%;
      border-bottom: #0084ff 1px solid;
    }
    .supply {
      position: absolute;
      padding: 5px 10px;
      background-color: #0084ff;
      border-radius: 8px;
      font-size: 1rem;
      color: white;
      bottom: -15px;
      left: 50%;
      transform: translateX(-50%);
    }
  }
  .pool-info {
    margin-top: 20px;
    text-align: center;
    margin-bottom: 1rem;
    .nft-name {
      font-size: 1rem;
      font-weight: bold;
      color: rgb(0, 180, 255);
    }
    .nft-description {
      margin: 1rem 0;
      color: white;
    }
  }
}
.set-container {
  display: flex;
  justify-content: center;
  width: 60%;
  margin: auto;
  padding: 0 2rem;
  margin-bottom: 5rem;
  .signal {
    font-size: 1.5rem;
    img {
      width: 150px;
    }
  }
}
.set-panel {
  height: 100%;
  margin-top: 2rem;
  display: flex;
  flex-direction: row;
  background: rgba(2, 18, 33, 0.85);
  padding: 1em;
  border-radius: 25px;
}
.opensea-button {
  border-radius: 5px;
  padding: 0.5em;
  font-size: 1rem;
  border: #0084ff 1px solid;
  background-color: transparent;
  color: #0084ff;
  margin: 0.5em;
  text-decoration: none;
}
</style>
