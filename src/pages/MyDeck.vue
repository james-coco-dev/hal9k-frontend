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
      
      // console.log(itemIndexArray, upgradeCardIndex);
      let upgradeCardCount = parseInt(this.myDeck[upgradeCardIndex].owns);

      itemIndexArray.map((elem, index) => {
        console.log(this.myDeck[elem]);
        const fromId = this.myDeck[elem].id;
        const fromCount = parseInt(this.myDeck[elem].owns);

        if (fromId > 0 && fromId < 5 && fromCount >= 25) { // Common to Rare
          this.upgradeCard(fromId, 25, this.getCardType(1));
          upgradeCardCount --;
        } else if (fromId > 4 && fromId < 8 && fromCount >= 3) { // Rare to Epic
          this.upgradeCard(fromId, 3, this.getCardInfo(2));
          upgradeCardCount --;
        } else if (fromId > 7 && fromId < 10 && fromCount >= 1) { // Epic to Legendary
          this.upgradeCard(fromId, 1, this.getCardInfo(3));
          upgradeCardCount --;
        }
      })
    },
    async upgradeCard(fromType, fromAmount, toType) {
      if (fromType > 0 && fromType < 5 && fromAmount < 25) {
        this.$snotify.info("You should have more than 25 Common cards to upgrade to Rare.")
        return;
      }
      if (fromType > 4 && fromType < 8 && fromAmount < 3) {
        this.$snotify.info("You should have more than 3 Rare cards to upgrade to Epic.")
        return;
      }
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

      await this.readBalance();
      this.$snotify.success("Minting Successed");
    },
    async readBalance() {
      if (!this.hal9kLtd) return;

      let addresses = [];
      let ids = [];
      
      for (let i = 1; i < 12; i++) {
        ids.push(i);
        addresses.push(this.address);
      }

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
    await this.readBalance();
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
