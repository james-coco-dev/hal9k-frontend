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
      address: (state) => state.account.address,
    }),
  },
};
</script>
<style lang="scss">
@import "./css/style.scss";
</style>
