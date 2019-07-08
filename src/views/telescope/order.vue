<template>
  <orderTable
    :category="category"
  />
</template>

<script>
import orderTable from "@/components/orderTable";
export default {
  name:'telescope-order',
  components: {
    orderTable
  },
  data() {
    return {
      category:'telescope'
    };
  }
};
</script>

<style scoped>
</style>
