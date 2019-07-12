<template>
  <div class="app-container">
    <!-- PC端 功能按钮 -->
    <div v-if="device=='desktop'" class="filter-container">
      <el-date-picker
        v-model="timeSelectValue"
        type="datetimerange"
        value-format="yyyy-MM-dd"
        :picker-options="pickerOptions"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        align="right"
        size="mini"
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
      <el-select size="mini" v-model="channelValue" clearable filterable placeholder="渠道项目">
        <el-option
          v-for="item in channelOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-select size="mini" v-model="productValue" clearable filterable placeholder="产品">
        <el-option
          v-for="item in productOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-select size="mini" v-model="logisticsValue" clearable filterable placeholder="物流状态">
        <el-option
          v-for="item in logisticsOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-select size="mini" v-model="accountValue" clearable filterable placeholder="头条账户">
        <el-option
          v-for="item in accountOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-input size="mini" class="table-input" placeholder="姓名" v-model="nameInput" clearable></el-input>
      <el-input
        size="mini"
        class="table-input"
        placeholder="电话"
        v-model="phoneNumberInput"
        clearable
      ></el-input>
      <el-input size="mini" class="table-input" placeholder="操作员" v-model="operatorInput" clearable></el-input>
      <el-input
        size="mini"
        class="table-input"
        placeholder="起始价格"
        v-model="minPriceInput"
        clearable
      ></el-input>
      <label>至</label>
      <el-input
        size="mini"
        class="table-input"
        placeholder="结束价格"
        v-model="maxPriceInput"
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
      <el-button
        size="mini"
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        :loading="downloadLoading"
        @click="handleDownload"
      >导出excel</el-button>
      <el-button
        size="mini"
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        :loading="exportLoading"
        @click="handleExportToutiao"
      >导出头条</el-button>
      <el-button
        size="mini"
        class="filter-item"
        type="primary"
        icon="el-icon-truck"
        @click="handleSigned"
      >当前物流签收率</el-button>
      <el-button
        size="mini"
        class="filter-item"
        type="primary"
        icon="el-icon-refresh"
        @click="handleExportLogbatch"
      >批量查询物流</el-button>
    </div>
    <!-- 移动端 功能按钮 -->
    <div v-else class="filter-mobile">
      <van-button type="info" size="small" @click="handleSearchMobile">搜索</van-button>
    </div>
    <!-- 产品列表 -->
    <vxe-table
      size="mini"
      ref="orderTable"
      :loading="listLoading"
      @cell-click="handleUseful"
      @select-change="handleSelectChange"
      @select-all="handleSelectAll"
      border
      highlight-hover-row
      show-footer
      :footer-method="footerMethod"
      :max-height="tableMaxHeight"
      :data.sync="list"
    >
      <vxe-table-column type="selection" width="30"></vxe-table-column>
      <vxe-table-column
        field="logisticsNumber"
        title="物流单号"
        align="center"
        width="150"
        show-overflow
      ></vxe-table-column>
      <vxe-table-column field="orderNumber" title="订单号" align="center" width="150" show-overflow></vxe-table-column>
      <vxe-table-column field="channel" title="渠道名称" align="center" width="120" show-overflow></vxe-table-column>
      <vxe-table-column
        field="recipientName"
        title="收件人姓名"
        align="center"
        width="120"
        show-overflow
      ></vxe-table-column>
      <vxe-table-column
        field="recipientPhone"
        title="收件人手机"
        align="center"
        width="120"
        show-overflow
      ></vxe-table-column>
      <vxe-table-column field="price" title="总价" align="center" width="90" show-overflow></vxe-table-column>
      <vxe-table-column field="productName" title="产品名称" align="center" width="100" show-overflow></vxe-table-column>
      <vxe-table-column field="count" title="数量" align="center" width="80" show-overflow></vxe-table-column>
      <vxe-table-column field="address" title="详细地址" align="center" width="300" show-overflow></vxe-table-column>
      <vxe-table-column field="createTime" title="创建时间" align="center" width="200" show-overflow></vxe-table-column>
      <vxe-table-column field="shipTime" title="发货时间" align="center" width="200" show-overflow></vxe-table-column>
      <vxe-table-column
        field="logisticsState"
        title="物流状态"
        align="center"
        width="120"
        show-overflow
      ></vxe-table-column>
      <vxe-table-column field="salesman" title="业务员" align="center" width="90" show-overflow></vxe-table-column>
      <vxe-table-column field="operator" title="操作员" align="center" width="90" show-overflow></vxe-table-column>
    </vxe-table>

    <input
      id="copy_content"
      type="text"
      value
      style="position: absolute;top: 0;left: 0;opacity: 0;z-index: -10;"
    />
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
        >
          <van-button slot="button" size="mini" type="info" @click="handleJumpPage">GO</van-button>
        </van-field>
      </div>
      <van-pagination
        v-model="mobileCurrentPage"
        :total-items="listTotal"
        :items-per-page="pagesize"
        :show-page-size="3"
        force-ellipses
        @change="handlePageChange"
      />
    </div>
    <!-- 移动端 搜索界面 -->
    <div v-if="device=='mobile'" class="search-container">
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
            <van-cell
              @click="handleChooseLogistics"
              title="物流状态"
              is-link
              :value="logisticsMobileValue"
            />
            <van-cell
              @click="handleChooseAccount"
              title="头条账户"
              is-link
              :value="accountMobileValue"
            />
            <van-field
              clearable
              label="姓名"
              v-model="nameMobileValue"
              placeholder="请输入姓名"
              input-align="right"
              is-link
            />
            <van-field
              clearable
              label="电话"
              v-model="phoneMobileValue"
              placeholder="请输入电话"
              input-align="right"
              is-link
            />
            <van-field
              clearable
              label="操作员"
              v-model="operatorMobileValue"
              placeholder="请输入操作员"
              input-align="right"
              is-link
            />
            <van-field
              clearable
              label="起始价格"
              v-model="minPriceMobileValue"
              placeholder="请输入起始价格"
              input-align="right"
              is-link
            />
            <van-field
              clearable
              label="结束价格"
              v-model="maxPriceMobileValue"
              placeholder="请输入结束价格"
              input-align="right"
              is-link
            />
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
      <!--头条账户选择弹窗-->
      <van-popup v-model="mobileAccountPickerShow" position="bottom">
        <van-picker
          show-toolbar
          :columns="accountColumns"
          @cancel="mobileAccountPickerShow = false"
          @confirm="accountPickerConfirm"
        />
      </van-popup>
      <!--物流状态选择弹窗-->
      <van-popup v-model="mobileLogisticsPickerShow" position="bottom">
        <van-picker
          show-toolbar
          :columns="logisticsColumns"
          @cancel="mobileLogisticsPickerShow = false"
          @confirm="logisticsPickerConfirm"
        />
      </van-popup>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import XEUtils from "xe-utils";
import {
  getJingdongLogisticsList,
  getSalesmanList,
  getChannelList,
  getProductList,
  exportToutiao,
  logisticsSigned,
  logisticslogBatch,
  exportLogisticsExcel
} from "@/api/orderList";
import { parseTime } from "@/utils";
import { setTimeout, clearTimeout } from "timers";
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
  name: "logistics-jd",
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
      salemanOptions: [],
      salesmanColumns: [],
      channelOptions: [],
      channelColumns: [],
      productOptions: [],
      productColumns: [],
      logisticsOptions: [
        {
          label: "无状态",
          value: "无状态"
        },
        {
          label: "运输中",
          value: "运输中"
        },
        {
          label: "已签收",
          value: "已签收"
        },
        {
          label: "拒签收",
          value: "拒签收"
        }
      ],
      logisticsColumns: ["无状态", "运输中", "已签收", "拒签收"],
      accountOptions: [
        {
          value: "瑞士劳斯宾腕表旗舰店",
          label: "瑞士劳斯宾腕表旗舰店"
        },
        {
          value: "LAOSIBIN隆辉腾专卖店",
          label: "LAOSIBIN隆辉腾专卖店"
        },
        {
          value: "瑞士劳斯宾品牌专卖店",
          label: "瑞士劳斯宾品牌专卖店"
        },
        {
          value: "杂货铺",
          label: "杂货铺"
        }
      ],
      accountColumns: [
        "瑞士劳斯宾腕表旗舰店",
        "LAOSIBIN隆辉腾专卖店",
        "瑞士劳斯宾品牌专卖店",
        "杂货铺"
      ],
      timeSelectValue: "",
      salemanValue: "",
      channelValue: "",
      productValue: "",
      logisticsValue: "",
      accountValue: "",
      nameInput: "",
      phoneNumberInput: "",
      minIdInput: "",
      maxIdInput: "",
      operatorInput: "",
      minPriceInput: "",
      maxPriceInput: "",
      formLabelWidth: "120px",
      editDialogVisible: false,
      form: {
        productType: "",
        name: "",
        color: "",
        count: "",
        price: "",
        remarks: "",
        address: ""
      },
      currentEditID: 0,
      downloadLoading: false,
      exportLoading: false,
      listLoading: false,
      currentPage: 1, //当前页
      mobileCurrentPage: 1,
      pagesizes: [300, 500, 1000, 5000], //单页最大显示条数
      pagesize: 300, //单页内条数
      listTotal: 0, //总数
      salemanWidth: "",
      importTypeDialogVisible: false,
      multipleSelection: [],
      clickFlag: null, // 单击定时器
      mobileSearchShow: false,
      mobileDatePickerShow: false,
      mobileSalesmanPickerShow: false,
      mobileChannelPickerShow: false,
      mobileProductPickerShow: false,
      mobileAccountPickerShow: false,
      mobileLogisticsPickerShow: false,
      minDate: new Date(1950, 10, 1),
      maxDate: new Date(),
      currentDate: new Date(),
      minDateEnd: new Date(),
      maxDateStart: new Date(),
      timePickerStartValue: "请选择",
      timePickerEndValue: "请选择",
      salesmanMobileValue: "请选择",
      channelMobileValue: "请选择",
      productMobileValue: "请选择",
      logisticsMobileValue: "请选择",
      accountMobileValue: "请选择",
      nameMobileValue: "",
      phoneMobileValue: "",
      operatorMobileValue: "",
      minPriceMobileValue: "",
      maxPriceMobileValue: "",
      device: "",
      salesmanSearchValue: "",
      channelSearchValue: "",
      productSearchValue: "",
      salesPickerCurrentSelect: 0,
      channelPickerCurrentSelect: 0,
      productPickerCurrentSelect: 0,
      datetimePickerType: "",
      mobileSearchButtonLoading: false,
      tableMaxHeight: 0,
      pageJumpIndex: 1,
      searchButtonLoading: false,
      clearSearchButtonLoading: false
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
      let channelLabel = "";
      this.channelOptions.forEach(channelItem => {
        if (channelItem.value == this.channelValue) {
          channelLabel = channelItem.label;
        }
      });

      this.timeSelectValue == "" ? this.timeSelectValue : ["", ""];
      let paramsObj = {
        contains: false,
        rows: this.pagesize,
        page: this.currentPage
      };
      this.timeSelectValue[0]
        ? (paramsObj.createTime = this.timeSelectValue[0])
        : "";
      this.timeSelectValue[1]
        ? (paramsObj.createTimeEnd = this.timeSelectValue[1])
        : "";
      channelLabel ? (paramsObj.senderName = channelLabel) : "";
      this.nameInput ? (paramsObj.receiveName = this.nameInput) : "";
      this.productValue ? (paramsObj.productId = this.productValue) : "";
      this.phoneNumberInput
        ? (paramsObj.receiveMobile = this.phoneNumberInput)
        : "";
      this.minPriceInput ? (paramsObj.totalCost = this.minPriceInput) : "";
      this.maxPriceInput ? (paramsObj.totalCostEnd = this.maxPriceInput) : "";
      this.logisticsValue ? (paramsObj.logistics = this.logisticsValue) : "";
      this.accountValue ? (paramsObj.remark = this.accountValue) : "";
      if (this.salemanValue.length > 0) {
        paramsObj.uids = this.salemanValue.join(",");
      }
      getJingdongLogisticsList(paramsObj)
        .then(res => {
          this.listTotal = res.data.total;
          const tableData = res.data.rows;
          tableData.forEach(tableItem => {
            const {
              deliveryId,
              orderId,
              senderName,
              receiveName,
              receiveMobile,
              collectionMoney,
              goods,
              num,
              receiveAddress,
              createTime,
              deliveryTime,
              logistics,
              username,
              operator
            } = tableItem;
            const orderItem = {
              logisticsNumber: deliveryId,
              orderNumber: orderId,
              channel: senderName,
              recipientName: receiveName,
              recipientPhone: receiveMobile,
              price: collectionMoney,
              productName: goods,
              count: num,
              address: receiveAddress,
              createTime: createTime,
              shipTime: deliveryTime,
              logisticsState: logistics,
              salesman: username,
              operator: operator
            };
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
    // 单击复制
    handleUseful({ row, rowIndex, column, columnIndex }, event) {
      if (this.device == "mobile") return;
      if (this.clickFlag) {
        clearTimeout(this.clickFlag);
        this.clickFlag = null;
      }
      this.clickFlag = setTimeout(() => {
        let count = 0;
        if (column.title == undefined) return;
        if (column.title == "是否可用") {
          this.list.forEach(item => {
            if (item.id == row.id) {
              this.list[count].isUseful = !this.list[count].isUseful;
            } else {
              count++;
            }
          });
        } else {
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
    // 搜索
    handleSearch() {
      this.searchButtonLoading = true;
      this.getList();
      this.searchButtonLoading = false;
    },
    // 清空搜索项
    handleClearSearch() {
      this.timeSelectValue = ["", ""];
      this.salemanValue = [];
      this.channelValue = "";
      this.productValue = "";
      this.nameInput = "";
      this.phoneNumberInput = "";
      this.logisticsValue = "";
      this.accountValue = "";
      this.operatorInput = "";
      this.minPriceInput = "";
      this.maxPriceInput = "";
      this.salemanChange();
    },
    //选择表格尺寸
    handleSizeChange(val) {
      this.pagesize = val;
      this.getList();
    },
    //选择表格当前页数
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getList();
    },
    //导出excel
    handleDownload() {
      this.downloadLoading = true;
      let channelLabel = "";
      this.channelOptions.forEach(channelItem => {
        if (channelItem.value == this.channelValue) {
          channelLabel = channelItem.label;
        }
      });

      this.timeSelectValue == "" ? this.timeSelectValue : ["", ""];
      let paramsObj = {};
      this.timeSelectValue[0]
        ? (paramsObj.createTime = this.timeSelectValue[0])
        : "";
      this.timeSelectValue[1]
        ? (paramsObj.createTimeEnd = this.timeSelectValue[1])
        : "";
      channelLabel ? (paramsObj.senderName = channelLabel) : "";
      this.nameInput ? (paramsObj.receiveName = this.nameInput) : "";
      this.productValue ? (paramsObj.productId = this.productValue) : "";
      this.phoneNumberInput
        ? (paramsObj.receiveMobile = this.phoneNumberInput)
        : "";
      this.minPriceInput ? (paramsObj.totalCost = this.minPriceInput) : "";
      this.maxPriceInput ? (paramsObj.totalCostEnd = this.maxPriceInput) : "";
      this.logisticsValue ? (paramsObj.logistics = this.logisticsValue) : "";
      this.accountValue ? (paramsObj.remark = this.accountValue) : "";
      if (this.salemanValue.length > 0) {
        paramsObj.uids = this.salemanValue.join(",");
      }

      exportLogisticsExcel(paramsObj, "jd").then(res => {
        const blob = new Blob([res], {
          type: "application/vnd.mx-excel;charset=utf-8"
        });
        let myDate = new Date();
        let year = myDate.getFullYear();
        let month = myDate.getMonth() + 1;
        let day = myDate.getDate();
        var downloadElement = document.createElement("a");
        var href = window.URL.createObjectURL(blob); //创建下载的链接
        downloadElement.href = href;
        downloadElement.download = `订单 ${year}-${month}-${day}.xls`; //下载后文件名
        document.body.appendChild(downloadElement);
        downloadElement.click(); //点击下载
        document.body.removeChild(downloadElement); //下载完成移除元素
        window.URL.revokeObjectURL(href); //释放掉blob对象
      });
      this.downloadLoading = false;
    },
    //导出头条
    handleExportToutiao() {
      let toutiaoValue = "";
      this.channelOptions.forEach(item => {
        if (item.label == "头条") {
          toutiaoValue = item.value;
        }
      });

      if (this.channelValue != toutiaoValue) {
        this.$message.error("请选择头条渠道");
        return;
      }

      this.timeSelectValue == "" ? this.timeSelectValue : ["", ""];
      let paramsObj = { senderName: "头条" };
      this.timeSelectValue[0]
        ? (paramsObj.createTime = this.timeSelectValue[0])
        : "";
      this.timeSelectValue[1]
        ? (paramsObj.createTimeEnd = this.timeSelectValue[1])
        : "";
      this.nameInput ? (paramsObj.receiveName = this.nameInput) : "";
      this.productValue ? (paramsObj.productId = this.productValue) : "";
      this.phoneNumberInput
        ? (paramsObj.receiveMobile = this.phoneNumberInput)
        : "";
      this.minPriceInput ? (paramsObj.totalCost = this.minPriceInput) : "";
      this.maxPriceInput ? (paramsObj.totalCostEnd = this.maxPriceInput) : "";
      this.logisticsValue ? (paramsObj.logistics = this.logisticsValue) : "";
      this.accountValue ? (paramsObj.remark = this.accountValue) : "";

      exportToutiao(paramsObj, "jd").then(res => {
        const blob = new Blob([res], {
          type: "application/csv;charset=utf-8"
        });
        let myDate = new Date();
        let year = myDate.getFullYear();
        let month = myDate.getMonth() + 1;
        let day = myDate.getDate();
        var downloadElement = document.createElement("a");
        var href = window.URL.createObjectURL(blob); //创建下载的链接
        downloadElement.href = href;
        downloadElement.download = `订单 ${year}-${month}-${day}.csv`; //下载后文件名
        document.body.appendChild(downloadElement);
        downloadElement.click(); //点击下载
        document.body.removeChild(downloadElement); //下载完成移除元素
        window.URL.revokeObjectURL(href); //释放掉blob对象
      });
    },
    //业务员选择器宽度自适应
    salemanChange() {
      const inputWidth = 178; //选择器原始宽度 178px
      let optionWidth = this.salemanValue.length * 65 + 97; //一个标签宽度65px 右边预留97px
      this.salemanWidth =
        optionWidth > inputWidth
          ? "width:" + optionWidth + "px"
          : "width:" + inputWidth + "px";
    },
    // 选择发生改变
    handleSelectChange({ selection, checked, row, column }, event) {
      this.multipleSelection = selection;
    },
    // 全选
    handleSelectAll({ selection, checked }, event) {
      this.multipleSelection = selection;
    },
    // 合计
    footerMethod({ columns, data }) {
      return [
        columns.map((column, columnIndex) => {
          if (columnIndex === 1) {
            return "合计";
          }
          if (["count", "price"].includes(column.property)) {
            return XEUtils.sum(data, column.property);
          }
          return "-";
        })
      ];
    },
    // 当前物流签收率
    handleSigned() {
      let paramsObj = {};
      let channelLabel = "";
      this.channelOptions.forEach(channelItem => {
        if (channelItem.value == this.channelValue) {
          channelLabel = channelItem.label;
        }
      });

      this.timeSelectValue == "" ? this.timeSelectValue : ["", ""];
      this.timeSelectValue[0]
        ? (paramsObj.createTime = this.timeSelectValue[0])
        : "";
      this.timeSelectValue[1]
        ? (paramsObj.createTimeEnd = this.timeSelectValue[1])
        : "";
      channelLabel ? (paramsObj.senderName = channelLabel) : "";
      this.nameInput ? (paramsObj.receiveName = this.nameInput) : "";
      this.productValue ? (paramsObj.productId = this.productValue) : "";
      this.phoneNumberInput
        ? (paramsObj.receiveMobile = this.phoneNumberInput)
        : "";
      this.minPriceInput ? (paramsObj.totalCost = this.minPriceInput) : "";
      this.maxPriceInput ? (paramsObj.totalCostEnd = this.maxPriceInput) : "";
      this.logisticsValue ? (paramsObj.logistics = this.logisticsValue) : "";
      this.accountValue ? (paramsObj.remark = this.accountValue) : "";
      if (this.salemanValue.length > 0) {
        paramsObj.uids = this.salemanValue.join(",");
      }
      logisticsSigned(paramsObj, "jd").then(res => {
        let result = res.data;
        this.$alert(result, "当前签收率", {
          confirmButtonText: "确定",
          dangerouslyUseHTMLString: true
        });
      });
    },

    // 批量查询物流状态
    handleExportLogbatch() {
      if (this.multipleSelection.length === 0) {
        this.$message.error("未选择任何订单");
        return;
      }
      let ids = [];
      this.multipleSelection.forEach(item => {
        ids.push(item.logisticsNumber);
      });
      let idsStr = ids.join(",");
      logisticslogBatch({ deliveryIds: idsStr }, "jd").then(res => {
        if (res.status == 200) {
          this.$message({
            type: "success",
            message: "更新成功"
          });
        } else {
          this.$message.error("更新失败");
        }
      });
    },

    /* 移动端事件 */

    // 获取数据
    getMobileList() {
      this.listLoading = true;
      let timeStartValue = "";
      let timeEndValue = "";
      let productId = "";
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
        rows: this.pagesize,
        page: this.mobileCurrentPage
      };
      timeStartValue ? (paramsObj.createTime = timeStartValue) : "";
      timeEndValue ? (paramsObj.createTimeEnd = timeEndValue) : "";
      this.channelMobileValue !='请选择'
        ? (paramsObj.senderName = this.channelMobileValue)
        : "";
      this.accountMobileValue !='请选择'
        ? (paramsObj.remark = this.accountMobileValue)
        : "";
      this.logisticsMobileValue !='请选择'
        ? (paramsObj.logistics = this.logisticsMobileValue)
        : "";
      this.nameMobileValue ? (paramsObj.name = this.nameMobileValue) : "";
      productId ? paramsObj.productId : "";
      this.phoneMobileValue
        ? (paramsObj.telephone = this.phoneMobileValue)
        : "";
      this.minPriceMobileValue
        ? (paramsObj.totalCost = this.minPriceMobileValue)
        : "";
      this.maxPriceMobileValue
        ? (paramsObj.totalCostEnd = this.maxPriceMobileValue)
        : "";
      if (uids.length > 0) {
        paramsObj.uids = uids.join(",");
      }
      getJingdongLogisticsList(paramsObj)
        .then(res => {
          this.listTotal = res.data.total;
          const tableData = res.data.rows;
          tableData.forEach(tableItem => {
            const {
              deliveryId,
              orderId,
              senderName,
              receiveName,
              receiveMobile,
              collectionMoney,
              goods,
              num,
              receiveAddress,
              createTime,
              deliveryTime,
              logistics,
              username,
              operator
            } = tableItem;
            const orderItem = {
              logisticsNumber: deliveryId,
              orderNumber: orderId,
              channel: senderName,
              recipientName: receiveName,
              recipientPhone: receiveMobile,
              price: collectionMoney,
              productName: goods,
              count: num,
              address: receiveAddress,
              createTime: createTime,
              shipTime: deliveryTime,
              logisticsState: logistics,
              salesman: username,
              operator: operator
            };
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
    //分页器
    handlePageChange() {
      this.getMobileList();
    },
    //点击搜索
    handleSearchMobile() {
      if (!this.mobileSearchShow) {
        this.mobileSearchShow = !this.mobileSearchShow;
      }
    },
    //取消搜索
    handleSearchMobileCancel() {
      if (this.mobileSearchShow) {
        this.mobileSearchShow = !this.mobileSearchShow;
      }
    },
    //清空所选
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
          : (this.productMobileValue = "请选择"),
        this.usefulMobileValue == "请选择"
          ? ""
          : (this.usefulMobileValue = "请选择"),
        this.repeatOrderMobileValue == "请选择"
          ? ""
          : (this.repeatOrderMobileValue = "请选择"),
        this.repeatNamePhoneMobileValue == "请选择"
          ? ""
          : (this.repeatNamePhoneMobileValue = "请选择"),
        this.exportJDMobileValue == "请选择"
          ? ""
          : (this.exportJDMobileValue = "请选择"),
        this.nameMobileValue == "" ? "" : (this.nameMobileValue = ""),
        this.colorMobileValue == "" ? "" : (this.colorMobileValue = ""),
        this.phoneMobileValue == "" ? "" : (this.phoneMobileValue = "");
    },
    //选择开始日期
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
    //选择结束日期
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
    //确认选择日期
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
    //取消选择日期
    datetimePickerCancel() {
      this.mobileDatePickerShow = !this.mobileDatePickerShow;
    },
    //选择业务员
    handleChooseSalesman() {
      if (!this.mobileSalesmanPickerShow) {
        this.mobileSalesmanPickerShow = !this.mobileSalesmanPickerShow;
      }
    },
    //选择渠道
    handleChooseChannel() {
      if (!this.mobileChannelPickerShow) {
        this.mobileChannelPickerShow = !this.mobileChannelPickerShow;
      }
    },
    //选择物流状态
    handleChooseLogistics() {
      if (!this.mobileLogisticsPickerShow) {
        this.mobileLogisticsPickerShow = !this.mobileLogisticsPickerShow;
      }
    },
    //选择头条账户
    handleChooseAccount() {
      if (!this.mobileAccountPickerShow) {
        this.mobileAccountPickerShow = !this.mobileAccountPickerShow;
      }
    },
    //选择产品
    handleChooseProduct() {
      if (!this.mobileProductPickerShow) {
        this.mobileProductPickerShow = !this.mobileProductPickerShow;
      }
    },
    //选择是否重复电话姓名
    handleChooseIsRepeatPhoneName() {
      if (!this.mobileRepeatNamePhonePickerShow) {
        this.mobileRepeatNamePhonePickerShow = !this
          .mobileRepeatNamePhonePickerShow;
      }
    },
    //选择是否导入京东
    handleChooseExportJD() {
      if (!this.mobileExportJDPickerShow) {
        this.mobileExportJDPickerShow = !this.mobileExportJDPickerShow;
      }
    },
    //确认选择业务员
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
    //确认选择渠道
    channelPickerConfirm(res) {
      if (this.mobileChannelPickerShow) {
        this.channelMobileValue = res;
        this.mobileChannelPickerShow = !this.mobileChannelPickerShow;
      }
    },
    //确认选择产品
    productPickerConfirm(res) {
      if (this.mobileProductPickerShow) {
        this.productMobileValue = res;
        this.mobileProductPickerShow = !this.mobileProductPickerShow;
      }
    },
    //确认选择是否有效
    accountPickerConfirm(res) {
      if (this.mobileAccountPickerShow) {
        this.accountMobileValue = res;
        this.mobileAccountPickerShow = !this.mobileAccountPickerShow;
      }
    },
    //确认选择是否重单
    logisticsPickerConfirm(res) {
      if (this.mobileLogisticsPickerShow) {
        this.logisticsMobileValue = res;
        this.mobileLogisticsPickerShow = !this.mobileLogisticsPickerShow;
      }
    },
    //导入京东方式
    mobileExportJDSelect(item) {
      this.mobileExportJDDialogShow = false;
      Toast.success(item.name + "成功");
    },
    //取消导入京东
    mobileExportJDCancel() {},
    //业务员快捷搜索
    handleSearchSalesmanItem() {
      this.salesPickerCurrentSelect = this.salesmanColumns.indexOf(
        this.salesmanSearchValue
      );
    },
    //渠道快捷搜索
    handleSearchChannelItem() {
      this.channelPickerCurrentSelect = this.channelColumns.indexOf(
        this.channelSearchValue
      );
    },
    //产品快捷搜索
    handleSearchProductItem() {
      this.productPickerCurrentSelect = this.productColumns.indexOf(
        this.productSearchValue
      );
    },
    //开始搜索
    handleMobileSearch() {
      this.mobileSearchButtonLoading = true;
      this.getMobileList();
      this.mobileSearchButtonLoading = false;
    },
    //限制页面跳转输入框只能输入数字
    jumpPageInput() {
      this.pageJumpIndex = this.pageJumpIndex.replace(/[^\d]/g, "");
    },
    //跳转指定页面
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
  width: 140px;
  padding: 5px 0;
}
.filter-container label {
  font-weight: 500;
  font-size: 12px;
}
.normal-edit {
  width: 200px;
}
.remarks-edit {
  width: 60%;
}
.address-edit {
  width: 80%;
}
.white {
  color: black;
}
.red {
  color: red;
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
