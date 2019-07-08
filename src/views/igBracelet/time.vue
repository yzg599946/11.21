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
      category: "igbracelet"
    };
  }
};
</script>

<style scoped>
</style>
