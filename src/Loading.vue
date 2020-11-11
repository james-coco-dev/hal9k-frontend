<template>
  <div class="loading-overlay">
    <div class="loading">
      <img width="100px" src="/images/HALoading.gif" alt="loading" />
      <p class="blink">LOADING...</p>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.loading-overlay {
  background: #000;
  display: flex;
  place-items: center;
  place-content: center;
  height: 100vh;
  z-index: 100;
  text-align: center;
}
</style>
