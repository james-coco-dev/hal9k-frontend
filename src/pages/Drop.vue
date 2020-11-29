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
        <div class="nft-box" v-if="droppedNft.length > 0">
          <pool-item :pools="droppedNft" :hasButton="false" />
        </div>
        <div class="nft-box" v-else>
          <div class="no-nft">No NFT Reward</div>
        </div>
      </section>
      <section class="e2 screen">
        <p class="label">Upgrade</p>
        <div class="upgrade-box">
          <div class="stage-box">
            <img src="@/static/images/stagelabel.png" width="30%" />
            <div class="stage-label">{{ stage }}</div>
          </div>
          <div>Welcome to NFT dropchance</div>
          <div class="button-group">
            <button class="button-4" v-if="droppedNft.length" @click="upgrade">
              Upgrade
            </button>
            <button class="button-4" v-if="droppedNft.length" @click="claim">
              Claim
            </button>
            <button class="button-4" @click="moveToNextStage">
              Next Stage
            </button>
          </div>
        </div>
      </section>
      <section class="screen">
        <p class="label">Chart</p>
        <img width="100%" src="@/static/images/dropchance-chart.gif" />
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
    droppedNft: [],
  }),
  components: { PoolItem },
  computed: {
    ...mapState({
      stage: (state) => state.account.stage,
      address: (state) => state.account.address,
      lastUpdateTime: (state) => state.lastUpdateTime,
      reward: (state) => state.account.reward,
      hal9k: (state) => state.contract.hal9k,
      hal9kNftPool: (state) => state.contract.hal9kNftPool,
    }),
  },
  methods: {
    async moveStage(backOrForth) {
      // Back if true, Forth if false
      const res = await this.hal9kNftPool.methods
        .moveStageBackOrForth(backOrForth)
        .send({ from: this.address });
      if (res && res.events.stageUpdated.returnValues.stage > this.stage) {
        this.$snotify.success(
          `Stage updated to ${res.events.stageUpdated.returnValues.stage}`
        );
        await this.setUserReward(this.address, 11);
        this.$store.commit("account/setAccount", {
          lastUpdateTime: res.events.stageUpdated.returnValues.lastUpdateTime,
          reward: 11,
          stage: res.events.stageUpdated.returnValues.stage,
        });
      } else {
        this.$snotify.error("Need to wait more to move to next stage");
        return;
      }
    },
    async getCardInfo(reward) {
      const response = await axios.get("https://api.hal9k.ai/hals/" + reward);
      this.droppedNft = [
        {
          id: reward,
          image: response.data.image,
          name: response.data.name,
          description: response.data.description,
          max_supply: response.data.attributes[2].value,
        },
      ];
    },
    async setUserReward(address, reward) {
      const userData = {
        address: address,
        reward: reward,
      };
      const response = await axios.post(API_URL + "/hal9k-user", userData);
      if (response.reward === reward) {
        this.$store.commit("account/setReward", reward);
      }
    },
    async upgrade(fromType, fromAmount, toType) {
      if (fromType > 0 && fromType < 5 && fromAmount < 25) return;
      if (fromType > 4 && fromType < 8 && fromAmount < 3) return;
      // burn original cards
      await this.hal9kNftPool.methods
        .burnCardForUser(0, fromType, fromAmount)
        .send({ from: this.address });
      // burn upgrade card
      await this.hal9kNftPool.methods
        .burnCardForUser(0, 11, 1)
        .send({ from: this.address });
      // mint new level card
      await this.hal9kNftPool.methods
        .mintCardForUser(0, toType, 1)
        .send({ from: this.address });
      this.$snotify.success("Minting Successed");
    },
    async moveToNextStage() {
      await this.moveStage(false);
      await this.setUserReward(this.address, 11);
    },
    async claim() {
      if (!this.hal9kNftPool) return;
      // Mint card for user
      const returnValue = await this.hal9kNftPool.methods
        .mintCardForUser(0, this.reward, 1)
        .send({ from: this.address });
      if (!returnValue || !returnValue.events.minted.returnValues.cardId) {
        this.$snotify.error("Failed to mint the card!");
        return;
      }
      this.$snotify.success("Successfully minted for you!");
      await this.moveStage(true); // Move one stage back
      await this.setUserReward(this.address, 11);
    },
  },
  async mounted() {
    if (this.reward > 0 && this.reward < 11) {
      this.getCardInfo(this.reward);
    }
    // await this.claim()
  },
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
.no-nft {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  font-size: 25px;
}
.upgrade-box {
  padding: 1rem;
  font-size: 1.2em;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style>
