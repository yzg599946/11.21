<template>
  <areaTable :category="category" />
</template>

<script>
import areaTable from "@/components/areaTable";

export default {
  name:'tea-region',
  components: {
    areaTable
  },
  data() {
    return {
      category: "tea"
    };
  }
};
</script>

<style scoped>
</style>
