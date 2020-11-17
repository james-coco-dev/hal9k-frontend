<template>
  <div>
    <div class="background-1"></div>

    <div class="signal">
      <img src="@/static/images/glow-mobile.gif" />
    </div>
    <div class="row event-container">
      <section class="e1 screen">
        <p class="label">LGE 1</p>
        <div class="lge-box">
          <img class="blink" src="@/static/images/lge1.png" width="30%" />
          <div class="info-box">
            <div>{{ totalEthContributed }} ETH Total Contributed</div>
            <div>$ {{ halPrice }} HAL9K Price Estimate after LGE</div>
            <div>{{ marketCap }} Market Cap</div>
          </div>
          <div v-if="address">
            <div class="deposit-box">
              <div>Deposit ETH:</div>
              <input
                class="deposit-input"
                v-model="ethToDeposit"
                v-on:keyup.enter="addLiquidity"
              />
            </div>
            <div class="agree-container">
              <input type="checkbox" v-model="agree" id="agree-box" />
              <label for="agree-box">
                I understand that this contract is provided with no warranty of
                any kind. I agree to not hold the contract creators, HAL9K team
                members or anyone associated with this event liable for any
                damage monetary and otherwise I might occur. I understand that
                any smart contract interaction carries an inherent risk.
              </label>
            </div>
            <button
              class="liquidity-add-but"
              :disabled="!agree"
              v-on:click="addLiquidity"
            >
              ADD LIQUIDITY AND GET LP TOKENS
            </button>
          </div>
        </div>
      </section>
      <section class="e2 screen">
        <p class="label">EVENT</p>
        <div class="event-box">
          <div class="progress-box">
            <img
              class="blink"
              src="@/static/images/eventlabel.png"
              width="30%"
            />
            <progress max="100" :value="value"></progress>
          </div>
          <div class="left-day" v-if="!isFinished">
            <p>Liquidity Event Ends in</p>
            <p>{{ day }} days</p>
            <p>{{ hour }} hours</p>
            <p>{{ min }} mins</p>
            <p>{{ sec }} secs</p>
          </div>
          <div class="left-day" v-else>Liquidity Event Ended</div>
          <img class="blink" src="@/static/images/event.png" width="70%" />
        </div>
      </section>
      <section class="screen">
        <p class="label">C 3</p>
        <img width="100%" src="@/static/images/c7.gif" />
      </section>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  data: () => ({
    agree: false,
    value: 0,
    timestamp: 0,
    currentTimestamp: 0,
    liquidityEnds: 7 * 24 * 60 * 60,
    day: 0,
    hour: 0,
    min: 0,
    sec: 0,
    totalEthContributed: 0,
    halPrice: 0,
    marketCap: 0,
    ethToDeposit: 0,
  }),

  computed: {
    ...mapState({
      address: (state) => state.account.address,
      hal9k: (state) => state.contract.hal9k,
      web3: (state) => state.metamask.web3,
      provider: (state) => state.metamask.provider,
    }),
    isFinished() {
      return (
        this.timestamp &&
        this.timestamp + this.liquidityEnds < this.currentTimestamp
      );
    },
  },
  watch: {
    async provider() {
      if (this.provider) await this.loadContract();
    },
    ethToDeposit() {
      this.ethToDeposit = this.ethToDeposit.replace(/[^0-9.]/, "");
    },
  },
  methods: {
    retrieveTimestamp() {
      if (!this.provider) {
        this.sec = 0;
        this.min = 0;
        this.hour = 0;
        this.day = 0;
        return;
      }
      this.currentTimestamp = Math.round(new Date().getTime() / 1000);
      const leftSecs =
        this.timestamp + this.liquidityEnds - this.currentTimestamp;
      this.value = Math.floor(
        ((this.currentTimestamp - this.timestamp) / this.liquidityEnds) * 100
      );
      this.sec = leftSecs % 60;
      this.min = Math.floor(leftSecs / 60) % 60;
      this.hour = Math.floor(leftSecs / 60 / 60) % 24;
      this.day = Math.floor(leftSecs / 60 / 60 / 24);
      setTimeout(() => this.retrieveTimestamp(), 1000);
    },

    async getTotalEthContributed() {
      if (!this.hal9k) return;
      const res = await this.hal9k.methods.totalETHContributed().call();
      this.totalEthContributed = Math.max(0, this.web3.utils.fromWei(res));
    },

    async addLiquidity($event) {
      if (!this.agree || !this.hal9k || !parseFloat(this.ethToDeposit)) return;
      try {
        const ethToDeposit = this.web3.utils.toWei(this.ethToDeposit);
        const returnValue = await this.hal9k.methods
          .addLiquidity(this.agree)
          .send({
            from: this.address,
            value: ethToDeposit,
          });
        if (
          returnValue &&
          returnValue.events.LiquidityAddition.returnValues.value ===
            ethToDeposit
        ) {
          console.log("Successed");
        }
      } catch (e) {
        console.error(e);
      }
    },
    async loadContract() {
      if (!this.hal9k) return;
      this.$store.commit("loading", true);
      try {
        const startTimestamp = await this.hal9k.methods
          .contractStartTimestamp()
          .call();
        this.timestamp = parseInt(startTimestamp);
      } catch (e) {
        console.error(e);
      }
      await this.getTotalEthContributed();
      this.$store.commit("loading", false);
      this.retrieveTimestamp();
    },
  },

  async mounted() {
    await this.loadContract();
  },
};
</script>

<style lang="scss" scoped>
.event-container {
  margin: 2rem 2rem;
}
.lge-box,
.event-box {
  padding: 1rem;
  font-size: 1.2em;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.left-day {
  font-size: 20px;
  text-align: left;
  p {
    font-weight: 500;
  }
}
.deposit-box {
  margin-bottom: 1rem;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.deposit-input {
  font-family: inherit;
  font-size: 17px;
  outline: none;
  width: 60%;
  color: white;
  background: transparent;
  border: 1px solid rgb(255, 255, 255);
}
.info-box {
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.agree-container {
  margin-bottom: 20px;
}
.progress-box {
  display: flex;
  flex-direction: row;
  gap: 20px;
  progress {
    flex: 1;
  }
}

.liquidity-add-but {
  background: transparent;
  border: 1px solid white;
  color: white;
  &:disabled {
    border: 1px solid #fff3;
    color: #fff3;
  }
}
</style>
