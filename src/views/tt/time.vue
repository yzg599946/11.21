<template>
  <timeslotTable :category="category" />
</template>

<script>
import timeslotTable from "@/components/timeslotTable";

export default {
  name: "tt-time",
  components: {
    timeslotTable
  },
  data() {
    return {
      category: "tt"
    };
  }
};
</script>

<style scoped>
</style>
