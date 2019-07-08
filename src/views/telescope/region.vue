<template>
  <areaTable :category="category" />
</template>

<script>
import areaTable from "@/components/areaTable";

export default {
  components: {
    areaTable
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
