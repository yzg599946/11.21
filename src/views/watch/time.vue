<template>
  <timeslotTable :category="category" />
</template>

<script>
import timeslotTable from "@/components/timeslotTable";

export default {
  name:'watch-time',
  components: {
    timeslotTable
  },
  data() {
    return {
      category: "watch"
    };
  }
};
</script>

<style scoped>
</style>
