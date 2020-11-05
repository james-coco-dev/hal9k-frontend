<template>
  <main class="home">
    <div class="row">
      <section class="c1 screen">
        <p class="label">C 1</p>
        <DestinationBox />
      </section>
      <section class="c2 screen">
        <p class="label">C 2</p>
        <div class="c2-container scale-up-tl"><slot></slot></div>
      </section>
      <section class="empty"></section>
      <section class="c3 screen">
        <p class="label">C 3</p>
        <img width="100%" src="/images/c3.gif" />
      </section>
      <section class="c4 screen">
        <p class="label">C 4</p>
        <img width="100%" src="/images/c4.gif" />
      </section>
    </div>
    <div class="row">
      <section class="c5 screen">
        <p class="label">C 5</p>
        <img width="100%" src="/images/c5.gif" />
      </section>
      <section class="c6 screen">
        <p class="label">C 6</p>
        <img width="100%" src="/images/c6.gif" />
      </section>
      <section class="loading">
        <img width="45%" src="/images/hal9kloading.gif" />
      </section>
      <section class="c7 screen">
        <p class="label">C 7</p>
        <img width="100%" src="/images/c7.gif" />
      </section>
      <section class="c8 screen">
        <p class="label">C 8</p>
        <img width="100%" src="/images/c8.gif" />
      </section>
    </div>
  </main>
</template>

<script>
import DestinationBox from "@/components/DestinationBox";
export default {
  components: {
    DestinationBox,
  },
};
</script>

<style scoped></style>
