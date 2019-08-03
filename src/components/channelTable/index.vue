<template>
  <div class="app-container">
    <!-- PC端 搜索 -->
    <div ref="filterBox" v-if="device!='mobile'" class="filter-container">
      <el-date-picker
        size="mini"
        v-model="timeSelectValue"
        type="daterange"
        value-format="yyyy-MM-dd"
        :picker-options="pickerOptions"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        align="right"
        @change="handleChooseDate"
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
        size="mini"
        class="table-input"
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
        v-if="category != 'tt'"
        size="mini"
        class="table-input"
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
      <el-select
        v-if="category == 'tt'"
        size="mini"
        class="table-input"
        v-model="pageInfoValue"
        clearable
        filterable
        placeholder="套餐属性"
      >
        <el-option
          v-for="item in pageInfoOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-input
        v-if="category != 'tt'"
        size="mini"
        class="table-input"
        placeholder="素材"
        v-model="cpName"
        clearable
      ></el-input>
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
      <van-button type="info" size="small" @click="handleRefreshMobile">刷新</van-button>
    </div>
    <!-- 列表 -->
    <el-table
      v-loading="listLoading"
      size="mini"
      border
      fit
      :data="list"
      :max-height="tableMaxHeight"
      style="width: 100%;"
      show-summary
      :summary-method="getSummaries"
      @cell-click="handleTimeSlot"
      @sort-change="handleSort"
    >
      <el-table-column width="50" align="center">
        <template>
          <i class="el-icon-plus cursor-pointer"></i>
        </template>
      </el-table-column>
      <el-table-column label="渠道项目" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.cpName }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="pNum" label="订单数" sortable="custom" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.pNum }}</span>
        </template>
      </el-table-column>
    </el-table>
    <input
      id="copy_content"
      type="text"
      value
      style="position: absolute;top: 0;left: 0;opacity: 0;z-index: -10;"
    />
    <!-- PC端 分页器 -->
    <el-row v-if="device!='mobile'" type="flex" align="middle">
      <el-col :span="23">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="pagesizes"
          :page-size="pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="listTotal"
          class="pagination"
        ></el-pagination>
      </el-col>
      <el-col :span="1">
        <el-button
          size="mini"
          class="filter-item"
          type="primary"
          icon="el-icon-refresh"
          @click="handleRefresh"
        >刷新</el-button>
      </el-col>
    </el-row>
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
        :total-items="list.length"
        :items-per-page="pagesize"
        :show-page-size="3"
        force-ellipses
        @change="handlePageChange"
      />
    </div>
    <!-- PC端 渠道详情 -->
    <el-dialog size="mini" :title="channelTitle" :visible.sync="dialogTableVisible">
      <el-table :max-height="tableMaxHeight - 200" size="mini" :data="gridData">
        <el-table-column property="timeslot" label="时段" width="400" align="center"></el-table-column>
        <el-table-column property="orderCount" label="订单数" width="400" align="center"></el-table-column>
      </el-table>
    </el-dialog>
    <!-- 移动端 渠道详情 -->
    <div class="search-container">
      <van-popup v-model="mobileDetailShow" position="right">
        <div style="height:100vh;width:100vw;">
          <van-nav-bar
            :title="channelTitle"
            left-text="返回"
            left-arrow
            @click-left="handleDetailCancel"
          />
          <van-cell-group>
            <van-cell title="时段" value="订单数" />
            <van-cell
              v-for="item in gridData"
              :key="item.timeslot"
              :title="item.timeslot"
              :value="item.orderCount"
            />
          </van-cell-group>
        </div>
      </van-popup>
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
              v-if="category != 'tt'"
              @click="handleChooseChannel"
              title="渠道项目"
              is-link
              :value="channelMobileValue"
            />
            <van-cell
              v-if="category == 'tt'"
              @click="handleChoosePageInfo"
              title="套餐属性"
              is-link
              :value="pageInfoMobileValue"
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
      <!-- 套餐属性选择弹窗 -->
      <van-popup v-model="mobilePageInfoPickerShow" position="bottom">
        <van-search
          clearable
          show-action
          placeholder="请输入搜索关键词"
          v-model="pageInfoSearchValue"
          list="channelIde"
        >
          <div slot="action" @click="handleSearchPageInfoItem">搜索</div>
        </van-search>
        <datalist id="channelIde">
          <option v-for="item in pageInfoOptions" :key="item.value" :value="item.label" />
        </datalist>
        <van-picker
          show-toolbar
          :default-index="pageInfoPickerCurrentSelect"
          :columns="pageInfoColumns"
          @cancel="mobilePageInfoPickerShow = false"
          @confirm="pageInfoPickerConfirm"
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
import { getStore } from "@/utils/store";
import {
  getOuterChainChannelStatistics,
  getOuterChainTimeslotStatistics,
  getSalesmanList,
  getChannelList,
  getProductList,
  getChannelTimeslotWatch,
  getChannelSelectList,
  getProductSelectList,
  getPageInfoList
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
  name: "channelTable",
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
                new Date().getMonth() - 1,
                new Date(
                  new Date().getFullYear(),
                  new Date().getMonth(),
                  0
                ).getDate()
              );
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      productOptions: [],
      productColumns: [],
      pageInfoOptions: [],
      pageInfoColumns: [],
      channelOptions: [],
      channelColumns: [],
      channelColumns: [],
      salemanOptions: [],
      salesmanColumns: [],
      gridData: [],
      salemanValue: "",
      timeSelectValue: "",
      channelValue: "",
      pageInfoValue: "",
      productValue: "",
      formLabelWidth: "120px",
      dialogTableVisible: false,
      channelTitle: "",
      currentPage: 1, //当前页
      mobileCurrentPage: 1,
      pagesizes: [1000, 2000, 3000], //单页最大显示条数
      pagesize: 1000, //单页内条数
      listTotal: 0, //页面总数
      listLoading: false,
      device: "",
      mobileSearchShow: false,
      mobileDatePickerShow: false,
      mobileSalesmanPickerShow: false,
      mobileChannelPickerShow: false,
      mobilePageInfoPickerShow: false,
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
      pageInfoMobileValue: "请选择",
      productMobileValue: "请选择",
      mobileDetailShow: false,
      salesPickerCurrentSelect: 0,
      channelPickerCurrentSelect: 0,
      pageInfoPickerCurrentSelect: 0,
      productPickerCurrentSelect: 0,
      salesmanSearchValue: "",
      channelSearchValue: "",
      pageInfoSearchValue: "",
      productSearchValue: "",
      cpName: "",
      mobileSearchButtonLoading: false,
      searchButtonLoading: false,
      clearSearchButtonLoading: false,
      salemanWidth: "",
      pageJumpIndex: 1,
      contains: false,
      tableMaxHeight: 0,
      orderType: ""
    };
  },
  created() {
    this.getList();
    this.device = this.$store.state.app.device;
    window.addEventListener("resize", this.getHeight);
    this.getSalesman();
    this.getHeight();
    if (this.device == "desktop") {
      this.getProduct();
      if (this.category == "tt") {
        this.getPageInfo();
      } else {
        this.getChannel();
      }
    } else {
      this.getProductListMobile();
      if (this.category == "tt") {
        this.getPageInfoListMobile();
      } else {
        this.getChannelListMobile();
      }
    }
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
      if (this.timeSelectValue == null) {
        this.timeSelectValue = ["", ""];
      } else {
        this.timeSelectValue == "" ? this.timeSelectValue : ["", ""];
      }
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
      if (this.orderType != "") {
        paramsObj.order = this.orderType;
        paramsObj.sort = "pNum";
      }
      this.pageInfoValue ? (paramsObj.pageInfo = this.pageInfoValue) : "";
      getOuterChainChannelStatistics(this.category, paramsObj)
        .then(res => {
          this.listTotal = res.data.total;
          this.list = res.data.rows;
          this.listLoading = false;
        })
        .catch(error => {
          this.listLoading = false;
        });
    },
    // 获取业务员列表
    getSalesman() {
      let salesmanList = getStore({ name: "salesmanList" });
      this.salemanOptions = JSON.parse(salesmanList);
      let salesmanColumns = [];
      this.salemanOptions.forEach(salesmanItem => {
        salesmanColumns.push(salesmanItem.label);
      });
      this.salesmanColumns = salesmanColumns;
    },
    // 获取渠道列表
    getChannel() {
      let paramsObj = {
        channel: this.category
      };
      if (this.timeSelectValue == null) {
        this.timeSelectValue = ["", ""];
      } else {
        this.timeSelectValue == "" ? this.timeSelectValue : ["", ""];
      }
      this.timeSelectValue[0]
        ? (paramsObj.createTime = this.timeSelectValue[0])
        : "";
      this.timeSelectValue[1]
        ? (paramsObj.createTimeEnd = this.timeSelectValue[1])
        : "";
      if (this.salemanValue.length > 0) {
        paramsObj.uids = this.salemanValue.join(",");
      }
      getChannelSelectList(paramsObj, this.category).then(res => {
        const tableList = res.data;
        let channelList = [];
        tableList.forEach(tableItem => {
          const { name, id } = tableItem;
          const channelItem = { label: name, value: id };
          channelList.push(channelItem);
        });
        this.channelOptions = channelList;
      });
    },
    // 获取产品列表
    getProduct() {
      let paramsObj = {
        channel: this.category
      };
      if (this.timeSelectValue == null) {
        this.timeSelectValue = ["", ""];
      } else {
        this.timeSelectValue == "" ? this.timeSelectValue : ["", ""];
      }
      this.timeSelectValue[0]
        ? (paramsObj.createTime = this.timeSelectValue[0])
        : "";
      this.timeSelectValue[1]
        ? (paramsObj.createTimeEnd = this.timeSelectValue[1])
        : "";
      if (this.salemanValue.length > 0) {
        paramsObj.uids = this.salemanValue.join(",");
      }
      getProductSelectList(paramsObj, this.category).then(res => {
        const tableList = res.data;
        let productList = [];
        tableList.forEach(tableItem => {
          const { name, id } = tableItem;
          const productItem = { label: name, value: id };
          productList.push(productItem);
        });
        this.productOptions = productList;
      });
    },
    // 获取套餐属性
    getPageInfo() {
      let paramsObj = {};
      if (this.timeSelectValue == null) {
        this.timeSelectValue = ["", ""];
      } else {
        this.timeSelectValue == "" ? this.timeSelectValue : ["", ""];
      }
      this.timeSelectValue[0]
        ? (paramsObj.createTime = this.timeSelectValue[0])
        : "";
      this.timeSelectValue[1]
        ? (paramsObj.createTimeEnd = this.timeSelectValue[1])
        : "";
      if (this.salemanValue.length > 0) {
        paramsObj.uids = this.salemanValue.join(",");
      }

      getPageInfoList(paramsObj).then(res => {
        const tableList = res.data;
        let pageInfoList = [];
        tableList.forEach(tableItem => {
          const { pageInfo } = tableItem;
          const pageInfoItem = { label: pageInfo, value: pageInfo };
          pageInfoList.push(pageInfoItem);
        });
        this.pageInfoOptions = pageInfoList;
      });
    },
    // 表格高度自适应
    getHeight() {
      this.$nextTick(() => {
        if (this.device === "desktop") {
          this.tableMaxHeight =
            document.body.offsetHeight -
            (200 + this.$refs.filterBox.offsetHeight + 40 +18);
        } else {
          this.tableMaxHeight =
            document.body.offsetHeight - (100 + 40 + 40 + 88 + 10);
        }
      });
    },
    // 业务员选择器宽度自适应
    salemanChange() {
      const inputWidth = 178; //选择器原始宽度 178px
      let optionWidth = this.salemanValue.length * 65 + 97; //一个标签宽度65px 右边预留97px
      this.salemanWidth =
        optionWidth > inputWidth
          ? "width:" + optionWidth + "px"
          : "width:" + inputWidth + "px";
      this.getProduct();
      if (this.category == "tt") {
        this.getPageInfo();
      } else {
        this.getChannel();
      }
    },
    // 清空搜索项
    handleClearSearch() {
      this.timeSelectValue = "";
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
    // 时段统计
    handleTimeSlot(row, column, cell, event) {
      if (this.clickFlag) {
        clearTimeout(this.clickFlag);
        this.clickFlag = null;
      }
      this.clickFlag = setTimeout(() => {
        let count = 0;
        if (column.label == undefined) {
          this.gridData = [];
          this.channelTitle = row.cpName;
          let paramsObj = {
            page: 1,
            rows: 100
          };
          if (this.category == "tt") {
            this.channelTitle ? (paramsObj.text = this.channelTitle) : "";
          } else {
            this.channelTitle ? (paramsObj.cpName = this.channelTitle) : "";
          }
          if (this.device == "desktop") {
            if (this.timeSelectValue == null) {
              this.timeSelectValue = ["", ""];
            } else {
              this.timeSelectValue == "" ? this.timeSelectValue : ["", ""];
            }
            this.timeSelectValue[0]
              ? (paramsObj.createTime = this.timeSelectValue[0])
              : "";
            this.timeSelectValue[1]
              ? (paramsObj.createTimeEnd = this.timeSelectValue[1])
              : "";
            this.productValue ? (paramsObj.productId = this.productValue) : "";
            if (this.salemanValue.length > 0) {
              paramsObj.uids = this.salemanValue.join(",");
            }
          } else {
            let timeStartValue = "";
            let timeEndValue = "";
            let productId = "";
            let uids = [];

            this.timePickerStartValue == "请选择"
              ? (timeStartValue = "")
              : (timeStartValue = this.timePickerStartValue.replace(
                  /\//g,
                  "-"
                ));
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
            timeStartValue ? (paramsObj.createTime = timeStartValue) : "";
            timeEndValue ? (paramsObj.createTimeEnd = timeEndValue) : "";
            productId ? paramsObj.productId : "";
            if (uids.length > 0) {
              paramsObj.uids = uids.join(",");
            }
          }

          getOuterChainTimeslotStatistics(this.category, paramsObj).then(
            res => {
              const channelTimeDataList = res.data.rows;
              channelTimeDataList.forEach(channelTimeDataItem => {
                const { timeCount, tNum } = channelTimeDataItem;
                const channelTimeObject = {
                  timeslot: timeCount,
                  orderCount: tNum
                };
                this.gridData.push(channelTimeObject);
              });
            }
          );
          if (this.device == "mobile") {
            this.mobileDetailShow = true;
          } else {
            this.dialogTableVisible = true;
          }
        } else {
          if (this.device == "mobile") return;
          let copyText = event.target.innerText;
          if (copyText != "") {
            var inputElement = document.getElementById("copy_content");
            inputElement.value = copyText;
            inputElement.select();
            document.execCommand("Copy");
            this.$message({
              message: "复制成功",
              type: "success"
            });
          } else {
            this.$message.error("复制失败，内容可能为空");
          }
        }
      }, 300);
    },
    // 页面条数切换
    handleSizeChange(val) {
      this.pagesize = val;
      this.getList();
    },
    //选择表格当前页数
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getList();
    },
    //刷新
    handleRefresh() {
      this.getList();
    },
    // 选择日期
    handleChooseDate() {
      this.getProduct();
      if (this.category == "tt") {
        this.getPageInfo();
      } else {
        this.getChannel();
      }
    },
    //排序
    handleSort({ column, prop, order }) {
      if (order === "ascending") {
        this.orderType = "asc";
      } else if (order === "descending") {
        this.orderType = "desc";
      } else {
        this.orderType = "";
      }
      if (this.device == "desktop") {
        this.getList();
      } else {
        this.getMobileList();
      }
    },
    // 合计
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "合计";
          return;
        }
        const values = data.map(item => Number(item[column.property]));
        if (index === 2) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
        }
      });
      return sums;
    },

    /* 移动端事件 */

    // 获取数据
    getMobileList() {
      this.listLoading = true;
      let timeStartValue = "";
      let timeEndValue = "";
      let productId = "";
      let channelId = "";
      let pageInfo = "";
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

      if (this.pageInfoMobileValue != "请选择") {
        this.pageInfoOptions.forEach(pageInfoItem => {
          if (pageInfoItem.label == this.pageInfoMobileValue) {
            pageInfo = pageInfoItem.value;
          }
        });
      } else {
        pageInfo = "";
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
      let paramsObj = {
        contains: this.contains,
        rows: this.pagesize,
        page: this.mobileCurrentPage
      };
      timeStartValue ? (paramsObj.createTime = timeStartValue) : "";
      timeEndValue ? (paramsObj.createTimeEnd = timeEndValue) : "";
      channelId ? (paramsObj.cid = channelId) : "";
      productId ? (paramsObj.productId = productId) : "";
      pageInfo ? (paramsObj.pageInfo = pageInfo) : "";
      if (uids.length > 0) {
        paramsObj.uids = uids.join(",");
      }
      if (this.orderType != "") {
        paramsObj.order = this.orderType;
        paramsObj.sort = "pNum";
      }
      getOuterChainChannelStatistics(this.category, paramsObj)
        .then(res => {
          this.listTotal = res.data.total;
          this.list = res.data.rows;
          this.listLoading = false;
        })
        .catch(error => {
          this.listLoading = false;
        });
    },
    // 获取产品
    getProductListMobile() {
      let timeStartValue = "";
      let timeEndValue = "";
      let uids = [];

      let paramsObj = {
        channel: this.category
      };
      this.timePickerStartValue == "请选择"
        ? (timeStartValue = "")
        : (timeStartValue = this.timePickerStartValue.replace(/\//g, "-"));
      this.timePickerEndValue == "请选择"
        ? (timeEndValue = "")
        : (timeEndValue = this.timePickerEndValue.replace(/\//g, "-"));

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

      timeStartValue ? (paramsObj.createTime = timeStartValue) : "";
      timeEndValue ? (paramsObj.createTimeEnd = timeEndValue) : "";
      if (uids.length > 0) {
        paramsObj.uids = uids.join(",");
      }
      getProductSelectList(paramsObj, this.category).then(res => {
        const tableList = res.data;
        let productList = [];
        let productColumn = [];
        tableList.forEach(tableItem => {
          const { name, id } = tableItem;
          const productItem = { label: name, value: id };
          productList.push(productItem);
          productColumn.push(name);
        });
        this.productOptions = productList;
        this.productColumns = productColumn;
      });
    },
    // 获取渠道
    getChannelListMobile() {
      let timeStartValue = "";
      let timeEndValue = "";
      let uids = [];

      let paramsObj = {
        channel: this.category
      };
      this.timePickerStartValue == "请选择"
        ? (timeStartValue = "")
        : (timeStartValue = this.timePickerStartValue.replace(/\//g, "-"));
      this.timePickerEndValue == "请选择"
        ? (timeEndValue = "")
        : (timeEndValue = this.timePickerEndValue.replace(/\//g, "-"));

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

      timeStartValue ? (paramsObj.createTime = timeStartValue) : "";
      timeEndValue ? (paramsObj.createTimeEnd = timeEndValue) : "";
      if (uids.length > 0) {
        paramsObj.uids = uids.join(",");
      }
      getChannelSelectList(paramsObj, this.category).then(res => {
        const tableList = res.data;
        let channelList = [];
        let channelColumn = [];
        tableList.forEach(tableItem => {
          const { name, id } = tableItem;
          const channelItem = { label: name, value: id };
          channelList.push(channelItem);
          channelColumn.push(name);
        });
        this.channelOptions = channelList;
        this.channelColumns = channelColumn;
      });
    },
    // 获取套餐属性
    getPageInfoListMobile() {
      let timeStartValue = "";
      let timeEndValue = "";
      let uids = [];

      let paramsObj = {};
      this.timePickerStartValue == "请选择"
        ? (timeStartValue = "")
        : (timeStartValue = this.timePickerStartValue.replace(/\//g, "-"));
      this.timePickerEndValue == "请选择"
        ? (timeEndValue = "")
        : (timeEndValue = this.timePickerEndValue.replace(/\//g, "-"));

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

      timeStartValue ? (paramsObj.createTime = timeStartValue) : "";
      timeEndValue ? (paramsObj.createTimeEnd = timeEndValue) : "";
      if (uids.length > 0) {
        paramsObj.uids = uids.join(",");
      }
      getPageInfoList(paramsObj).then(res => {
        const tableList = res.data;
        let pageInfoList = [];
        let pageInfoColumn = [];
        tableList.forEach(tableItem => {
          const { pageInfo } = tableItem;
          const pageInfoItem = { label: pageInfo, value: pageInfo };
          pageInfoList.push(pageInfoItem);
          pageInfoColumn.push(pageInfo);
        });
        this.pageInfoOptions = pageInfoList;
        this.pageInfoColumns = pageInfoColumn;
      });
    },
    // 分页器
    handlePageChange() {
      this.getMobileList();
    },
    // 点击搜索
    handleSearchMobile() {
      if (!this.mobileSearchShow) {
        this.mobileSearchShow = true;
      }
    },
    // 取消搜索
    handleSearchMobileCancel() {
      if (this.mobileSearchShow) {
        this.mobileSearchShow = false;
      }
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
      this.getProductListMobile();
      if (this.category == "tt") {
        this.getPageInfoListMobile();
      } else {
        this.getChannelListMobile();
      }
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
        this.getProductListMobile();
        if (this.category == "tt") {
          this.getPageInfoListMobile();
        } else {
          this.getChannelListMobile();
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
    // 选择套餐属性
    handleChoosePageInfo() {
      if (!this.mobilePageInfoPickerShow) {
        this.mobilePageInfoPickerShow = !this.mobilePageInfoPickerShow;
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
        this.getProductListMobile();
        if (this.category == "tt") {
          this.getPageInfoListMobile();
        } else {
          this.getChannelListMobile();
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
    // 确认选择套餐属性
    pageInfoPickerConfirm(res) {
      if (this.mobilePageInfoPickerShow) {
        this.pageInfoMobileValue = res;
        this.mobilePageInfoPickerShow = !this.mobilePageInfoPickerShow;
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
    // 套餐属性快捷搜索
    handleSearchPageInfoItem() {
      this.pageInfoPickerCurrentSelect = this.pageInfoColumns.indexOf(
        this.pageInfoSearchValue
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
      this.mobileSearchButtonLoading = true;
      this.getMobileList();
      this.mobileSearchButtonLoading = false;
      this.mobileSearchShow = false;
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
    },
    // 刷新
    handleRefreshMobile() {
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
.cursor-pointer {
  cursor: pointer;
}

.table-input {
  width: 130px;
  padding: 5px 0;
}

.detail-dialog {
  width: 840px;
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
