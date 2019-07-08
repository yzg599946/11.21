<template>
  <areaTable :category="category" />
</template>

<script>
import areaTable from "@/components/areaTable";

export default {
  name:'clothes-region',
  components: {
    areaTable
  },
  data() {
    return {
      category: "clothes"
    };
  }
};
</script>

<style scoped>
</style>
