<template>
  <orderTable
    :category="category"
  />
</template>

<script>
import orderTable from "@/components/orderTable";
export default {
  name:'watch-order',
  components: {
    orderTable
  },
  data() {
    return {
      category:'watch'
    };
  }
};
</script>

<style scoped>
</style>
