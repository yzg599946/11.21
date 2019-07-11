<template>
  <tencentTable :category="category" />
</template>

<script>
import tencentTable from "@/components/tencentTable";

export default {
    name: "tencent-clothes",
  components: {
    tencentTable
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
