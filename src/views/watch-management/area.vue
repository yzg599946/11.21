<template>
  <areaTable :tableList="list"/>
</template>

<script>
import areaTable from "@/components/areaTable";
import { getAreaStatisticsWatch } from "@/api/orderList";

export default {
  components: {
    areaTable
  },
  data() {
    return {
      list: []
    };
  },
  created() {
    this.getAreaStatistics();
  },
  methods: {
    getAreaStatistics() {
      const contains = false;
      const rows = 1000;
      const page = 1;
      getAreaStatisticsWatch({
        contains: contains,
        rows: rows,
        page: page
      }).then(res => {
        const dataList = res.data.rows;
        dataList.forEach(dataItem => {
          const { province, oNum } = dataItem;
          const listItem = { province: province, orderCount: oNum };
          this.list.push(listItem);
        });
      });
    }
  }
};
</script>

<style scoped>
</style>
