<template>
  <timeslotTable :category="category" />
</template>

<script>
import timeslotTable from "@/components/timeslotTable";

export default {
  name:'heater-time',
  components: {
    timeslotTable
  },
  data() {
    return {
      category: "heater"
    };
  }
};
</script>

<style scoped>
</style>
