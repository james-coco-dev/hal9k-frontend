<template>
  <div>
    <div class="background-2"></div>
    <div class="event-title">HAL9K Liquidity Generation Event</div>
    <div class="event-box">
      <div class="left-day" v-if="!isFinished">
        Liquidity Event Ends in
        <p>
          <span class="red">{{ day }}</span> days
          <span class="red">{{ hour }}</span> hours
          <span class="red">{{ min }}</span> mins
          <span class="red">{{ sec }}</span> secs
        </p>
      </div>
      <div class="left-day" v-else>Liquidity Event Ended</div>
      <progress max="100" :value="value"></progress>
      <div class="event-infobox">
        <p>
          <span class="green">{{ totalEthContributed }}</span> ETH Total
          Contributed
        </p>
        <p>
          <span class="green">$ {{ halPrice }}</span> HAL9K Price Estimate after
          LGE
        </p>
        <p>
          <span class="green">$ {{ marketCap }}</span> Market Cap
        </p>
        <center>Thank You to everyone for participating!</center>
      </div>
      <div v-if="address">
        <div>
          <input type="checkbox" v-model="agree" id="agree-box" />
          <label for="agree-box" class="green"
            >I understand that this contract is provided with no warranty of any
            kind. I agree to not hold the contract creators, HAL9K team members
            or anyone associated with this event liable for any damage monetary
            and otherwise I might occur. I understand that any smart contract
            interaction carries an inherent risk.</label
          >
        </div>
        <button class="liquidity-add-but" :disabled="!agree">
          ADD LIQUIDITY AND GET LP TOKENS
        </button>
      </div>
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
  }),
  computed: {
    ...mapState({
      address: (state) => state.account.address,
    }),
    isFinished() {
      return (
        this.timestamp &&
        this.timestamp + this.liquidityEnds < this.currentTimestamp
      );
    },
  },
  methods: {
    retrieveTimestamp() {
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
  },
  mounted() {
    this.$store.commit("loading", true);
    setTimeout(() => {
      this.$store.commit("loading", false);
      this.timestamp = 1605097493;
      this.retrieveTimestamp();
    }, 1500);
  },
};
</script>
<style lang="scss" scoped>
.event-title {
  font-size: 3rem;
  text-align: center;
  padding: 3rem 0;
  margin-top: 1rem;
  font-weight: 700;
}
.event-box {
  width: 700px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: auto;
  margin-top: 2rem;
  padding: 2rem;
  .left-day {
    font-size: 1.5rem;
    text-align: center;
  }
  border: 1px solid white;
  background: #eeeeee10;
}
.red {
  color: red;
}
.green {
  color: #59f134;
}
.event-infobox {
  margin-top: 1rem;
  font-size: 1.2rem;
}
.liquidity-add-but {
  margin: auto;
  padding: 1rem;
  margin-top: 1rem;
  color: white;
  background: #eee1;
  width: 400px;
  border: 1px solid white;
  &:disabled {
    background: transparent;
    color: #eee3;
    border: 1px solid #eee3;
  }
}
</style>
