<template>
  <main-wrapper>
    <div>
      <div>
        <img width="30%" src="@/static/images/farm.png" />
      </div>
      <p>
        HAL9K/ETH Stake Pool
      </p>
      <div class="info-box">
        <div># APY</div>
        <div>
          <span class="yellow">{{ totalStaked }}</span> Tokens Staked (total)
        </div>
        <div>
          <span class="yellow">{{ yourStaked }}</span> Tokens Staked (yours)
        </div>
        <div>
          <span class="yellow">{{ claimableHal9k }}</span> Claimable HAL9K
        </div>
      </div>
      <input
        class="stake-input"
        type="number"
        v-model="stakeAmount"
        @keyup.enter="stake"
      />
      <div class="button-group">
        <button v-if="!isApproved" @click="approve">Approve LP</button>
        <button v-else @click="stake">Stake</button>
        <button @click="claim">Claim</button>
        <button @click="withdraw">Withdraw</button>
      </div>
    </div>
  </main-wrapper>
</template>

<script>
import { mapState } from "vuex";
import { Artifact } from "../../utils/config";
import BigNumber from "bignumber.js";
export default {
  data: () => ({
    totalStaked: 0,
    stakeAmount: 0,
    yourStaked: 0,
    claimableHal9k: 0,
    isApproved: false,
  }),
  computed: {
    ...mapState({
      address: (state) => state.account.address,
      hal9kVault: (state) => state.contract.hal9kVault,
      hal9kWethPair: (state) => state.contract.hal9kWethPair,
      web3: (state) => state.metamask.web3,
      provider: (state) => state.metamask.provider,
    }),
  },
  watch: {
    async provider() {
      if (this.provider) await this.loadContract();
    },
  },
  methods: {
    async claim() {},
    async withdraw() {},
    async stake() {
      try {
        const { transactionHash } = await this.hal9kVault.methods
          .deposit(0, this.web3.utils.toWei(this.stakeAmount))
          .send({ from: this.address });
        console.log(transactionHash);

        const tx = await this.web3.eth.getTransactionReceipt(transactionHash);
        console.log(tx);
      } catch (error) {
        console.error(error);
      }
    },
    async approve() {
      try {
        const res = await this.hal9kWethPair.methods
          .approve(
            Artifact.rinkeby.hal9kVault,
            new BigNumber(10).pow(new BigNumber(40)).toFixed()
          )
          .send({ from: this.address });
        if (res.transactionHash) await this.checkAllowance();
      } catch (err) {
        console.error(err.message);
      }
    },
    async checkAllowance() {
      try {
        const allowance = await this.hal9kWethPair.methods
          .allowance(this.address, Artifact.rinkeby.hal9kVault)
          .call();
        if (
          new BigNumber(allowance).isEqualTo(
            new BigNumber(10).pow(new BigNumber(40))
          )
        )
          this.isApproved = true;
      } catch (error) {
        console.error(error);
        this.isApproved = false;
      }
    },
    async loadContract() {
      await this.checkAllowance();
    },
  },
  async mounted() {
    await this.loadContract();
  },
};
</script>
<style lang="scss" scoped>
.stake-input {
  margin-bottom: 1rem;
  color: white;
  border: 1px solid white;
  background: transparent;
  outline: none;
}
</style>
