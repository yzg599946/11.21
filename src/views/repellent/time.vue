<template>
  <timeslotTable :category="category" />
</template>

<script>
import timeslotTable from "@/components/timeslotTable";

export default {
  name:'repellent-time',
  components: {
    timeslotTable
  },
  data() {
    return {
      category: "repellent"
    };
  }
};
</script>

<style scoped>
</style>
