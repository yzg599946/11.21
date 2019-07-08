<template>
  <timeslotTable :category="category" />
</template>

<script>
import timeslotTable from "@/components/timeslotTable";

export default {
  name:'temporary-time',
  components: {
    timeslotTable
  },
  data() {
    return {
      category: "temporary"
    };
  }
};
</script>

<style scoped>
</style>
