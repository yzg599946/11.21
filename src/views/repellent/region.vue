<template>
  <areaTable :category="category" />
</template>

<script>
import areaTable from "@/components/areaTable";

export default {
  name:'repellent-region',
  components: {
    areaTable
  },
  data() {
    return {
      category: "repellent"
    };
  }
};
</script>

<style scoped>
</style>
