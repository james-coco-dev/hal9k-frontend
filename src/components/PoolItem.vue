<template>
  <section>
    <div v-for="(nft, index) in pools" :key="index" class="pool-item">
      <div class="pool-image">
        <img :src="nft.image" :alt="nft.name" />
        <div class="indicator">
          <div class="left" :class="{ 'left-radius': nft.owns || nft.minted }">
            {{ nft.max_supply }} MAX
          </div>
          <div class="right" v-if="nft.minted">{{ nft.minted }} MINTED</div>
          <div class="right" v-else-if="nft.owns">{{ nft.owns }} Own</div>
        </div>
      </div>
      <div class="pool-info">
        <div class="nft-name">{{ nft.name }}</div>
        <div class="nft-description">{{ nft.description }}</div>
        <button class="button-3" @click="onClick(nft)" v-if="hasButton">
          {{ buttonText }}
        </button>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  props: {
    pools: {
      type: Array,
      default: [],
    },
    buttonText: {
      type: String,
    },
    hasButton: {
      type: Boolean,
      default: true,
    },
  },
  methods: {
    onClick(nft) {
      this.$emit("click", nft);
    },
  },
};
</script>

<style lang="scss" scoped></style>
