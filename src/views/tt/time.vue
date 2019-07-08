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
      category: "tt"
    };
  }
};
</script>

<style scoped>
</style>
