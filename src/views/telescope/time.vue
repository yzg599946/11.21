<template>
  <timeslotTable :category="category" />
</template>

<script>
import timeslotTable from "@/components/timeslotTable";

export default {
  name:'telescope-time',
  components: {
    timeslotTable
  },
  data() {
    return {
      category: "telescope"
    };
  }
};
</script>

<style scoped>
</style>
