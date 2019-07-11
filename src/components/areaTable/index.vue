<template>
  <div class="app-container">
    <!-- PC端 搜索 -->
    <div v-if="device=='desktop'" class="filter-container">
      <el-date-picker
        size="mini"
        v-model="timeSelectValue"
        type="datetimerange"
        value-format="yyyy-MM-dd"
        :picker-options="pickerOptions"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        align="right"
      ></el-date-picker>
      <el-select
        multiple
        size="mini"
        v-model="salemanValue"
        @change="salemanChange"
        clearable
        filterable
        placeholder="业务员"
        :style="salemanWidth"
      >
        <el-option
          v-for="item in salemanOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-select
        class="table-input"
        size="mini"
        v-model="productValue"
        clearable
        filterable
        placeholder="产品"
      >
        <el-option
          v-for="item in productOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-select
        class="table-input"
        size="mini"
        v-model="channelValue"
        clearable
        filterable
        placeholder="渠道项目"
      >
        <el-option
          v-for="item in channelOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-button
        size="mini"
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        :loading="searchButtonLoading"
        @click="handleSearch"
      >搜索</el-button>
      <el-button
        size="mini"
        class="filter-item"
        type="primary"
        icon="el-icon-close"
        :loading="clearSearchButtonLoading"
        @click="handleClearSearch"
      >清空</el-button>
    </div>
    <!-- 移动端 搜索 -->
    <div v-else class="filter-mobile">
      <van-button type="info" size="small" @click="handleSearchMobile">搜索</van-button>
    </div>
    <!-- 信息列表 -->
    <el-table
      v-loading="listLoading"
      size="mini"
      fit
      border
      :data="list"
      :max-height="tableMaxHeight"
      style="width: 100%;"
    >
      <el-table-column label="省份" :width="device=='desktop'?'850':'200'" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.province }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="订单数"
        :width="device=='desktop'?'850':'200'"
        sortable="custom"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.orderCount }}</span>
        </template>
      </el-table-column>
    </el-table>
    <!-- PC端 分页器 -->
    <el-pagination
      v-if="device=='desktop'"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="pagesizes"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="listTotal"
      class="pagination"
    ></el-pagination>
    <!-- 移动端 分页器 -->
    <div v-else class="mobile-pagination">
      <div class="mobile-pagejump">
        <span class="pagejump-count">共{{listTotal}}条</span>
        <van-field
          v-model="pageJumpIndex"
          label-width="50"
          center
          label="跳转至"
          @input="jumpPageInput"
          input-align="center"
          style="width:60%!important"
        >
          <van-button slot="button" size="mini" type="info" @click="handleJumpPage">GO</van-button>
        </van-field>
      </div>
      <van-pagination
        v-model="currentPage"
        :total-items="listTotal"
        :items-per-page="pagesize"
        :show-page-size="3"
        force-ellipses
        @change="handlePageChange"
      />
    </div>
    <!-- 移动端 搜索界面 -->
    <div class="search-container">
      <van-popup v-model="mobileSearchShow" position="right">
        <div style="height:100vh;width:100vw;">
          <van-nav-bar
            title="搜索"
            left-text="返回"
            right-text="清空"
            left-arrow
            @click-left="handleSearchMobileCancel"
            @click-right="handleSearchMobileClearAll"
          />
          <van-cell-group>
            <van-cell
              @click="handleChooseDateStartMobile"
              title="开始日期"
              is-link
              :value="timePickerStartValue"
            />
            <van-cell
              @click="handleChooseDateEndMobile"
              title="结束日期"
              is-link
              :value="timePickerEndValue"
            />
            <van-cell
              @click="handleChooseSalesman"
              title="业务员"
              is-link
              :value="salesmanMobileValue"
            />
            <van-cell
              @click="handleChooseChannel"
              title="渠道项目"
              is-link
              :value="channelMobileValue"
            />
            <van-cell @click="handleChooseProduct" title="产品" is-link :value="productMobileValue" />
          </van-cell-group>
          <div class="mobile-search">
            <van-button
              type="info"
              :loading="mobileSearchButtonLoading"
              :disabled="mobileSearchButtonLoading"
              size="large"
              @click="handleMobileSearch"
            >搜索</van-button>
          </div>
        </div>
      </van-popup>
      <!-- 日期选择器弹窗 -->
      <van-popup v-model="mobileDatePickerShow" position="bottom">
        <van-datetime-picker
          v-model="currentDate"
          type="date"
          :min-date="datetimePickerType=='start'?minDate:minDateEnd"
          :max-date="datetimePickerType=='end'?maxDate:maxDateStart"
          @change="datetimePickerChange"
          @confirm="datetimePickerConfirm"
          @cancel="datetimePickerCancel"
        />
      </van-popup>
      <!--业务员选择弹窗-->
      <van-popup v-model="mobileSalesmanPickerShow" position="bottom">
        <van-search
          clearable
          show-action
          placeholder="请输入搜索关键词"
          v-model="salesmanSearchValue"
          list="salesmanIde"
        >
          <div slot="action" @click="handleSearchSalesmanItem">搜索</div>
        </van-search>
        <datalist id="salesmanIde">
          <option v-for="item in salemanOptions" :key="item.value" :value="item.label" />
        </datalist>
        <van-picker
          show-toolbar
          :default-index="salesPickerCurrentSelect"
          :columns="salesmanColumns"
          @cancel="mobileSalesmanPickerShow = false"
          @confirm="salesmanPickerConfirm"
        />
      </van-popup>
      <!--渠道选择弹窗-->
      <van-popup v-model="mobileChannelPickerShow" position="bottom">
        <van-search
          clearable
          show-action
          placeholder="请输入搜索关键词"
          v-model="channelSearchValue"
          list="channelIde"
        >
          <div slot="action" @click="handleSearchChannelItem">搜索</div>
        </van-search>
        <datalist id="channelIde">
          <option v-for="item in channelOptions" :key="item.value" :value="item.label" />
        </datalist>
        <van-picker
          show-toolbar
          :default-index="channelPickerCurrentSelect"
          :columns="channelColumns"
          @cancel="mobileChannelPickerShow = false"
          @confirm="channelPickerConfirm"
        />
      </van-popup>
      <!--产品选择弹窗-->
      <van-popup v-model="mobileProductPickerShow" position="bottom">
        <van-search
          clearable
          show-action
          placeholder="请输入搜索关键词"
          v-model="productSearchValue"
          list="productIde"
        >
          <div slot="action" @click="handleSearchProductItem">搜索</div>
        </van-search>
        <datalist id="productIde">
          <option v-for="item in productOptions" :key="item.value" :value="item.label" />
        </datalist>
        <van-picker
          show-toolbar
          :default-index="productPickerCurrentSelect"
          :columns="productColumns"
          @cancel="mobileProductPickerShow = false"
          @confirm="productPickerConfirm"
        />
      </van-popup>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import {
  getOuterChainAreaStatistics,
  getSalesmanList,
  getChannelList,
  getProductList
} from "@/api/orderList";
import {
  Pagination,
  Button,
  Popup,
  NavBar,
  Cell,
  CellGroup,
  DatetimePicker,
  Picker,
  Field,
  Icon,
  Toast,
  ActionSheet,
  Search
} from "vant";

Vue.use(Pagination);
Vue.use(Button);
Vue.use(Popup);
Vue.use(NavBar);
Vue.use(Cell);
Vue.use(CellGroup);
Vue.use(DatetimePicker);
Vue.use(Picker);
Vue.use(Field);
Vue.use(Icon);
Vue.use(Toast);
Vue.use(ActionSheet);
Vue.use(Search);

export default {
  name: "areaTable",
  props: ["category"],
  data() {
    return {
      list: [],
      pickerOptions: {
        shortcuts: [
          {
            text: "上月",
            onClick(picker) {
              const start = new Date(
                new Date().getFullYear(),
                new Date().getMonth() - 1,
                1
              );
              const end = new Date(
                new Date().getFullYear(),
                new Date().getMonth(),
                1
              );
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      channelOptions: [],
      channelColumns: [],
      productOptions: [],
      productColumns: [],
      salemanOptions: [],
      salesmanColumns: [],
      salemanValue: "",
      timeSelectValue: "",
      channelValue: "",
      productValue: "",
      formLabelWidth: "120px",
      currentPage: 1, //当前页
      mobileCurrentPage: 1,
      pagesizes: [1000, 2000, 3000], //单页最大显示条数
      pagesize: 1000, //单页内条数
      listTotal: 0, //总数
      listLoading: false,
      device: "",
      mobileSearchShow: false,
      mobileDatePickerShow: false,
      mobileSalesmanPickerShow: false,
      mobileChannelPickerShow: false,
      mobileProductPickerShow: false,
      minDate: new Date(1950, 10, 1),
      maxDate: new Date(),
      currentDate: new Date(),
      minDateEnd: new Date(),
      maxDateStart: new Date(),
      datetimePickerType: "",
      timePickerStartValue: "请选择",
      timePickerEndValue: "请选择",
      salesmanMobileValue: "请选择",
      channelMobileValue: "请选择",
      productMobileValue: "请选择",
      salesPickerCurrentSelect: 0,
      channelPickerCurrentSelect: 0,
      productPickerCurrentSelect: 0,
      salesmanSearchValue: "",
      channelSearchValue: "",
      productSearchValue: "",
      mobileSearchButtonLoading: false,
      salemanWidth: "",
      pageJumpIndex: 1,
      searchButtonLoading: false,
      clearSearchButtonLoading: false,
      contains: false
    };
  },
  created() {
    this.getList();
    this.device = this.$store.state.app.device;
    window.addEventListener("resize", this.getHeight);
    this.getSalesman();
    this.getChannel();
    this.getProduct();
    this.getHeight();
  },
  destroyed() {
    window.removeEventListener("resize", this.getHeight);
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
    // 获取数据
    getList() {
      this.listLoading = true;
      let searchList = [];
      this.timeSelectValue == "" ? this.timeSelectValue : ["", ""];
      let paramsObj = {
        contains: this.contains,
        rows: this.pagesize,
        page: this.currentPage
      };
      this.timeSelectValue[0]
        ? (paramsObj.createTime = this.timeSelectValue[0])
        : "";
      this.timeSelectValue[1]
        ? (paramsObj.createTimeEnd = this.timeSelectValue[1])
        : "";
      this.channelValue ? (paramsObj.cid = this.channelValue) : "";
      this.productValue ? (paramsObj.productId = this.productValue) : "";
      this.cpName ? (paramsObj.cpName = this.cpName) : "";
      if (this.salemanValue.length > 0) {
        paramsObj.uids = this.salemanValue.join(",");
      }
      getOuterChainAreaStatistics(this.category, paramsObj)
        .then(res => {
          this.listTotal = res.data.total;
          const tableData = res.data.rows;
          tableData.forEach(tableItem => {
            const { province, oNum } = tableItem;
            const orderItem = { province: province, orderCount: oNum };
            searchList.push(orderItem);
          });
          this.list = searchList;
        })
        .catch(error => {
          console.log(error);
        });
      setTimeout(() => {
        this.listLoading = false;
      }, 1000);
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
          this.salesmanColumns.push(salesmanItem.name);
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
          this.channelColumns.push(channelItem.name);
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
          this.productColumns.push(productItem.name);
        });
      });
    },
    // 表格高度自适应
    getHeight() {
      let otherHeight = this.device == "desktop" ? 250 : 200;
      this.tableMaxHeight = window.innerHeight - otherHeight;
    },
    // 业务员选择器宽度自适应
    salemanChange() {
      const inputWidth = 178; //选择器原始宽度 178px
      let optionWidth = this.salemanValue.length * 65 + 97; //一个标签宽度65px 右边预留97px
      this.salemanWidth =
        optionWidth > inputWidth
          ? "width:" + optionWidth + "px"
          : "width:" + inputWidth + "px";
    },
    // 清空搜索项
    handleClearSearch() {
      this.timeSelectValue = ["", ""];
      this.salemanValue = [];
      this.productValue = "";
      this.channelValue = "";
      this.salemanChange();
    },
    // 搜索
    handleSearch() {
      this.searchButtonLoading = true;
      this.getList();
      this.searchButtonLoading = false;
    },
    // 选择表格尺寸
    handleSizeChange(val) {
      this.pagesize = val;
      this.getList();
    },
    //选择表格当前页数
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getList();
    },

    /* 移动端事件 */

    // 获取数据
    getMobileList() {
      this.listLoading = true;
      let timeStartValue = "";
      let timeEndValue = "";
      let productId = "";
      let channelId = "";
      let uids = [];

      this.timePickerStartValue == "请选择"
        ? (timeStartValue = "")
        : (timeStartValue = this.timePickerStartValue.replace(/\//g, "-"));
      this.timePickerEndValue == "请选择"
        ? (timeEndValue = "")
        : (timeEndValue = this.timePickerEndValue.replace(/\//g, "-"));
      if (this.productMobileValue != "请选择") {
        this.productOptions.forEach(productItem => {
          if (productItem.label == this.productMobileValue) {
            productId = productItem.value;
          }
        });
      } else {
        productId = "";
      }

      if (this.channelMobileValue != "请选择") {
        this.channelOptions.forEach(channelItem => {
          if (channelItem.label == this.channelMobileValue) {
            channelId = channelItem.value;
          }
        });
      } else {
        channelId = "";
      }

      if (this.salesmanMobileValue != "请选择") {
        let salesmanArr;
        if (this.salesmanMobileValue.length > 1) {
          salesmanArr = this.salesmanMobileValue.split(",");
          salesmanArr.forEach(salesmanItem => {
            this.salemanOptions.forEach(optionItem => {
              if (salesmanItem == optionItem.label) {
                uids.push(optionItem.value);
              }
            });
          });
        } else {
          this.salemanOptions.forEach(optionItem => {
            if (optionItem.label == this.salesmanMobileValue) {
              uids.push(optionItem.value);
            }
          });
        }
      }
      let searchList = [];
      let paramsObj = {
        contains: this.contains,
        rows: this.rows,
        page: this.page
      };
      timeStartValue ? (paramsObj.createTime = timeStartValue) : "";
      timeEndValue ? (paramsObj.createTimeEnd = timeEndValue) : "";
      channelId ? (paramsObj.cid = channelId) : "";
      productId ? paramsObj.productId : "";
      if (uids.length > 0) {
        paramsObj.uids = uids.join(",");
      }
      getOuterChainAreaStatistics(this.category, paramsObj)
        .then(res => {
          this.listTotal = res.data.total;
          const tableData = res.data.rows;
          tableData.forEach(tableItem => {
            const { province, oNum } = tableItem;
            const orderItem = { province: province, orderCount: oNum };
            searchList.push(orderItem);
          });
          this.list = searchList;
        })
        .catch(error => {
          console.log(error);
        });
      setTimeout(() => {
        this.listLoading = false;
      }, 1000);
    },
    // 点击搜索
    handleSearchMobile() {
      this.mobileSearchShow = true;
    },
    // 取消搜索
    handleSearchMobileCancel() {
      this.mobileSearchShow = false;
    },
    // 清空所选
    handleSearchMobileClearAll() {
      this.timePickerStartValue == "请选择"
        ? ""
        : (this.timePickerStartValue = "请选择"),
        this.timePickerEndValue == "请选择"
          ? ""
          : (this.timePickerEndValue = "请选择"),
        this.salesmanMobileValue == "请选择"
          ? ""
          : (this.salesmanMobileValue = "请选择"),
        this.channelMobileValue == "请选择"
          ? ""
          : (this.channelMobileValue = "请选择"),
        this.productMobileValue == "请选择"
          ? ""
          : (this.productMobileValue = "请选择");
    },
    // 选择开始日期
    handleChooseDateStartMobile() {
      if (!this.mobileDatePickerShow) {
        if (this.timePickerEndValue != "请选择") {
          let maxDate_ = this.timePickerEndValue;
          maxDate_ = maxDate_.replace(/-/g, "/");
          let date = new Date(maxDate_);
          this.maxDateStart = date;
        }
        this.datetimePickerType = "start";
        this.mobileDatePickerShow = !this.mobileDatePickerShow;
      }
    },
    // 选择结束日期
    handleChooseDateEndMobile() {
      if (!this.mobileDatePickerShow) {
        if (this.timePickerStartValue != "请选择") {
          let maxDate_ = this.timePickerStartValue;
          maxDate_ = maxDate_.replace(/-/g, "/");
          let date = new Date(maxDate_);
          this.minDateEnd = date;
        }
        this.datetimePickerType = "end";
        this.mobileDatePickerShow = !this.mobileDatePickerShow;
      }
    },
    datetimePickerChange(e) {},
    // 确认选择日期
    datetimePickerConfirm(res) {
      if (this.mobileDatePickerShow) {
        if (this.datetimePickerType == "start") {
          this.timePickerStartValue = res.toLocaleDateString();
        } else {
          this.timePickerEndValue = res.toLocaleDateString();
        }
        this.mobileDatePickerShow = !this.mobileDatePickerShow;
      }
    },
    // 取消选择日期
    datetimePickerCancel() {
      this.mobileDatePickerShow = !this.mobileDatePickerShow;
    },
    // 选择业务员
    handleChooseSalesman() {
      if (!this.mobileSalesmanPickerShow) {
        this.mobileSalesmanPickerShow = !this.mobileSalesmanPickerShow;
      }
    },
    // 选择渠道
    handleChooseChannel() {
      if (!this.mobileChannelPickerShow) {
        this.mobileChannelPickerShow = !this.mobileChannelPickerShow;
      }
    },
    // 选择产品
    handleChooseProduct() {
      if (!this.mobileProductPickerShow) {
        this.mobileProductPickerShow = !this.mobileProductPickerShow;
      }
    },
    // 确认选择业务员
    salesmanPickerConfirm(res) {
      if (this.mobileSalesmanPickerShow) {
        if (this.salesmanMobileValue == "请选择") {
          this.salesmanMobileValue = res;
        } else {
          if (this.salesmanMobileValue.indexOf(",") != -1) {
            let salesmanArr = new Array();
            salesmanArr = this.salesmanMobileValue.split(",");
            if (salesmanArr.indexOf(res) == -1) {
              this.salesmanMobileValue = this.salesmanMobileValue + "," + res;
            } else {
              Toast("请勿重复选择");
            }
          } else {
            if (this.salesmanMobileValue != res) {
              this.salesmanMobileValue = this.salesmanMobileValue + "," + res;
            } else {
              Toast("请勿重复选择");
            }
          }
        }
        this.mobileSalesmanPickerShow = !this.mobileSalesmanPickerShow;
      }
    },
    // 确认选择渠道
    channelPickerConfirm(res) {
      if (this.mobileChannelPickerShow) {
        this.channelMobileValue = res;
        this.mobileChannelPickerShow = !this.mobileChannelPickerShow;
      }
    },
    // 确认选择产品
    productPickerConfirm(res) {
      if (this.mobileProductPickerShow) {
        this.productMobileValue = res;
        this.mobileProductPickerShow = !this.mobileProductPickerShow;
      }
    },
    // 业务员快捷搜索
    handleSearchSalesmanItem() {
      this.salesPickerCurrentSelect = this.salesmanColumns.indexOf(
        this.salesmanSearchValue
      );
    },
    // 渠道快捷搜索
    handleSearchChannelItem() {
      this.channelPickerCurrentSelect = this.channelColumns.indexOf(
        this.channelSearchValue
      );
    },
    // 产品快捷搜索
    handleSearchProductItem() {
      this.productPickerCurrentSelect = this.productColumns.indexOf(
        this.productSearchValue
      );
    },
    // 开始搜索
    handleMobileSearch() {
      this.searchButtonLoading = true;
      this.getMobileList();
      this.searchButtonLoading = false;
      this.mobileSearchShow = false;
    },
    // 分页器
    handlePageChange() {
      this.getMobileList();
    },
    // 返回列表
    handleDetailCancel() {
      this.mobileDetailShow = !this.mobileDetailShow;
    },
    // 限制页面跳转输入框只能输入数字
    jumpPageInput() {
      this.pageJumpIndex = this.pageJumpIndex.replace(/[^\d]/g, "");
    },
    // 跳转指定页面
    handleJumpPage() {
      let jumpPage = parseInt(this.pageJumpIndex);
      if (jumpPage == this.mobileCurrentPage) return;
      if (jumpPage > Math.ceil(this.listTotal / this.pagesize)) {
        jumpPage = Math.ceil(this.listTotal / this.pagesize);
      }
      if (jumpPage < 1) {
        jumpPage = 1;
      }
      this.pageJumpIndex = jumpPage;
      this.mobileCurrentPage = jumpPage;
      this.getMobileList();
    }
  }
};
</script>

<style lang="scss" scoped>
.filter-container {
  margin-bottom: 10px;
}
.table-input {
  width: 200px;
  padding: 5px 0;
}
.filter-container label {
  font-weight: 500;
  padding: 0 5px;
  font-size: 14px;
}
.table-input {
  width: 120px;
  padding: 5px 0;
}
.pagination {
  text-align: center;
  margin-top: 20px;
}

.filter-mobile button {
  margin-bottom: 10px;
}

.mobile-pagination {
  margin-top: 10px;
}

.mobile-search {
  padding: 10px;
}

.mobile-pagejump {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border: 1px solid #ebedf0;
}

.mobile-pagejump .pagejump-count {
  font-size: 14px;
  color: #323233;
  padding-left: 10px;
  width: 35%;
}
</style>
