<template>
  <orderTable
    :category="category"
  />
</template>

<script>
import orderTable from "@/components/orderTable";
export default {
  name:'clothes-order',
  components: {
    orderTable
  },
  data() {
    return {
      category:'clothes'
    };
  }
};
</script>

<style scoped>
</style>
