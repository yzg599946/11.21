<template>
  <timeslotTable :category="category" />
</template>

<script>
import timeslotTable from "@/components/timeslotTable";

export default {
  name:'clothes-time',
  components: {
    timeslotTable
  },
  data() {
    return {
      category: "clothes"
    };
  }
};
</script>

<style scoped>
</style>
