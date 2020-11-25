<template>
  <section class="destination-box">
    <p class="blink">Choose a destination...</p>
    <div class="menu-list">
      <router-link class="menu-item" to="/">&#8227; Welcome</router-link>
      <router-link
        class="menu-item"
        to="/zap"
        :class="{ active: $route.name === 'zapper' }"
        >&#8227; Zapper</router-link
      >
      <router-link class="menu-item" to="/farm">&#8227; Farming</router-link>
      <router-link
        class="menu-item"
        to="/tokenomics"
        :class="{ active: $route.name === 'Tokenomics' }"
        >&#8227; Tokenomics</router-link
      >
      <a class="menu-item">&#8227; Twitter</a>
      <a class="menu-item">&#8227; Telegram</a>
      <a class="menu-item">&#8227; Medium</a>
    </div>
  </section>
</template>

<script>
export default {
  name: "destination-box",
};
</script>

<style lang="scss" scoped>
.menu-list {
  display: flex;
  flex-direction: column;
}
.menu-item {
  background-color: #0057b7;
  cursor: pointer;
  color: #fff;
  font-weight: bold;
  padding: 6px 10px;
  text-decoration: none;
  border: none;
  &.router-link-exact-active {
    background-color: #fff;
    color: #0057b7;
  }
  &:hover {
    background-color: #fff;
    color: #0057b7;
  }
  &:active {
    position: relative;
    top: 1px;
  }
}

.destination-box {
  padding: 0.5rem;
}
</style>
