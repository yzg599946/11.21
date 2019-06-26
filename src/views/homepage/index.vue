<template>
  <div class="homepage-box">
    <div class="homepage-image" v-if="device=='desktop'">
      <div>
        <img :src="url">
      </div>
      <div style="height:100%;">
        <el-row :gutter="35">
          <el-col :span="12">
            <el-table
              size="mini"
              max-height="200"
              border
              :show-header="headerShow"
              :data="overtimeTableData"
              style="width: 100%"
            >
              <el-table-column prop="category" label="项目" width="100"></el-table-column>
              <el-table-column prop="status" label="状态" width="100"></el-table-column>
            </el-table>
          </el-col>
          <el-col :span="12">
            <el-table
              size="mini"
              max-height="200"
              border
              :show-header="headerShow"
              :data="orderTableData"
              style="width: 100%"
            >
              <el-table-column prop="category" label="项目" width="100"></el-table-column>
              <el-table-column prop="status" label="状态" width="100"></el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </div>
    </div>
    <div v-else style="width:100%;">
      <div style="text-align:center;padding:10px;">
        <span>深圳市隆辉腾科技有限公司</span>
      </div>
      <div style="width:100%;display:flex;">
        <div style="width:48%;">
          <van-cell-group>
            <van-cell size="mini" title="项目" value="状态"/>
            <van-cell
              v-for="item in overtimeTableData"
              :key="item.index"
              size="mini"
              :title="item.category"
              value="有超时单"
            />
          </van-cell-group>
        </div>
        <div style="width:48%;">
          <van-cell-group>
            <van-cell size="mini" title="项目" value="状态"/>
            <van-cell
              v-for="item in orderTableData"
              :key="item.index"
              size="mini"
              :title="item.category"
              value="有订单"
            />
          </van-cell-group>
        </div>
      </div>
    </div>
    <line-chart/>
  </div>
</template>

<script>
import LineChart from "./components/LineChart";
import Vue from "vue";
import { getOrderStatus, getOrderCount, getEchartData } from "@/api/homepage";
import { Cell, CellGroup, Button } from "vant";
import { Promise } from "q";

Vue.use(Cell);
Vue.use(CellGroup);
Vue.use(Button);

export default {
  components: {
    LineChart
  },
  data() {
    return {
      url: "http://i2.tiimg.com/689844/30dbd702eea630e1.jpg",
      overtimeTableData: [],
      orderTableData: [],
      headerShow: true,
      device: ""
    };
  },
  created() {
    this.handleGetData();
    this.device = this.$store.state.app.device;
  },
  computed: {
    deviceVal() {
      return this.$store.state.app.device;
    }
  },
  watch: {
    deviceVal(newVal, oldVal) {
      this.device = newVal;
    }
  },
  methods: {
    handleGetData() {
      //获取超时单信息
      getOrderStatus().then(res => {
        let statusdataList = [];
        const orderStatusList = res.data;
        orderStatusList.forEach(orderStatusItem => {
          let data = { category: orderStatusItem, status: "有超时单" };
          statusdataList.push(data);
        });
        this.overtimeTableData = statusdataList;
      });
      //获取订单信息
      getOrderCount().then(res => {
        let countdataList = [];
        const orderCountList = res.data;
        orderCountList.forEach(orderCountItem => {
          let data = { category: orderCountItem, status: "有订单" };
          countdataList.push(data);
        });
        this.orderTableData = countdataList;
      });
      //获取曲线图数据
      getEchartData().then(res => {
        const echartData = res;
        console.log(echartData)
      })
    }
  }
};
</script>

<style lang="scss" scoped>
.homepage-box {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  padding: 50px;
  height: 90vh;
}
.homepage-image {
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 40%;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.homepage-image img {
  // position: absolute;
  // width: 40%;
}

.mobile .homepage-box {
  padding: 10px;
}

.mobile .homepage-image img {
  width: 90%;
}
</style>
