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
            <button class="button-4" v-if="droppedNft.length" @click="upgrade">Upgrade</button>
            <button class="button-4" v-if="droppedNft.length" @click="claim">Claim</button>
            <button class="button-4" @click="moveToNextStage">Next Stage</button>
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
    droppedNft: [],
  }),
  components: { PoolItem },
  computed: {
    ...mapState({
      stage: (state) => state.account.stage,
      address: (state) => state.account.address,
      reward: (state) => state.account.reward,
      hal9k: (state) => state.contract.hal9k,
      hal9kNftPool: (state) => state.contract.hal9kNftPool
    }),
  },
  mounted() {
    if (this.reward > 0 && this.reward < 11) {
      this.getCardInfo(this.reward);
    }
  },
  methods: {
    async updateUser(address, stage, lastUpdateTime, reward) {
      const userData = {
        address: address,
        stage: stage,
        lastUpdateTime: lastUpdateTime,
        reward: reward,
      };
      const response = await axios.post(API_URL + "/hal9k-user", userData);
      console.log("Successfully updated the user :", response);
    },
    async moveStage(backOrForth) {
      // Back if true, Forth if false
      const returnValue = await this.hal9kNftPool.methods
        .moveStageBackOrForth(backOrForth)
        .send({ from: this.address });
      if (returnValue && returnValue.events.stageUpdated.returnValues.stage) {
        this.$snotify.success(`Stage updated to ${returnValue.events.stageUpdated.returnValues.stage}`);
        this.updateUser(
          this.address,
          returnValue.events.stageUpdated.returnValues.stage,
          returnValue.events.stageUpdated.returnValues.lastUpdateTime
        );
      }
    },
    async getCardInfo(reward) {
      const response = await axios.get("https://api.hal9k.ai/hals/" + reward);
      this.droppedNft = [{
        id: reward,
        image: response.data.image,
        name: response.data.name,
        description: response.data.description,
        max_supply: response.data.attributes[2].value
      }]
    },
    async setUserReward(address, reward) {
      const userData = {
        address: address,
        reward: reward,
        lastUpdateTime: null,
        stage: null,
      };
      const response = await axios.post(API_URL + "/hal9k-user", userData);
      if (response.reward === reward) {
        console.log("Update success!");
        this.$store.commit(
          "account/setReward",
          reward
        );
      }
    },
    upgrade() {
    },
    moveToNextStage() {
      this.moveStage(false);
      this.setUserReward(this.address, 11);
    },
    async claim() {
      // Mint card for user
      const returnValue = await this.hal9kNftPool.methods.mintCardForUser(0, this.reward, 1).call();
      if (!returnValue || !returnValue.events.minted.cardId) {
        this.$snotify.error("Failed to mint the card!");
        return;
      }
      this.$snotify.success("Successfully minted for you!");
      this.moveStage(true);      // Move one stage back
      this.setUserReward(this.address, 11);
    },
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
