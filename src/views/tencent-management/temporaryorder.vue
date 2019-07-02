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
      category: "temporary"
    };
  }
};
</script>
<style scoped>
</style>
