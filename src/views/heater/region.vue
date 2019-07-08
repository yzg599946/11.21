<template>
  <areaTable :category="category" />
</template>

<script>
import areaTable from "@/components/areaTable";

export default {
  name:'heater-region',
  components: {
    areaTable
  },
  data() {
    return {
      category: "heater"
    };
  }
};
</script>

<style scoped>
</style>
