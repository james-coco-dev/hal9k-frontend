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
            <div>
              <span class="yellow">{{ totalEthContributed }}</span> ETH Total
              Contributed
            </div>
            <div>
              <span class="yellow">$ {{ halPrice }}</span> HAL9K Price Estimate
              after LGE
            </div>
            <div>
              <span class="yellow">$ {{ marketCap }}</span> Market Cap
            </div>
          </div>
          <div v-if="address">
            <div v-if="liquidityOngoing">
              <div class="deposit-box">
                <div>Deposit ETH:</div>
                <input
                  class="deposit-input"
                  v-model="ethToDeposit"
                  @keyup.enter="addLiquidity"
                />
              </div>
              <div class="agree-container">
                <input type="checkbox" v-model="agree" id="agree-box" />
                <label for="agree-box">
                  I understand that this contract is provided with no warranty
                  of any kind. I agree to not hold the contract creators, HAL9K
                  team members or anyone associated with this event liable for
                  any damage monetary and otherwise I might occur. I understand
                  that any smart contract interaction carries an inherent risk.
                </label>
              </div>
              <button
                class="event-but"
                :disabled="!agree"
                @click="addLiquidity"
              >
                ADD LIQUIDITY AND GET LP TOKENS
              </button>
            </div>
            <div v-else>
              <button class="event-but" @click="claimLpToken">
                CLAIM LP TOKENS
              </button>
            </div>
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
          <div class="left-day" v-if="liquidityOngoing">
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
import axios from "axios";
import BigNumber from "bignumber.js";
export default {
  data: () => ({
    agree: false,
    value: 0,
    timestamp: 0,
    currentTimestamp: 0,
    //liquidityEnds: 7 * 24 * 60 * 60,
    liquidityEnds: 10 * 60,
    day: 0,
    hour: 0,
    min: 0,
    sec: 0,
    totalEthContributed: 0,
    liquidityOngoing: false,
    halPrice: 0,
    marketCap: 0,
    ethToDeposit: 0,
    usdPrice: 0,
  }),

  computed: {
    ...mapState({
      address: (state) => state.account.address,
      hal9k: (state) => state.contract.hal9k,
      web3: (state) => state.metamask.web3,
      provider: (state) => state.metamask.provider,
    }),
  },
  watch: {
    async provider() {
      if (this.provider) await this.loadContract();
    },
    ethToDeposit() {
      this.ethToDeposit = String(this.ethToDeposit).replace(/[^0-9.]/, "");
    },
  },
  methods: {
    async fetchTokenPrice() {
      const {
        data: {
          ethereum: { usd: ethUSD },
        },
      } = await axios.get(
        "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
      );
      this.usdPrice = ethUSD;
      setTimeout(this.fetchTokenPrice, 60000);
    },
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

    async getTokenInfo() {
      if (!this.hal9k) return;
      const res = await this.hal9k.methods.totalETHContributed().call();
      this.totalEthContributed = Math.max(0, this.web3.utils.fromWei(res));
      const totalSupply = await this.hal9k.methods.totalSupply().call();
      this.halPrice = new BigNumber(
        (this.totalEthContributed / this.web3.utils.fromWei(totalSupply)) *
          this.usdPrice
      ).toFixed(5);
      this.marketCap = new BigNumber(
        this.totalEthContributed * this.usdPrice
      ).toFixed(5);
    },
    async claimLpToken() {
      await this.hal9k.methods.claimLPTokens().send({
        from: this.address,
      });
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
          this.$snotify.success("Successfully deposited");
          await this.getTokenInfo();
        }
      } catch (e) {
        this.$snotify.error(e.message);
      }
    },
    async loadContract() {
      if (!this.hal9k) return;
      this.$store.commit("loading", true);
      this.liquidityOngoing = await this.hal9k.methods
        .liquidityGenerationOngoing()
        .call();
      if (this.liquidityOngoing) {
        try {
          const startTimestamp = await this.hal9k.methods
            .contractStartTimestamp()
            .call();
          if (startTimestamp <= 0) {
            this.$store.commit("loading", false);
            return;
          }
          this.timestamp = parseInt(startTimestamp);
        } catch (e) {
          this.$snotify.error(e.message);
        }
        const balance = await this.web3.eth.getBalance(this.address);
        this.ethToDeposit = new BigNumber(
          this.web3.utils.fromWei(balance)
        ).toFixed(2, 1);
        this.retrieveTimestamp();
      } else {
        const LPGenerationCompleted = await this.hal9k.methods
          .LPGenerationCompleted()
          .call();
        if (!LPGenerationCompleted)
          await this.hal9k.methods
            .addLiquidityToUniswapHAL9KxWETHPair()
            .send({ from: this.address });
      }
      await this.getTokenInfo();
      this.$store.commit("loading", false);
    },
  },

  async mounted() {
    await this.fetchTokenPrice();
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
  padding: 0 5px;
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

.event-but {
  background: transparent;
  border: 1px solid white;
  color: white;
  &:disabled {
    border: 1px solid #fff3;
    color: #fff3;
  }
}
</style>
