<template>
  <div>
    <div class="background-2"></div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState({
      started: (state) => state.event.started,
    }),
  },
  mounted() {
    if (!this.started) this.$router.push("/");
  },
};
</script>
<style scoped></style>
