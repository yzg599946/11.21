<template>
  <tencentTable :category="category" />
</template>

<script>
import tencentTable from "@/components/tencentTable";

export default {
      name:'tencent-temporary',
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
