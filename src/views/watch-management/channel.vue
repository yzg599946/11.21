<template>
  <channelTable :tableList="list"/>
</template>
<script>
import channelTable from "@/components/channelTable";
import { getChannelStatisticsWatch } from "@/api/orderList";

export default {
  components: {
    channelTable
  },
  data() {
    return {
      list: []
    };
  },
  created() {
    this.getChannelStatistics();
  },
  methods: {
    getChannelStatistics() {
      const contains = false;
      const rows = 1000;
      const page = 1;
      getChannelStatisticsWatch({
        contains: contains,
        rows: rows,
        page: page
      }).then(res => {
        const dataList = res.data.rows;
        dataList.forEach(dataItem => {
          const { cpName, pNum } = dataItem;
          const listItem = { channel: cpName, orderCount: pNum };
          this.list.push(listItem);
        });
      });
    }
  }
};
</script>

<style scoped>
</style>
