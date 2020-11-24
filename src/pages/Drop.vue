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
          <pool-item :pools="pools" :hasButton="false" />
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
//import axios from "axios";
export default {
  data: () => ({
    pools: [
      {
        //this is an example, should be retrieve from the backend or contract
        id: 1,
        image: "https://images.hal9k.ai/Chair_1x1.jpg",
        name: "Chair",
        description: "Common chair",
        max_supply: 2500,
      },
    ],
  }),
  components: { PoolItem },

  computed: {
    ...mapState({
      stage: (state) => state.account.stage,
    }),
  },
  methods: {
    upgrade() {},
    claim() {},
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
