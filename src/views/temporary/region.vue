<template>
  <areaTable :category="category" />
</template>

<script>
import areaTable from "@/components/areaTable";

export default {
  name:'temporary-region',
  components: {
    areaTable
  },
  data() {
    return {
      category: "temporary"
    };
  }
};
</script>

<style scoped>
</style>
