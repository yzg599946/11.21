<template>
    <div class="homepage-box">
        <img style="width: 750px; height: 226px" :src="url">
    </div>
</template>

<script>
export default {
  data() {
    return {
      url: "http://i2.tiimg.com/689844/30dbd702eea630e1.jpg"
    };
  }
};
</script>

<style lang="scss" scoped>
    .homepage-box{
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 50px;
    }
</style>
