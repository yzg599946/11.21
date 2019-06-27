<template>
  <timeslotTable :tableList="list"/>
</template>

<script>
import timeslotTable from "@/components/timeslotTable";
import { getTimeslotStatisticsWatch } from "@/api/orderList";

export default {
  components: {
    timeslotTable
  },
  data() {
    return {
      list: []
    };
  },
  created() {
    this.getTimeslotStatistics();
  },
  methods: {
    getTimeslotStatistics() {
      const contains = false;
      const rows = 1000;
      const page = 1;
      getTimeslotStatisticsWatch({
        contains: contains,
        rows: rows,
        page: page
      }).then(res => {
        const dataList = res.data.rows;
        dataList.forEach(dataItem => {
          const { timeCount, tNum } = dataItem;
          const listItem = { timeslot: timeCount, orderCount: tNum };
          this.list.push(listItem);
        });
      });
    }
  }
};
</script>

<style scoped>
</style>
