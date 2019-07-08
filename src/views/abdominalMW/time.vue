<template>
  <timeslotTable :category="category" />
</template>

<script>
import timeslotTable from "@/components/timeslotTable";

export default {
  components: {
    timeslotTable
  },
  data() {
    return {
      category: "abdominalMW"
    };
  }
};
</script>

<style scoped>
</style>
