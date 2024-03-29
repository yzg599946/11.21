<template>
  <div class="app-container">
    <!-- PC端 功能按钮 -->
    <div ref="filterBox" v-if="device=='desktop'" class="filter-container">
      <el-date-picker
        v-model="timeSelectValue"
        type="daterange"
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
      <el-select
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
      <el-input size="mini" class="table-input" placeholder="姓名" v-model="nameInput" clearable></el-input>
      <el-input
        size="mini"
        class="table-input"
        placeholder="电话"
        v-model="phoneNumberInput"
        clearable
      ></el-input>
      <el-select
        size="mini"
        class="table-input"
        v-model="usefulValue"
        clearable
        filterable
        placeholder="是否有效单"
      >
        <el-option
          v-for="item in usefulOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-select
        size="mini"
        class="table-input"
        v-model="repeatOrderValue"
        clearable
        filterable
        placeholder="是否重单"
      >
        <el-option
          v-for="item in repeatOrderOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-select
        size="mini"
        class="table-input"
        v-model="exportjdValue"
        clearable
        filterable
        placeholder="是否已导入京东"
      >
        <el-option
          v-for="item in exportjdOptions"
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
    <!-- 移动端 功能按钮 -->
    <div v-else class="filter-mobile">
      <van-button type="info" size="small" @click="handleSearchMobile">搜索</van-button>
      <van-button type="info" size="small" @click="handleRefreshMobile">刷新</van-button>
    </div>
    <!-- PC端 产品列表 -->
    <vxe-table
      v-if="device=='desktop'"
      size="mini"
      ref="orderTable"
      :loading="listLoading"
      @cell-click="handleUseful"
      @header-cell-click="handleSort"
      border
      show-footer
      show-overflow
      resizable
      :footer-method="footerMethod"
      :max-height="tableMaxHeight"
      :data.sync="list"
      :optimization="{scrollY: {gt: 500, oSize: 20, rSize: 60}}"
    >
      <vxe-table-column type="index" width="60" align="center"></vxe-table-column>
      <vxe-table-column field="cpName" title="项目渠道" align="center" width="120"></vxe-table-column>
      <vxe-table-column field="productName" title="产品名称" align="center" width="150">
        <template v-slot:header="{ column }">
          <span>产品名称</span>
          <i v-if="orderType == ''" class="el-icon-sort"></i>
          <i v-if="orderType == 'asc'" class="el-icon-sort-up"></i>
          <i v-if="orderType == 'desc'" class="el-icon-sort-down"></i>
        </template>
      </vxe-table-column>
      <vxe-table-column field="name" title="名字" width="120" align="center"></vxe-table-column>
      <vxe-table-column field="telephone" title="手机" width="120" align="center"></vxe-table-column>
      <vxe-table-column field="num" title="数量" width="80" align="center"></vxe-table-column>
      <vxe-table-column field="totalCost" title="总价" width="90" align="center"></vxe-table-column>
      <vxe-table-column field="isRepeat" title="重单" width="80" align="center"></vxe-table-column>
      <vxe-table-column field="address" title="详细地址" min-width="300" align="left"></vxe-table-column>
      <vxe-table-column title="是否可用" width="90" align="center">
        <template v-slot="{row}">
          <span v-if="row.mode == 1" style="color:#1890ff;">有效单</span>
          <span v-else style="color:red;">无效单</span>
        </template>
      </vxe-table-column>
      <vxe-table-column title="导入物流状态" width="120" align="center">
        <template v-slot="{row}">
          <span v-if="row.isImport == 1" style="color:#1890ff">已导入</span>
          <span v-else style="color:red">未导入</span>
        </template>
      </vxe-table-column>
      <vxe-table-column field="username" title="业务员" width="100" align="center"></vxe-table-column>
      <vxe-table-column field="operator" title="操作员" width="100" align="center"></vxe-table-column>
      <vxe-table-column field="operatingTime" title="核单间隔" width="120" align="center"></vxe-table-column>
    </vxe-table>
    <!-- 移动端 产品列表 -->
    <el-table
      v-else
      ref="orderTable"
      v-loading="listLoading"
      size="mini"
      border
      fit
      show-summary
      :highlight-current-row="false"
      :summary-method="getSummaries"
      :data="list"
      style="width: 100%;"
      :max-height="tableMaxHeight"
    >
      <el-table-column prop="cpName" label="项目渠道" width="120" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column
        prop="productName"
        label="产品名称"
        width="150"
        align="center"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column prop="name" label="名字" width="120" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="telephone" label="手机" width="120" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="num" label="数量" width="80" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="totalCost" label="总价" width="90" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="isRepeat" label="重单" width="80" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="address" label="详细地址" width="300" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="是否可用" width="90" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-if="scope.row.mode == 1" style="color:#1890ff;">有效单</span>
          <span v-else style="color:red;">无效单</span>
        </template>
      </el-table-column>
      <el-table-column label="导入物流状态" width="120" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-if="scope.row.isImport == 1" style="color:#1890ff">已导入</span>
          <span v-else style="color:red">未导入</span>
        </template>
      </el-table-column>
      <el-table-column prop="username" label="业务员" width="100" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="operator" label="操作员" width="100" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column
        prop="operatingTime"
        label="核单间隔"
        width="120"
        align="center"
        show-overflow-tooltip
      ></el-table-column>
    </el-table>
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
        v-model="mobileCurrentPage"
        :total-items="listTotal"
        :items-per-page="50"
        :show-page-size="3"
        force-ellipses
        @change="handlePageChange"
      />
    </div>
    <input
      id="copy_content"
      type="text"
      value
      style="position: absolute;top: 0;left: 0;opacity: 0;z-index: -10;"
    />
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
              @click="handleChooseIsUseful"
              title="是否有效单"
              is-link
              :value="usefulMobileValue"
            />
            <van-cell
              @click="handleChooseIsRepeatOrder"
              title="是否重单"
              is-link
              :value="repeatOrderMobileValue"
            />
            <van-cell
              @click="handleChooseExportJD"
              title="是否已导入京东"
              is-link
              :value="exportJDMobileValue"
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
      <!--是否有效选择弹窗-->
      <van-popup v-model="mobileUsefulPickerShow" position="bottom">
        <van-picker
          show-toolbar
          :columns="usefulColumns"
          @cancel="mobileUsefulPickerShow = false"
          @confirm="usefulPickerConfirm"
        />
      </van-popup>
      <!--是否重单选择弹窗-->
      <van-popup v-model="mobileRepeatOrderPickerShow" position="bottom">
        <van-picker
          show-toolbar
          :columns="repeatOrderColumns"
          @cancel="mobileRepeatOrderPickerShow = false"
          @confirm="repeatOrderPickerConfirm"
        />
      </van-popup>
      <!--是否导入京东-->
      <van-popup v-model="mobileExportJDPickerShow" position="bottom">
        <van-picker
          show-toolbar
          :columns="exportJDColumns"
          @cancel="mobileExportJDPickerShow = false"
          @confirm="exportJDPickerConfirm"
        />
      </van-popup>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { getStore } from "@/utils/store";
import XEUtils from "xe-utils";
import { parseTime } from "@/utils";
import {
  getAllOrderList,
  getSalesmanList,
  getChannelList,
  getProductList,
  getColorList
} from "@/api/orderList";
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
  name: "order-order",
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
      salemanOptions: [],
      salesmanColumns: [],
      channelOptions: [],
      channelColumns: [],
      productOptions: [],
      productColumns: [],
      colorOptions: [],
      colorColumns: [],
      usefulOptions: [
        {
          value: "0",
          label: "无效单"
        },
        {
          value: "1",
          label: "有效单"
        }
      ],
      usefulColumns: ["无效单", "有效单"],
      repeatOrderOptions: [
        {
          value: "0",
          label: "不重单"
        },
        {
          value: "1",
          label: "重单"
        }
      ],
      repeatOrderColumns: ["不重单", "重单"],
      repeatNamePhoneOptions: [
        {
          value: "0",
          label: "不重复手机姓名"
        },
        {
          value: "1",
          label: "重复手机姓名"
        }
      ],
      repeatNamePhoneColumns: ["不重复", "重复"],
      exportjdOptions: [
        {
          value: "0",
          label: "未导入"
        },
        {
          value: "1",
          label: "已导入"
        }
      ],
      exportJDColumns: ["未导入", "已导入"],
      timeSelectValue: "",
      salemanValue: "",
      channelValue: "",
      productValue: "",
      usefulValue: "",
      repeatOrderValue: "",
      exportjdValue: "",
      nameInput: "",
      phoneNumberInput: "",
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
      listLoading: false,
      currentPage: 1, //当前页
      mobileCurrentPage: 1,
      pagesizes: [300, 500, 1000, 5000], //单页最大显示条数
      pagesize: 300, //单页内条数
      listTotal: 0, //总数
      salemanWidth: "",
      multipleSelection: [],
      clickFlag: null, // 单击定时器
      mobileSearchShow: false,
      mobileDatePickerShow: false,
      mobileSalesmanPickerShow: false,
      mobileChannelPickerShow: false,
      mobileProductPickerShow: false,
      mobileUsefulPickerShow: false,
      mobileRepeatOrderPickerShow: false,
      mobileRepeatNamePhonePickerShow: false,
      mobileExportJDPickerShow: false,
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
      usefulMobileValue: "请选择",
      repeatOrderMobileValue: "请选择",
      exportJDMobileValue: "请选择",
      nameMobileValue: "",
      colorMobileValue: "",
      phoneMobileValue: "",
      minIdMobileValue: "",
      maxIdMobileValue: "",
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
      clearSearchButtonLoading: false,
      contains: false,
      orderType: "",
      orderName: ""
    };
  },
  created() {
    this.device = this.$store.state.app.device;
    window.addEventListener("resize", this.getHeight);
    this.$nextTick(() => {
      if (this.device === "desktop") {
        this.getList();
      } else {
        this.getMobileList();
      }
    });
    this.getHeight();
    this.getSalesman();
    this.getChannel();
    this.getProduct();
    this.getColor();
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
      this.repeatOrderValue ? (paramsObj.isRepeat = this.repeatOrderValue) : "";
      this.usefulValue ? (paramsObj.mode = this.usefulValue) : "";
      this.exportjdValue ? (paramsObj.isImport = this.exportjdValue) : "";
      this.nameInput ? (paramsObj.name = this.nameInput) : "";
      this.productValue ? (paramsObj.productId = this.productValue) : "";
      this.phoneNumberInput
        ? (paramsObj.telephone = this.phoneNumberInput)
        : "";
      if (this.salemanValue.length > 0) {
        paramsObj.uids = this.salemanValue.join(",");
      }
      if (this.orderType != "") {
        paramsObj.order = this.orderType;
        paramsObj.sort = this.orderName;
      }
      getAllOrderList(paramsObj)
        .then(res => {
          this.listTotal = res.data.total;
          this.list = res.data.rows;
          this.listLoading = false;
          this.$refs.orderTable.clearScroll();
        })
        .catch(error => {
          this.$message.error("获取数据时出错");
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
      let channelList = getStore({ name: "channelList" });
      this.channelOptions = JSON.parse(channelList);
      let channelColumns = [];
      this.channelOptions.forEach(channelItem => {
        channelColumns.push(channelItem.label);
      });
      this.channelColumns = channelColumns;
    },
    // 获取产品列表
    getProduct() {
      let productList = getStore({ name: "productList" });
      this.productOptions = JSON.parse(productList);
      let productColumns = [];
      this.productOptions.forEach(productItem => {
        productColumns.push(productItem.label);
      });
      this.productColumns = productColumns;
    },
    // 获取颜色列表
    getColor() {
      let colorList = getStore({ name: "colorList" });
      this.colorOptions = JSON.parse(colorList);
      let colorColumns = [];
      this.colorOptions.forEach(colorItem => {
        colorColumns.push(colorItem.label);
      });
      this.colorColumns = colorColumns;
    },
    // 表格高度自适应
    getHeight() {
      this.$nextTick(() => {
        if (this.device === "desktop") {
          this.tableMaxHeight =
            document.body.offsetHeight -
            (200 + this.$refs.filterBox.offsetHeight + 40 + 18);
        } else {
          this.tableMaxHeight =
            document.body.offsetHeight - (100 + 40 + 40 + 86 + 10 + 37);
        }
      });
    },
    // 单击复制
    handleUseful({ row, rowIndex, column, columnIndex }, event) {
      if (this.device == "mobile") return;

      let count = 0;
      if (column.title == undefined) return;
      if (column.title == "是否可用") {
        this.list.forEach(item => {
          if (item.id == row.id) {
          } else {
            count++;
          }
        });
      } else {
        let copyText = event.target.innerText;
        if (copyText) {
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
    },
    // 搜索
    handleSearch() {
      this.getList();
    },
    // 清空搜索项
    handleClearSearch() {
      this.timeSelectValue = "";
      this.salemanValue = [];
      this.channelValue = "";
      this.productValue = "";
      this.nameInput = "";
      this.phoneNumberInput = "";
      this.usefulValue = "";
      this.repeatOrderValue = "";
      this.exportjdValue = "";
      this.salemanChange();
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
    // 业务员选择器宽度自适应
    salemanChange() {
      const inputWidth = 178; //选择器原始宽度 178px
      let optionWidth = this.salemanValue.length * 65 + 97; //一个标签宽度65px 右边预留97px
      this.salemanWidth =
        optionWidth > inputWidth
          ? "width:" + optionWidth + "px"
          : "width:" + inputWidth + "px";
    },
    // 合计
    footerMethod({ columns, data }) {
      return [
        columns.map((column, columnIndex) => {
          if (columnIndex === 1) {
            return "合计";
          }
          if (["num", "totalCost"].includes(column.property)) {
            return XEUtils.sum(data, column.property);
          }
          return "-";
        })
      ];
    },
    // 刷新
    handleRefresh() {
      this.getList();
    },
    // 排序
    handleSort(
      {
        triggerResizable,
        triggerSort,
        triggerFilter,
        $rowIndex,
        column,
        columnIndex,
        $columnIndex,
        cell
      },
      event
    ) {
      if (column.title == "产品名称") {
        if (this.orderType == "") {
          this.orderType = "asc";
        } else if (this.orderType == "asc") {
          this.orderType = "desc";
        } else {
          this.orderType = "";
        }
        this.orderName = column.property;
        this.getList();
      }
    },

    /* 移动端事件 */

    // 获取数据
    getMobileList() {
      this.listLoading = true;
      let uids = [];
      let paramsObj = {
        contains: this.contains,
        rows: "50",
        page: this.mobileCurrentPage
      };

      this.timePickerStartValue == "请选择"
        ? ""
        : (paramsObj.createTime = this.timePickerStartValue.replace(
            /\//g,
            "-"
          ));
      this.timePickerEndValue == "请选择"
        ? ""
        : (paramsObj.createTimeEnd = this.timePickerEndValue.replace(
            /\//g,
            "-"
          ));
      if (this.productMobileValue != "请选择") {
        this.productOptions.forEach(productItem => {
          if (productItem.label == this.productMobileValue) {
            paramsObj.productId = productItem.value;
          }
        });
      }

      if (this.channelMobileValue != "请选择") {
        this.channelOptions.forEach(channelItem => {
          if (channelItem.label == this.channelMobileValue) {
            paramsObj.cid = channelItem.value;
          }
        });
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

      if (this.repeatOrderMobileValue != "请选择") {
        this.repeatOrderMobileValue == "重单"
          ? (paramsObj.isRepeat = 1)
          : (paramsObj.isRepeat = 0);
      }

      if (this.usefulMobileValue != "请选择") {
        this.usefulMobileValue == "有效单"
          ? (paramsObj.mode = 1)
          : (paramsObj.mode = 0);
      }
      if (this.exportJDMobileValue != "请选择") {
        this.exportJDMobileValue == "已导入"
          ? (paramsObj.isImport = 1)
          : (paramsObj.isImport = 0);
      }

      this.nameMobileValue ? (paramsObj.name = this.nameMobileValue) : "";
      this.phoneMobileValue
        ? (paramsObj.telephone = this.phoneMobileValue)
        : "";
      if (uids.length > 0) {
        paramsObj.uids = uids.join(",");
      }
      getAllOrderList(paramsObj)
        .then(res => {
          this.listTotal = res.data.total;
          this.list = res.data.rows;
          this.listLoading = false;
          this.$refs.orderTable.bodyWrapper.scrollTop = 0;
        })
        .catch(error => {
          this.$message.error("获取数据时出错");
          this.listLoading = false;
        });
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
        if (index === 4 || index === 5) {
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
    // 分页器
    handlePageChange() {
      console.log(this.mobileCurrentPage);
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
          : (this.productMobileValue = "请选择"),
        this.usefulMobileValue == "请选择"
          ? ""
          : (this.usefulMobileValue = "请选择"),
        this.repeatOrderMobileValue == "请选择"
          ? ""
          : (this.repeatOrderMobileValue = "请选择"),
        this.exportJDMobileValue == "请选择"
          ? ""
          : (this.exportJDMobileValue = "请选择"),
        this.nameMobileValue == "" ? "" : (this.nameMobileValue = ""),
        this.colorMobileValue == "" ? "" : (this.colorMobileValue = ""),
        this.phoneMobileValue == "" ? "" : (this.phoneMobileValue = ""),
        this.maxIdMobileValue == "" ? "" : (this.maxIdMobileValue = ""),
        this.minIdMobileValue == "" ? "" : (this.minIdMobileValue = ""),
        this.maxPriceMobileValue == "" ? "" : (this.maxPriceMobileValue = ""),
        this.minPriceMobileValue == "" ? "" : (this.minPriceMobileValue = "");
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
    // 选择是否有效
    handleChooseIsUseful() {
      if (!this.mobileUsefulPickerShow) {
        this.mobileUsefulPickerShow = !this.mobileUsefulPickerShow;
      }
    },
    // 选择是否重单
    handleChooseIsRepeatOrder() {
      if (!this.mobileRepeatOrderPickerShow) {
        this.mobileRepeatOrderPickerShow = !this.mobileRepeatOrderPickerShow;
      }
    },
    // 选择是否导入京东
    handleChooseExportJD() {
      if (!this.mobileExportJDPickerShow) {
        this.mobileExportJDPickerShow = !this.mobileExportJDPickerShow;
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
    // 确认选择是否有效
    usefulPickerConfirm(res) {
      if (this.mobileUsefulPickerShow) {
        this.usefulMobileValue = res;
        this.mobileUsefulPickerShow = !this.mobileUsefulPickerShow;
      }
    },
    // 确认选择是否重单
    repeatOrderPickerConfirm(res) {
      if (this.mobileRepeatOrderPickerShow) {
        this.repeatOrderMobileValue = res;
        this.mobileRepeatOrderPickerShow = !this.mobileRepeatOrderPickerShow;
      }
    },
    // 确认选择是否导入京东
    exportJDPickerConfirm(res) {
      if (this.mobileExportJDPickerShow) {
        this.exportJDMobileValue = res;
        this.mobileExportJDPickerShow = !this.mobileExportJDPickerShow;
      }
    },
    // 导入京东方式
    mobileExportJDSelect(item) {
      this.mobileExportJDDialogShow = false;
      Toast.success(item.name + "成功");
    },
    // 取消导入京东
    mobileExportJDCancel() {},
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
      this.mobileSearchButtonLoading = true;
      this.getMobileList();
      this.mobileSearchButtonLoading = false;
      this.mobileSearchShow = false;
    },
    // 限制页面跳转输入框只能输入数字
    jumpPageInput() {
      this.pageJumpIndex = this.pageJumpIndex.replace(/[^\d]/g, "");
    },
    // 跳转指定页面
    handleJumpPage() {
      let jumpPage = parseInt(this.pageJumpIndex);
      if (jumpPage == this.mobileCurrentPage) return;
      if (jumpPage > Math.ceil(this.listTotal / 50)) {
        jumpPage = Math.ceil(this.listTotal / 50);
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
  margin-bottom: 13px;
}

.table-input {
  width: 130px;
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
