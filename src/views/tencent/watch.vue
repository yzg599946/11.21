<template>
  <tencentTable :category="category" />
</template>

<script>
import tencentTable from "@/components/tencentTable";

export default {
  components: {
    tencentTable
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
