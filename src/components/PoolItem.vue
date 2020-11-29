<template>
  <section>
    <div v-for="(nft, index) in pools" :key="index" class="pool-item">
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
