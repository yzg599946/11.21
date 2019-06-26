<template>
  <orderTable :tableList="list"/>
</template>

<script>
import orderTable from "@/components/orderTable";
import { getOuterChainOrderWatch } from "@/api/orderList"
export default {
  components: {
    orderTable
  },
  data() {
    return {
      list: []
    };
  },
  created(){
    // getOuterChainOrderWatch().then(res => {
    //   console.log(res);
    // })
  }
};
</script>

<style scoped>
</style>
