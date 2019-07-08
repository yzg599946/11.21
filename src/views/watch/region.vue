<template>
  <areaTable :category="category" />
</template>

<script>
import areaTable from "@/components/areaTable";

export default {
  name:'watch-region',
  components: {
    areaTable
  },
  data() {
    return {
      category: "watch"
    };
  }
};
</script>

<style scoped>
</style>
