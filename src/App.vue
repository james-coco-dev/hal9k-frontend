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
  mounted() {
    this.$store.commit("loading", true);
    setTimeout(() => {
      this.$store.commit("loading", false);
      this.$store.commit("event/setStarted", false);
      if (this.$route.name !== "Event") this.$router.push("/event");
    }, 1500);
  },
};
</script>
