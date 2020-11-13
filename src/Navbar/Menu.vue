<template>
  <section>
    <div
      class="menu"
      @mouseover="isOpened = true"
      @mouseleave="isOpened = false"
    >
      MENU
      <div class="menu-list" v-if="isOpened">
        <router-link class="menu-item" to="/">MAIN CONSOLE</router-link>
        <router-link class="menu-item" to="/shop">NFT GALLERY</router-link>
        <router-link class="menu-item" to="/event">LGE EVENT</router-link>
      </div>
    </div>
  </section>
</template>
<script>
export default {
  data: () => ({
    isOpened: false,
  }),
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
      text-align: center;
      color: #444;
      &:hover {
        background: #eee;
      }
    }
  }
}
</style>
