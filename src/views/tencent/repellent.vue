<template>
  <tencentTable :category="category" />
</template>

<script>
import tencentTable from "@/components/tencentTable";
export default {
  name: "tencent-repellent",
  components: {
    tencentTable
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
