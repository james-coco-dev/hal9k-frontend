<template>
  <div>
    <loading v-if="loading" />
    <nav-bar />
    <router-view />
  </div>
</template>
<script>
import { mapState } from "vuex";
import Loading from "./Loading";
export default {
  components: {
    Loading,
  },
  computed: {
    ...mapState({
      loading: (state) => state.loading,
    }),
  },
  mounted() {},
};
</script>
<style lang="scss">
@import "./css/style.scss";
</style>
