<template>
  <areaTable :category="category" />
</template>

<script>
import areaTable from "@/components/areaTable";

export default {
  name:'telescope-region',
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
