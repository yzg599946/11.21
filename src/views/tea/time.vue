<template>
  <timeslotTable :category="category" />
</template>

<script>
import timeslotTable from "@/components/timeslotTable";

export default {
  name:'tea-time',
  components: {
    timeslotTable
  },
  data() {
    return {
      category: "tea"
    };
  }
};
</script>

<style scoped>
</style>
