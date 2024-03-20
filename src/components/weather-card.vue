<template>
  <div class="weather">
    <span>{{ moment(new Date(startTime)).format("MM/DD HH:mm") }}</span>
    <span>~</span>
    <span>{{ moment(new Date(endTime)).format("MM/DD HH:mm") }}</span>
    <span>{{ weatherInfo }}</span>

    <img :src="imgURL" alt="wxData" />
  </div>
</template>

<style scoped>
@import "@/assets/scss/weathercard.scss";
</style>

<script setup>
import moment from "moment";

const props = defineProps({
  startTime: String,
  endTime: String,
  weatherInfo: String,
  imgURL: String,
});
</script>
