<template>
  <areaTable :category="category" />
</template>

<script>
import areaTable from "@/components/areaTable";

export default {
  name:'igBracelet-region',
  components: {
    areaTable
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
