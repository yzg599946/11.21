<template>
  <areaTable :category="category" />
</template>

<script>
import areaTable from "@/components/areaTable";

export default {
  name:'shaver-region',
  components: {
    areaTable
  },
  data() {
    return {
      category: "shaver"
    };
  }
};
</script>

<style scoped>
</style>
