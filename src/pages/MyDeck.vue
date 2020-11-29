<template>
  <div class="shop-page">
    <div class="background-1"></div>
    <div class="signal">
      <img src="@/static/images/glow-mobile.gif" />
    </div>
    <div class="caption">My Deck</div>
    <div class="stage-container">Stage {{ stage }}</div>
    <div class="pool-container" v-if="myDeck.length">
      <div class="upgrade-row">
        You can update your common, rare, epic and legendary NFTs with
        <span class="yellow">Upgrade Eva.</span>
        <button
          class="upgrade-but white"
          :disabled="!isUpgradeSelected"
          @click="upgrade"
        >
          Upgrade
        </button>
      </div>
      <section>
        <div
          v-for="(nft, index) in myDeck"
          :key="index"
          class="pool-item"
          @click="itemClicked(index)"
        >
          <div class="select-indicator" v-show="selected[index]"></div>
          <div class="pool-image">
            <img :src="nft.image" :alt="nft.name" />
            <div class="indicator">
              <div class="supply" :class="{ 'left-radius': nft.owns }">
                {{ nft.max_supply }} Minted
              </div>
              <div class="remaining" v-if="nft.owns">{{ nft.owns }} Own</div>
            </div>
          </div>
          <div class="pool-info">
            <div class="nft-name">{{ nft.name }}</div>
            <div class="nft-description">{{ nft.description }}</div>
          </div>
        </div>
      </section>
    </div>
    <div class="no-nft" v-else>
      You don't own any NFTs.
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import axios from "axios";
import PoolItem from "@/components/PoolItem";
import { Artifact, API_URL, UPGRADE_ID, NFTConfig } from "../utils/config";
export default {
  data: () => ({
    myDeck: [],
    selected: [],
  }),
  components: {
    PoolItem,
  },
  computed: {
    ...mapState({
      stage: (state) => state.account.stage,
      address: (state) => state.account.address,
      balance: (state) => state.account.balance,
      reward: (state) => state.account.reward,
      hal9kLtd: (state) => state.contract.hal9kLtd,
    }),
    isUpgradeSelected() {
      const selectedCount = this.selected.filter((elem) => elem).length;
      const upgradeSelectedIndex = this.selected.findIndex(
        (elem, index) => elem && this.myDeck[index].id === UPGRADE_ID
      );
      if (selectedCount >= 2 && upgradeSelectedIndex >= 0) return true;
      return false;
    },
  },
  methods: {
    itemClicked(index) {
      if (index >= this.selected.length) return;
      this.$set(this.selected, index, !this.selected[index]);
    },
    upgrade() {
      let itemIndexArray = []; //selected index array of mydeck
      let upgradeCardIndex = this.myDeck.findIndex(
        (elem) => elem.id === UPGRADE_ID
      );
      this.selected.map((elem, index) => {
        if (elem && index !== upgradeCardIndex)
          return itemIndexArray.push(index);
      });
      console.log(itemIndexArray, upgradeCardIndex);
    },
    async readBalance(addresses, ids) {
      if (!this.hal9kLtd) return;
      const res = await this.hal9kLtd.methods
        .balanceOfBatch(addresses, ids)
        .call();
      for (let i = 0; i < 12; i++) {
        if (res[i] > 0) {
          this.getCardInfo(i + 1, res[i]);
        }
      }
      this.$store.commit("account/setBalance", res);
    },
    async getCardInfo(reward, count) {
      const response = await axios.get("https://api.hal9k.ai/hals/" + reward);
      this.myDeck.push({
        id: reward,
        image: response.data.image,
        name: response.data.name,
        description: response.data.description,
        max_supply: response.data.attributes[2].value,
        owns: count,
      });
      this.selected.push(false);
    },
  },
  async mounted() {
    let addresses = [];
    let ids = [];
    for (let i = 1; i < 12; i++) {
      ids.push(i);
      addresses.push(this.address);
    }
    await this.readBalance(addresses, ids);
  },
};
</script>
<style lang="scss" scoped>
.stage-container {
  font-size: 1rem;
  text-align: center;
}
.upgrade-row {
  margin-top: 1rem;
  font-size: 1.1rem;
  text-align: center;
}
.upgrade-but {
  margin-left: 1rem;
  &:disabled {
    border: 1px solid #fff3;
    color: #fff3;
    cursor: not-allowed;
  }
}
.no-nft {
  margin-top: 5rem;
  font-size: 1rem;
  color: white;
  text-align: center;
  display: flex;
  justify-content: center;
}
</style>
