<template>
  <div>
    <loading v-if="loading" />
    <nav-bar />
    <router-view />
    <vue-snotify />
  </div>
</template>
<script>
import { mapState } from "vuex";
import { Artifact, API_URL, NFTConfig } from "./utils/config";
import axios from 'axios';
import Loading from "./Loading";
export default {
  components: {
    Loading,
  },
  computed: {
    ...mapState({
      loading: (state) => state.loading,
      address: (state) => state.account.address,
      lastUpdateTime: (state) => state.account.lastUpdateTime,
      stage: (state) => state.account.stage,
      web3: (state) => state.metamask.web3,
      provider: (state) => state.metamask.provider,
    }),
  },
  methods: {
    getCardType(category) {
      let cardType = 0;
      switch(category) {
        case 1:   // Common
          cardType = Math.floor(Math.random() * 5)
          break;
        case 2:   // Rare
          cardType = Math.floor(Math.random() * 4) + 4;
          break;
        case 3:   // Epic
          cardType = Math.floor(Math.random() * 3) + 7;
          break;
        case 4:   // Legendary
        default:
          cardType = 10
          break;
      }
      return cardType;
    },
    getRewardByStage(dropNumber, stage) {
      let dropchance;
      let sum = 0;

      if (stage === 1) {
        dropchance = NFTConfig.stage1;
      } else if (stage === 2) {
        dropchance = NFTConfig.stage2;
      } else if (stage >= 3) {
        dropchance = NFTConfig.stage3;
      }
      
      for (let i = 0; i < dropchance.length(); i ++) {
        sum += dropchance[i];
        if (dropNumber <= sum) {
          return this.getCardType(i + 1);
        }
      }
      return 0;
    },
    async startTimer() {
      if (this.lastUpdateTime) {
        const now = Date.now() / 1000;
        const passedDays = (now - this.lastUpdateTime) / 60 / 60 / 24;
        const dropNum = Math.floor(Math.random() * 10001);

        if (this.stage == 0 && passedDays >= 1) {        // Stage 1
          if (dropNum < NFTConfig.stage1Total) {
            this.$snotify.info("Congratulations! You received NFT rewards for stage 1!");
            this.$store.commit("reward/setRewardNft", this.getRewardByStage(dropNum, 1));
          } else {
            this.$snotify.info("You've successfully entered to Stage 1, but you're unlucky to nail the NFT reward.")
          }
        } else if (this.stage == 1 && passedDays >= 2) {   // Stage 2
          if (dropNum < NFTConfig.stage2Total) {
            this.$snotify.info("Congratulations! You received NFT rewards for stage 2!");
            this.$store.commit("reward/setRewardNft", this.getRewardByStage(dropNum, 2));
          } else {
            this.$snotify.info("You've successfully entered to Stage 2, but you're unlucky to nail the NFT reward.")
          }
        } else if (this.stage >= 2 && passedDays >= 2) {    // Stage 3 and above
          if (dropNum < NFTConfig.stage3Total) {
            this.$snotify.info(`Congratulations! You received NFT rewards for stage ${this.stage + 1}!`);
            this.$store.commit("reward/setRewardNft", this.getRewardByStage(dropNum, this.stage + 1));
          } else {
            this.$snotify.info(`You've successfully entered to Stage ${this.stage + 1}, but you're unlucky to nail the NFT reward.`)
          }
        }
      }
      setTimeout(this.startTimer, 1000);
    },
    async getUserInformation(address) {
      const userData = { address: address };
      const response = await axios.get(API_URL + "/hal9k-user", { params: { address: address }});
      if (response.data.balance) {
        this.$store.commit("account/setAccount", {
          balance: response.data.balance,
          stage: response.data.stage,
          lastUpdateTime: response.data.lastupdatetime
        });
        this.startTimer();
      } else {
        this.$store.dispatch("account/clearAccount");
      }
    },
    async createUser(address, balance, startTime, stage) {
      const userData = { address: address, balance: balance, lastUpdateTime: startTime, stage: stage };
      const response = await axios.put(API_URL + "/hal9k-user", userData);
      if (response.data.address) {
        this.$snotify.info("Your NFT dropchance has started!");
      }
    },
  },
  async mounted() {
    this.getUserInformation("0x6618876726c060b2gdgd3fcdwe3a7567c0b9f31f13b78d07");
  }
};
</script>
<style lang="scss">
@import "./css/style.scss";
</style>
