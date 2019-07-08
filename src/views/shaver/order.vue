<template>
  <orderTable
    :category="category"
  />
</template>

<script>
import orderTable from "@/components/orderTable";
export default {
  name:'shaver-order',
  components: {
    orderTable
  },
  data() {
    return {
      category:'shaver'
    };
  }
};
</script>

<style scoped>
</style>
