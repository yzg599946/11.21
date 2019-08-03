<template>
  <div class="homepage-box" :style="device=='desktop'?'display: flex;':''">
    <div class="homepage-image" v-if="device=='desktop'">
      <div>
        <img :src="url" />
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
      <div style="display:flex;justify-content:center;margin-top:10px;">
        <img :src="mobileUrl" style="height:100%;width:100%;" />
      </div>
      <div style="display:flex;justify-content:space-around;position:relative;top:40px;">
        <el-badge :value="overtimeTableData.length">
          <el-button size="small" @click="handleGetTimeOut">超时单</el-button>
        </el-badge>
        <el-badge :value="orderTableData.length">
          <el-button size="small" @click="handleGetOrder">订单</el-button>
        </el-badge>
      </div>
      <van-popup v-model="timeoutShow" style="width:70%">
        <van-cell-group>
          <van-cell size="mini" title="项目" value="状态" />
          <van-cell
            v-for="item in overtimeTableData"
            :key="item.index"
            size="mini"
            :title="item.category"
            value="有超时单"
          />
          <van-cell v-if="overtimeTableData.length==0" value="暂无数据" />
        </van-cell-group>
      </van-popup>
      <van-popup v-model="orderShow" style="width:70%">
        <van-cell-group>
          <van-cell size="mini" title="项目" value="状态" />
          <van-cell
            v-for="item in orderTableData"
            :key="item.index"
            size="mini"
            :title="item.category"
            value="有订单"
          />
          <van-cell v-if="orderTableData.length==0" value="暂无数据" />
        </van-cell-group>
      </van-popup>
    </div>
    <line-chart v-show="device=='desktop'" />
  </div>
</template>

<script>
import LineChart from "./components/LineChart";
import Vue from "vue";
import { getOrderStatus, getOrderCount, getEchartData } from "@/api/homepage";
import { setStore, getStore, removeStore } from "@/utils/store";
import {
  getSalesmanList,
  getChannelList,
  getProductList,
  getColorList
} from "@/api/orderList";
import { Cell, CellGroup, Button, Popup } from "vant";

Vue.use(Cell);
Vue.use(CellGroup);
Vue.use(Button);
Vue.use(Popup);

export default {
  components: {
    LineChart
  },
  data() {
    return {
      url:
        "https://lhtpic01.oss-cn-shenzhen.aliyuncs.com/common/logo-large.jpg",
      mobileUrl:
        "https://lhtpic01.oss-cn-shenzhen.aliyuncs.com/common/logo-small.png",
      overtimeTableData: [],
      orderTableData: [],
      headerShow: true,
      device: "",
      salemanOptions: [],
      channelOptions: [],
      productOptions: [],
      colorOptions: [],
      timeoutShow: false,
      orderShow: false
    };
  },
  created() {
    this.handleGetData();
    this.getSalesman();
    this.getChannel();
    this.getProduct();
    this.getColor();
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
      // 获取超时单信息
      getOrderStatus()
        .then(res => {
          if (!res || !res.data) return;
          let statusdataList = [];
          const orderStatusList = res.data.split("<br>");
          orderStatusList.forEach(orderStatusItem => {
            let dataArr = orderStatusItem.split(":");
            let data = { category: dataArr[0], status: "有超时单" };
            statusdataList.push(data);
          });
          this.overtimeTableData = statusdataList;
        })
        .catch(error => {});
      // 获取订单信息
      getOrderCount().then(res => {
        if (!res || !res.data) return;
        let countdataList = [];
        const orderCountList = res.data.split("<br>");
        orderCountList.forEach(orderCountItem => {
          let dataArr = orderCountItem.split(":");
          let data = { category: dataArr[0], status: "有订单" };
          countdataList.push(data);
        });
        this.orderTableData = countdataList;
      });
    },
    // 获取业务员列表
    getSalesman() {
      getSalesmanList().then(res => {
        const salesmanList = res.data;
        salesmanList.forEach(salesmanItem => {
          const salesmanObject = {
            value: salesmanItem.id,
            label: salesmanItem.name
          };
          this.salemanOptions.push(salesmanObject);
        });
        setStore({
          name: "salesmanList",
          content: JSON.stringify(this.salemanOptions)
        });
      });
    },
    // 获取渠道列表
    getChannel() {
      getChannelList().then(res => {
        const channelList = res.data;
        channelList.forEach(channelItem => {
          const channelObject = {
            value: channelItem.id,
            label: channelItem.name
          };
          this.channelOptions.push(channelObject);
        });
        setStore({
          name: "channelList",
          content: JSON.stringify(this.channelOptions)
        });
      });
    },
    // 获取产品列表
    getProduct() {
      getProductList().then(res => {
        const productList = res.data;
        productList.forEach(productItem => {
          const productObject = {
            value: productItem.id,
            label: productItem.name
          };
          this.productOptions.push(productObject);
        });
        setStore({
          name: "productList",
          content: JSON.stringify(this.productOptions)
        });
      });
    },
    // 获取颜色列表
    getColor() {
      if (!getStore({ name: "colorList" })) {
        getColorList().then(res => {
          const colorList = res.data;
          colorList.forEach(colorItem => {
            if (colorItem.name) {
              const colorProject = {
                value: colorItem.id,
                label: colorItem.name
              };
              this.colorOptions.push(colorProject);
            }
          });
          setStore({
            name: "colorList",
            content: JSON.stringify(this.colorOptions)
          });
        });
      }
    },
    handleGetTimeOut() {
      this.timeoutShow = true;
    },
    handleGetOrder() {
      this.orderShow = true;
    }
  }
};
</script>

<style lang="scss" scoped>
.homepage-box {
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
