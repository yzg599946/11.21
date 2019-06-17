<template>
  <div class="homepage-box">
    <img style="width: 750px; height: 226px" :src="url">
    <line-chart/>
  </div>
</template>

<script>
import LineChart from "./components/LineChart";

export default {
  components: {
    LineChart
  },
  data() {
    return {
      url: "http://i2.tiimg.com/689844/30dbd702eea630e1.jpg"
    };
  }
};
</script>

<style lang="scss" scoped>
.homepage-box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 50px;
}
</style>
