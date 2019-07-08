<template>
  <orderTable
    :category="category"
  />
</template>

<script>
import orderTable from "@/components/orderTable";
export default {
  name:'heater-order',
  components: {
    orderTable
  },
  data() {
    return {
      category:'heater'
    };
  }
};
</script>

<style scoped>
</style>
