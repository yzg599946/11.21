<template>
  <timeslotTable :category="category" />
</template>

<script>
import timeslotTable from "@/components/timeslotTable";

export default {
  name:'shaver-time',
  components: {
    timeslotTable
  },
  data() {
    return {
      category: "shaver"
    };
  }
};
</script>

<style scoped>
</style>
