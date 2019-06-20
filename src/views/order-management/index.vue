<template>
  <orderTable :tableList="list"/>
</template>

<script>
import orderTable from "@/components/orderTable";
import { getOrderList } from "@/api/orderList";

export default {
  components: {
    orderTable
  },
  data() {
    return {
      list: [
      ]
    };
  },
  created() {
    this.list = getOrderList();
  },
  methods:{
    
  }
};
</script>

<style scoped>
</style>
