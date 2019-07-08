<template>
  <orderTable
    :category="category"
  />
</template>

<script>
import orderTable from "@/components/orderTable";
export default {
  name:'cosmetic-order',
  components: {
    orderTable
  },
  data() {
    return {
      category:'cosmetic'
    };
  }
};
</script>

<style scoped>
</style>
