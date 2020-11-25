<template>
  <div>
    <div class="background-1"></div>

    <div class="signal">
      <img src="@/static/images/glow-mobile.gif" />
    </div>
    <div class="caption">NFT Reward</div>
    <div class="row drop-container">
      <section class="d1 screen">
        <p class="label">NFT</p>
        <div class="nft-box">
          <pool-item :pools="droppedNft" :hasButton="false" />
        </div>
      </section>
      <section class="e2 screen">
        <p class="label">Upgrade</p>
        <div class="upgrade-box">
          <div class="stage-box">
            <img src="@/static/images/stagelabel.png" width="30%" />
            <div class="stage-label">{{ stage }}</div>
          </div>
          <div>Lorem</div>
          <div class="button-group">
            <button class="button-4" @click="upgrade">Upgrade</button>
            <button class="button-4" @click="claim">Claim</button>
          </div>
        </div>
      </section>
      <section class="screen">
        <p class="label">Chart</p>
        <img width="100%" src="@/static/images/upchart.jpg" />
      </section>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import PoolItem from "../components/PoolItem.vue";
import axios from "axios";
import { Artifact, API_URL, NFTConfig } from "../utils/config";
export default {
  data: () => ({
    droppedNft: [{}],
  }),
  components: { PoolItem },
  computed: {
    ...mapState({
      stage: (state) => state.account.stage,
      address: (state) => state.account.address,
      reward: (state) => state.account.reward,
    }),
  },
  mounted() {
    if (this.reward > 0 && this.reward < 11) {
      this.getCardInfo(this.reward);
    }
  },
  methods: {
    upgrade() {},
    claim() {},
    async getCardInfo(reward) {
      const response = await axios.get("http://api.hal9k.ai/hals/" + reward);
      this.droppedNft = [{
        id: reward,
        image: response.data.image,
        name: response.data.name,
        description: response.data.description,
        max_supply: response.data.attributes[2].value
      }]
    }
  },

  mounted() {},
};
</script>

<style lang="scss" scoped>
.stage-box {
  display: flex;
  gap: 1.5rem;
  align-items: center;
  .stage-label {
    font-size: 2.5rem;
  }
}
.drop-container {
  margin: 2rem 2rem;
}
.nft-box {
  width: 70%;
  margin: auto;
}
.upgrade-box {
  padding: 1rem;
  font-size: 1.2em;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style>
