<template>
  <section>
    <div
      class="menu"
      @mouseover="isOpened = true"
      @mouseleave="isOpened = false"
    >
      MENU
      <div class="menu-list" v-if="isOpened" @click="isOpened = false">
        <router-link class="menu-item" to="/" v-if="started"
          >MAIN CONSOLE</router-link
        >
        <router-link class="menu-item" to="/event">LGE EVENT</router-link>
        <router-link class="menu-item" to="/gallery" v-if="started && !ongoing"
          >NFT GALLERY</router-link
        >
        <router-link class="menu-item" to="/market" v-if="started && !ongoing"
          >MARKET</router-link
        >
        <router-link class="menu-item" to="/deck" v-if="started && !ongoing"
          >MY DECK</router-link
        >
        <router-link
          class="menu-item"
          to="/drop"
          v-if="started && !ongoing && stage"
          >NFT REWARD</router-link
        >
      </div>
    </div>
  </section>
</template>
<script>
import { mapState } from "vuex";
export default {
  data: () => ({
    isOpened: false,
  }),
  computed: {
    ...mapState({
      started: (state) => state.event.started,
      ongoing: (state) => state.event.ongoing,
      stage: (state) => state.account.stage,
    }),
  },
};
</script>
<style lang="scss" scoped>
.menu {
  font-weight: bold;
  padding: 6px 10px;
  cursor: pointer;
  color: white;
  background: black;
  border: 1px solid white;
  position: relative;
  .menu-list {
    position: absolute;
    display: flex;
    flex-direction: column;
    top: calc(100% + 1px);
    left: -1px;
    width: 150px;
    .menu-item {
      text-decoration: none;
      background: white;
      padding: 12px 16px;
      text-align: left;
      color: #444;
      &:hover {
        background: #eee;
      }
    }
  }
}
</style>
