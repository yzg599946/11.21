<template>
  <timeslotTable :tableList="list"/>
</template>

<script>
import timeslotTable from "@/components/timeslotTable";

export default {
  components: {
    timeslotTable
  },
  data() {
    return {
      list: [
        {
          timeslot: "00:00~01:00",
          orderCount: "4"
        },
        {
          timeslot: "01:00~02:00",
          orderCount: "231"
        },
        {
          timeslot: "02:00~03:00",
          orderCount: "14"
        }
      ]
    };
  }
};
</script>

<style scoped>
</style>
