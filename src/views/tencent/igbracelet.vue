<template>
  <tencentTable :category="category" />
</template>

<script>
import tencentTable from "@/components/tencentTable";

export default {
    name: "tencent-igbracelet",
  components: {
    tencentTable
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
