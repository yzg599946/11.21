<template>
  <channelTable :tableList="list"/>
</template>
<script>
import channelTable from "@/components/channelTable";

export default {
  components: {
    channelTable
  },
  data() {
    return {
      list: [
        {
          channel: "微信小程序",
          orderCount: "4"
        },
        {
          channel: "快手",
          orderCount: "231"
        },
        {
          channel: "百度",
          orderCount: "14"
        }
      ]
    };
  }
};
</script>

<style scoped>
</style>
