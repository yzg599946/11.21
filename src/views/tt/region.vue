<template>
  <areaTable :category="category" />
</template>

<script>
import areaTable from "@/components/areaTable";

export default {
  name: "tt-region",
  components: {
    areaTable
  },
  data() {
    return {
      category: "tt"
    };
  }
};
</script>

<style scoped>
</style>
