<template>
  <orderTable
    :category="category"
  />
</template>

<script>
import orderTable from "@/components/orderTable";
export default {
  components: {
    orderTable
  },
  data() {
    return {
      category:'handbag'
    };
  }
};
</script>

<style scoped>
</style>
