<template>
  <orderTable
    :category="category"
  />
</template>

<script>
import orderTable from "@/components/orderTable";
export default {
  name:'repellent-order',
  components: {
    orderTable
  },
  data() {
    return {
      category:'repellent'
    };
  }
};
</script>

<style scoped>
</style>
