<template>
  <areaTable :category="category" />
</template>

<script>
import areaTable from "@/components/areaTable";

export default {
  name:'cosmetic-region',
  components: {
    areaTable
  },
  data() {
    return {
      category: "cosmetic"
    };
  }
};
</script>

<style scoped>
</style>
