<template>
  <timeslotTable :category="category" />
</template>

<script>
import timeslotTable from "@/components/timeslotTable";

export default {
  name:'cosmetic-time',
  components: {
    timeslotTable
  },
  data() {
    return {
      category: "cosmetic"
    };
  }
};
</script>

<style scoped>
</style>
