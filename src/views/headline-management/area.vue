<template>
  <areaTable :tableList="list"/>
</template>

<script>
import areaTable from "@/components/areaTable";

export default {
  components: {
    areaTable
  },
  data() {
    return {
      list: [
        {
          province: "湖北",
          orderCount: "4"
        },
        {
          province: "湖南",
          orderCount: "231"
        },
        {
          province: "广东",
          orderCount: "14"
        }
      ]
    };
  }
};
</script>

<style scoped>
</style>
