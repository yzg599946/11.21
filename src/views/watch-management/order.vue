<template>
  <orderTable :tableList="list" @listenToChildEvent="editConfirm"/>
</template>

<script>
import orderTable from "@/components/orderTable";
import {
  getOuterChainOrderWatch,
  editOuterChainOrderWatch
} from "@/api/orderList";
export default {
  components: {
    orderTable
  },
  data() {
    return {
      list: []
    };
  },
  created() {
    const contains = false;
    const rows = 400;
    const page = 1;
    getOuterChainOrderWatch({
      contains: contains,
      rows: rows,
      page: page
    }).then(res => {
      const tableData = res.data.rows;
      tableData.forEach(tableItem => {
        const {
          id,
          cpName,
          productName,
          colorName,
          username,
          telephone,
          totalCost,
          pNum,
          num,
          price,
          isRepeat,
          address,
          createTime,
          remark,
          mode,
          name,
          operator,
          operatingTime
        } = tableItem;
        const orderItem = {
          id: id,
          channel: cpName,
          productName: productName,
          color: colorName,
          name: name,
          phoneNumber: telephone,
          count: num,
          price: totalCost,
          repeatOrder: isRepeat,
          address: address,
          createTime: createTime,
          remarks: remark,
          isUseful: false,
          logisticsState: mode,
          salesman: username,
          operator: operator,
          nuclearOrderInterval: operatingTime
        };
        this.list.push(orderItem);
      });
    });
  },
  methods: {
    editConfirm(data) {
      console.log(data)
      const { id, productId, name, color, count, price, remarks, address } = data;
      const params = {
        id:id,
        productId: productId,
        name: name,
        colorName: color,
        num: count,
        totalCost: price,
        remark: remarks,
        address: address
      };
      editOuterChainOrderWatch(params).then(res => {
        console.log(res.status);        
      });
    }
  }
};
</script>

<style scoped>
</style>
