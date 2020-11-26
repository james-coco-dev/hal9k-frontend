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
import axios from "axios";
import Loading from "./Loading";
export default {
  components: {
    Loading,
  },
  computed: {
    ...mapState({
      loading: (state) => state.loading,
      address: (state) => state.account.address,
      stage: (state) => state.account.stage,
      lastUpdateTime: (state) => state.account.lastUpdateTime,
      hal9k: (state) => state.contract.hal9k,
      hal9kVault: (state) => state.contract.hal9kVault,
      hal9kNftPool: (state) => state.contract.hal9kNftPool,
      web3: (state) => state.metamask.web3,
      provider: (state) => state.metamask.provider,
    }),
  },
  methods: {
    getCardType(category) {
      let cardType = 0;
      switch (category) {
        case 1: // Common
          cardType = Math.floor(Math.random() * 5);
          break;
        case 2: // Rare
          cardType = Math.floor(Math.random() * 4) + 4;
          break;
        case 3: // Epic
          cardType = Math.floor(Math.random() * 3) + 7;
          break;
        case 4: // Legendary
        default:
          cardType = 10;
          break;
      }
      return cardType;
    },
    getRewardByStage(dropNumber, stage) {
      let dropchance;
      let sum = 0;

      if (stage === 1) {
        dropchance = NFTConfig.dropChanceByStage.stage1;
      } else if (stage === 2) {
        dropchance = NFTConfig.dropChanceByStage.stage2;
      } else if (stage >= 3) {
        dropchance = NFTConfig.dropChanceByStage.stage3;
      }

      for (let i = 0; i < dropchance.length; i++) {
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
        let dropNum = Math.floor(Math.random() * 10001);
        
        // If already entered the stage but got no reward as a dropchance, 
        // set it 11 so that he can get reward in the next stage

        // Entered a new stage and get reward by dropchance
        if (this.stage == 0 && passedDays >= 1 && this.reward == 11) {
          // Stage 1
          if (dropNum < NFTConfig.dropChanceByStage.stage1Total) {
            this.$snotify.info(
              "Congratulations! You received NFT rewards for stage 1!"
            );
            let reward = this.getRewardByStage(dropNum, 1);
            this.setUserReward(this.address, reward);
          } else {
            this.$snotify.info(
              "You've successfully entered to Stage 1, but you're unlucky to nail the NFT reward."
            );
            this.setUserReward(this.address, 0);
          }
        } else if (this.stage == 1 && passedDays >= 2 && this.reward == 11) {
          // Stage 2
          if (dropNum < NFTConfig.dropChanceByStage.stage2Total) {
            this.$snotify.info(
              "Congratulations! You received NFT rewards for stage 2!"
            );
            let reward = this.getRewardByStage(dropNum, 2);
            this.setUserReward(this.address, reward);
          } else {
            this.$snotify.info(
              "You've successfully entered to Stage 2, but you're unlucky to nail the NFT reward."
            );
            this.setUserReward(this.address, 0);
          }
        } else if (this.stage >= 2 && passedDays >= 2 && this.reward == 11) {
          // Stage 3 and above
          if (dropNum < NFTConfig.dropChanceByStage.stage3Total) {
            this.$snotify.info(
              `Congratulations! You received NFT rewards for stage ${this
                .stage + 1}!`
            );
            let reward = this.getRewardByStage(dropNum, this.state + 1);
            this.setUserReward(this.address, reward);
          } else {
            this.$snotify.info(
              `You've successfully entered to Stage ${this.stage +
                1}, but you're unlucky to nail the NFT reward.`
            );
            this.setUserReward(this.address, 0);
          }
        }
      }
      setTimeout(this.startTimer, 1000 * 60 * 5);
    },
    async getUserInformation(address) {
      const userData = { address: address };
      const response = await axios.get(API_URL + "/hal9k-user", {
        params: { address: address },
      });
      if (response.data.lastupdatetime) {
        this.$store.commit("account/setAccount", {
          reward: response.data.reward,
          stage: response.data.stage,
          lastUpdateTime: response.data.lastupdatetime,
        });
        this.startTimer();
      } else {
        this.$store.dispatch("account/clearAccount");
      }
    },
    async createUser(address, reward, startTime, stage) {
      const userData = {
        address: address,
        reward: reward,
        lastUpdateTime: startTime,
        stage: stage,
      };
      const response = await axios.put(API_URL + "/hal9k-user", userData);
      if (response.data.address) {
        this.$snotify.info("Your NFT dropchance has started!");
      }
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
    async prepare() {
      if (!this.hal9kVault || !this.hal9k) return;
      // Add new pool
      await this.hal9kVault.methods.add(100, Artifact.rinkeby.pairAddress, false, false).send({ from: this.address });
      // Start Hal9k LGE
      await this.hal9k.methods.startLiquidityGenerationEventForHAL9K().send({ from: this.address });
    },
    async updateWaitTimeUnit(seconds) {
      if (!this.hal9kNftPool) return;
      const res = await this.hal9kNftPool.methods.updateWaitTimeUnit(seconds).send({from: this.address});
      if (res.events.waitTimeUnitUpdated.returnValues.waitTimeUnit) {
        this.$snotify.success("Successfully updated wait time unit");
      }
    },
    async isHal9kStakingStarted(sender) {
      if (!this.hal9kNftPool) return;
      const res = await this.hal9kNftPool.methods.isHal9kStakingStarted(sender).call();
      console.log(res);
    },
    async getStakeStartTime(sender) {
      if (!this.hal9kNftPool) return;
      const res = await this.hal9kNftPool.methods.getStakeStartTime(sender).call({from: this.address});
      console.log(res);
    },
    async getStakedAmountOfUser(sender) {
      if (!this.hal9kNftPool) return;
      const res = await this.hal9kNftPool.methods.getStakedAmountOfUser(sender).call({from: this.address});
      console.log(res);
    }
  },
  async mounted() {
    this.getUserInformation(this.address);
    this.getStakedAmountOfUser(this.address);
    this.getStakeStartTime(this.address);
  },
};
</script>
<style lang="scss">
@import "./css/style.scss";
@import "./css/pool.scss";
</style>
