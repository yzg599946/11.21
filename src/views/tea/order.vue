<template>
  <orderTable
    :category="category"
  />
</template>

<script>
import orderTable from "@/components/orderTable";
export default {
  name:'tea-order',
  components: {
    orderTable
  },
  data() {
    return {
      category:'tea'
    };
  }
};
</script>

<style scoped>
</style>
