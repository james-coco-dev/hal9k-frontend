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

<style lang="scss" scoped>
.pool-item {
  height: 100%;
  background: rgba(2, 18, 33, 0.85);
  border: #0084ff 1px solid;
  .pool-image {
    position: relative;
    display: inline-grid;
    img {
      max-width: 100%;
      border-bottom: #0084ff 1px solid;
    }
    .indicator {
      position: absolute;
      font-size: 1rem;
      color: white;
      bottom: -15px;
      left: 50%;
      outline: 0;
      transform: translateX(-50%);
      display: inline-flex;
      .supply {
        background-color: #0084ff;
        padding: 5px 10px;
        border-radius: 8px;
        text-align: center;
        white-space: nowrap;
        text-transform: uppercase;
        &.left-radius {
          border-radius: 8px 0 0 8px;
        }
      }
      .remaining {
        padding: 5px 10px;
        margin-left: -1px;
        white-space: nowrap;
        text-align: center;
        text-transform: uppercase;
        border-radius: 0 8px 8px 0;
        background: #005fc9;
      }
    }
  }
  .pool-info {
    margin-top: 20px;
    text-align: center;
    margin-bottom: 1rem;
    .nft-name {
      font-size: 1rem;
      font-weight: bold;
      color: rgb(0, 180, 255);
    }
    .nft-description {
      margin: 1rem 0;
      color: white;
    }
  }
}
</style>
