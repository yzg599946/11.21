<template>
  <div class="homepage-box">
    <div class="homepage-image">
      <img :src="url">
    </div>
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
  height: 90vh;
}
.homepage-image {
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 40%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.homepage-image img {
  position: absolute;
  width: 40%;
}

.mobile .homepage-box {
  padding: 10px;
}

.mobile .homepage-image img {
  width: 90%;
}
</style>
