<template>
  <div v-permission="[this.category + '-menu']" class="app-container">
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
        v-permission="[ this.category + '-list-user']"
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
      <el-select size="mini" v-model="productValue" clearable filterable placeholder="产品">
        <el-option
          v-for="item in productOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-input size="mini" class="table-input" placeholder="颜色名称" v-model="colorInput" clearable></el-input>
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
        v-model="repeatNamePhoneValue"
        clearable
        filterable
        placeholder="重复姓名手机"
      >
        <el-option
          v-for="item in repeatNamePhoneOptions"
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
      <el-input size="mini" class="table-input" placeholder="起始ID" v-model="minIdInput" clearable></el-input>
      <label>至</label>
      <el-input size="mini" class="table-input" placeholder="结束ID" v-model="maxIdInput" clearable></el-input>
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
        v-permission="[ this.category + '-list-export']"
        size="mini"
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        :loading="downloadLoading"
        @click="handleDownload"
      >导出excel</el-button>
      <el-button
        v-permission="[ this.category + '-list-export']"
        size="mini"
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        @click="handleExportDB"
      >导出为德邦</el-button>
      <el-button
        size="mini"
        class="filter-item"
        type="primary"
        icon="el-icon-upload2"
        @click="handleBatchImportIntoJD"
      >批量导入京东</el-button>
    </div>
    <!-- 移动端 功能按钮 -->
    <div v-else class="filter-mobile">
      <van-button type="info" size="small" @click="handleSearchMobile">搜索</van-button>
    </div>
    <!-- 产品列表 -->
    <el-table
      size="mini"
      ref="orderTable"
      v-loading="listLoading"
      @row-dblclick="handleEdit"
      @cell-click="handleUseful"
      @selection-change="handleSelectChange"
      :summary-method="getSummaries"
      fit
      border
      show-summary
      :rowHeight="30"
      useVirtual
      :height="tableMaxHeight"
      :data="list"
      style="width: 100%;"
    >
      <el-table-column
        :show-overflow-tooltip="true"
        v-if="device=='desktop'"
        fixed
        type="selection"
        align="center"
        width="50"
      ></el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="ID" prop="id" align="center" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="渠道项目" width="120px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.channel.substring(0,scope.row.channel.indexOf('-')) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="productName"
        label="产品名称"
        width="130px"
        sortable
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.productName }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="color"
        label="颜色名称"
        width="130px"
        sortable
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.color }}</span>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="名字" width="100px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="手机" width="130px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.phoneNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="数量" width="80px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.count }}</span>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="总价" width="80px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.price }}</span>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="重单" width="80px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.repeatOrder }}</span>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="详细地址" width="400px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.address }}</span>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="创建时间" width="200px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="备注" width="140px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.remarks }}</span>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="是否可用" width="100px" align="center">
        <template slot-scope="scope">
          <span
            style="cursor:pointer"
            :class="scope.row.isUseful==1?'blue':'red'"
          >{{ scope.row.isUseful==1?'有效单':'无效单' }}</span>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="导入物流状态" width="120px" align="center">
        <template slot-scope="scope">
          <span
            :class="scope.row.logisticsState==1?'blue':'red'"
          >{{ scope.row.logisticsState==1?'导入':'未导入' }}</span>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="业务员" width="90px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.salesman }}</span>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="操作员" width="90px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.operator }}</span>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="核单间隔" width="120px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.nuclearOrderInterval }}</span>
        </template>
      </el-table-column>
    </el-table>
    <!-- PC端 分页器 -->
    <el-pagination
      v-if="device!='mobile'"
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
    <!-- 编辑信息窗口 -->
    <el-dialog title="更新" :visible.sync="editDialogVisible">
      <el-form :model="form">
        <el-form-item label="产品型号" :label-width="formLabelWidth">
          <el-select v-model="form.productType" clearable filterable placeholder="请选择型号">
            <el-option
              v-for="item in productOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="名字" :label-width="formLabelWidth">
          <el-input v-model="form.name" clearable placeholder="请输入名字" class="normal-edit"></el-input>
        </el-form-item>
        <el-form-item label="颜色" :label-width="formLabelWidth">
          <el-select v-model="form.color" clearable filterable placeholder="请选择颜色">
            <el-option
              v-for="item in colorOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="数量" :label-width="formLabelWidth">
          <el-input v-model="form.count" clearable placeholder="请输入数量" class="normal-edit"></el-input>
        </el-form-item>
        <el-form-item label="总价" :label-width="formLabelWidth">
          <el-input v-model="form.price" clearable placeholder="请输入总价" class="normal-edit"></el-input>
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth">
          <el-input v-model="form.remarks" clearable placeholder="请输入备注" class="remarks-edit"></el-input>
        </el-form-item>
        <el-form-item label="地址" :label-width="formLabelWidth">
          <el-input v-model="form.address" clearable placeholder="请输入地址" class="address-edit"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleEditCancel">取 消</el-button>
        <el-button type="primary" @click="handleEditConfirm">确 定</el-button>
      </div>
    </el-dialog>
    <input
      id="copy_content"
      type="text"
      value
      style="position: absolute;top: 0;left: 0;opacity: 0;z-index: -10;"
    />
    <!--导入京东窗口 -->
    <el-dialog
      class="import-jd"
      size="mini"
      title="选择导入方式"
      :visible.sync="importTypeDialogVisible"
      width="30%"
      center
    >
      <div style="text-align:center;">
        <el-button @click="handleImportSky">导入航空件</el-button>
        <el-button @click="handleImportLand">导入陆运件</el-button>
      </div>
    </el-dialog>
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
              @click="handleChooseIsRepeatPhoneName"
              title="重复手机姓名"
              is-link
              :value="repeatNamePhoneMobileValue"
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
              label="颜色"
              v-model="colorMobileValue"
              placeholder="请输入颜色"
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
              label="起始ID"
              v-model="minIdMobileValue"
              placeholder="请输入起始ID"
              input-align="right"
              is-link
            />
            <van-field
              clearable
              label="结束ID"
              v-model="maxIdMobileValue"
              placeholder="请输入结束ID"
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
      <!--是否重复名字电话选择弹窗-->
      <van-popup v-model="mobileRepeatNamePhonePickerShow" position="bottom">
        <van-picker
          show-toolbar
          :columns="repeatNamePhoneColumns"
          @cancel="mobileRepeatNamePhonePickerShow = false"
          @confirm="repeatNamePhonePickerConfirm"
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
import permission from "@/directive/permission/index.js"; // 权限判断指令
import { parseTime } from "@/utils";
import {
  getOuterChainOrder,
  editOuterChainUsefulStatus,
  editOuterChainOrder,
  exportOuterChainExcel,
  getSalesmanList,
  getChannelList,
  getProductList,
  getColorList,
  importJD
} from "@/api/orderList";
import { setTimeout, clearTimeout } from "timers";
import store from "@/store";
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
  name: "orderTable",
  props: ["category"],
  directives: { permission },
  data() {
    return {
      list: [],
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
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
          label: "是"
        },
        {
          value: "1",
          label: "否"
        }
      ],
      usefulColumns: ["有效单", "无效单"],
      repeatOrderOptions: [
        {
          value: "0",
          label: "是"
        },
        {
          value: "1",
          label: "否"
        }
      ],
      repeatOrderColumns: ["重单", "不重单"],
      repeatNamePhoneOptions: [
        {
          value: "0",
          label: "是"
        },
        {
          value: "1",
          label: "否"
        }
      ],
      repeatNamePhoneColumns: ["重复", "不重复"],
      exportjdOptions: [
        {
          value: "0",
          label: "是"
        },
        {
          value: "1",
          label: "否"
        }
      ],
      exportJDColumns: ["已导入", "未导入"],
      timeSelectValue: "",
      salemanValue: "",
      channelValue: "",
      productValue: "",
      usefulValue: "",
      repeatOrderValue: "",
      repeatNamePhoneValue: "",
      exportjdValue: "",
      colorInput: "",
      nameInput: "",
      phoneNumberInput: "",
      minIdInput: "",
      maxIdInput: "",
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
      listLoading: false,
      currentPage: 1, //当前页
      pagesizes: [300, 500, 1000, 5000], //单页最大显示条数
      pagesize: 300, //单页内条数
      listTotal: 0, // 页面总数
      salemanWidth: "",
      importTypeDialogVisible: false,
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
      repeatNamePhoneMobileValue: "请选择",
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
      paramsStorage: {},
      contains: false,
      jdSelect: [],
      currentPagesize: 1
    };
  },
  created() {
    this.getList();
    this.device = this.$store.state.app.device;
    window.addEventListener("resize", this.getHeight);
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
      this.minIdInput ? (paramsObj.id = this.minIdInput) : "";
      this.maxIdInput ? (paramsObj.idEnd = this.maxIdInput) : "";
      this.repeatOrderValue ? (paramsObj.isRepeat = this.repeatOrderValue) : "";
      this.usefulValue ? (paramsObj.mode = this.usefulValue) : "";
      this.nameInput ? (paramsObj.name = this.nameInput) : "";
      this.productValue ? (paramsObj.productId = this.productValue) : "";
      this.phoneNumberInput
        ? (paramsObj.telephone = this.phoneNumberInput)
        : "";
      this.minPriceInput ? (paramsObj.totalCost = this.minPriceInput) : "";
      this.maxPriceInput ? (paramsObj.totalCostEnd = this.maxPriceInput) : "";
      if (this.salemanValue.length > 0) {
        paramsObj.uids = this.salemanValue.join(",");
      }
      getOuterChainOrder(this.category, paramsObj)
        .then(res => {
          this.listTotal = res.data.total;
          const tableData = res.data.rows;
          tableData.forEach(tableItem => {
            const {
              id,
              cpName,
              pid,
              productName,
              colorName,
              username,
              telephone,
              totalCost,
              pNum,
              num,
              price,
              size,
              isRepeat,
              address,
              createTime,
              remark,
              mode,
              isImport,
              name,
              uid,
              operator,
              operatingTime
            } = tableItem;
            const orderItem = {
              id: id,
              channel: cpName,
              pid: pid,
              productName: productName,
              color: colorName,
              name: name,
              phoneNumber: telephone,
              count: num,
              price: totalCost,
              size: size,
              repeatOrder: isRepeat,
              address: address,
              createTime: createTime,
              remarks: remark,
              isUseful: mode,
              logisticsState: isImport,
              salesman: username,
              uid: uid,
              operator: operator,
              nuclearOrderInterval: operatingTime
            };
            searchList.push(orderItem);
          });
          this.list = searchList;
        })
        .catch(error => {
          console.log(error);
        });
      this.listLoading = false;
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
    // 获取颜色列表
    getColor() {
      getColorList().then(res => {
        const colorList = res.data;
        colorList.forEach(colorItem => {
          if (colorItem.name) {
            const colorProject = {
              value: colorItem.id,
              label: colorItem.name
            };
            this.colorOptions.push(colorProject);
            this.colorColumns.push(colorItem.name);
          }
        });
      });
    },
    // 表格高度自适应
    getHeight() {
      let otherHeight = this.device == "desktop" ? 250 : 200;
      this.tableMaxHeight = window.innerHeight - otherHeight;
    },
    // 单击复制
    handleUseful(row, column, cell, event) {
      if (this.device == "mobile") return;
      if (this.clickFlag) {
        clearTimeout(this.clickFlag);
        this.clickFlag = null;
      }
      this.clickFlag = setTimeout(() => {
        let count = 0;
        if (column.label == undefined) return;
        if (column.label == "是否可用") {
          //判断权限
          const roles = store.getters && store.getters.roles;
          if (roles.indexOf(this.category + "-list-mode") == -1) {
            return;
          }
          this.list.forEach(item => {
            if (item.id == row.id) {
              this.handleChangeUseful({
                id: row.id,
                mode: this.list[count].isUseful
              });
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
    // 修改可用状态
    handleChangeUseful(data) {
      const { id, mode } = data;
      let modeInt;
      mode == 1 ? (modeInt = 0) : (modeInt = 1);
      editOuterChainUsefulStatus(this.category, {
        id: id,
        mode: modeInt
      })
        .then(res => {
          this.reloadPage();
          setTimeout(() => {
            this.$message({
              message: "修改成功",
              type: "success"
            });
          }, 1000);
        })
        .catch(error => {
          this.$message.error("修改失败");
          console.log(error);
        });
    },
    // 双击编辑
    handleEdit(e) {
      if (this.device == "mobile") return;
      //判断权限
      const roles = store.getters && store.getters.roles;
      if (roles.indexOf(this.category + "-list-update") == -1) {
        return;
      }
      if (this.clickFlag) {
        clearTimeout(this.clickFlag);
        this.clickFlag = null;
      }
      this.form.productType = e.productName;
      this.form.name = e.name;
      this.form.color = e.color;
      this.form.count = e.count;
      this.form.price = e.price;
      this.form.remarks = e.remarks;
      this.form.address = e.address;
      this.currentEditID = e.id;
      this.editDialogVisible = true;
    },
    // 取消编辑
    handleEditCancel() {
      this.editDialogVisible = false;
    },
    // 确认编辑
    handleEditConfirm(row, column, event) {
      let count = 0;
      let productId;
      let colorId;
      this.list.forEach(item => {
        if (item.id == this.currentEditID) {
          this.productOptions.forEach(productItem => {
            if (productItem.label === this.form.productType) {
              productId = productItem.value;
            }
          });

          if (this.form.color == null) {
            this.form.color = undefined;
          }

          const params = {
            id: this.list[count].id,
            productId: productId,
            name: this.form.name,
            colorName: this.form.color,
            num: this.form.count,
            totalCost: this.form.price,
            remark: this.form.remarks,
            address: this.form.address
          };
          editOuterChainOrder(this.category, params)
            .then(res => {
              this.reloadPage();
              setTimeout(() => {
                this.$message({
                  message: "修改成功",
                  type: "success"
                });
              }, 1000);
            })
            .catch(error => {
              this.$message.error("修改失败");
              console.log(error);
            });
        } else {
          count++;
        }
      });
      this.editDialogVisible = false;
    },
    // 搜索验证
    searchVerify() {
      if (
        (this.minIdInput && !this.maxIdInput) ||
        (!this.minIdInput && this.maxIdInput)
      ) {
        this.$message({
          message: "未填写完整的ID范围",
          type: "warning"
        });
        return false;
      }
      if (
        (this.minPriceInput && !this.maxPriceInput) ||
        (!this.minPriceInput && this.maxPriceInput)
      ) {
        this.$message({
          message: "未填写完整的价格范围",
          type: "warning"
        });
        return false;
      }
    },
    // 搜索
    handleSearch() {
      if (this.searchVerify()) return;
      this.listLoading = true;
      this.searchButtonLoading = true;
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
      this.minIdInput ? (paramsObj.id = this.minIdInput) : "";
      this.maxIdInput ? (paramsObj.idEnd = this.maxIdInput) : "";
      this.repeatOrderValue ? (paramsObj.isRepeat = this.repeatOrderValue) : "";
      this.usefulValue ? (paramsObj.mode = this.usefulValue) : "";
      this.nameInput ? (paramsObj.name = this.nameInput) : "";
      this.productValue ? (paramsObj.productId = this.productValue) : "";
      this.phoneNumberInput
        ? (paramsObj.telephone = this.phoneNumberInput)
        : "";
      this.minPriceInput ? (paramsObj.totalCost = this.minPriceInput) : "";
      this.maxPriceInput ? (paramsObj.totalCostEnd = this.maxPriceInput) : "";
      if (this.salemanValue.length > 0) {
        paramsObj.uids = this.salemanValue.join(",");
      }
      this.paramsStorage = paramsObj;
      getOuterChainOrder(this.category, paramsObj)
        .then(res => {
          this.listTotal = res.data.total;
          const tableData = res.data.rows;
          tableData.forEach(tableItem => {
            const {
              id,
              cpName,
              pid,
              productName,
              colorName,
              username,
              telephone,
              totalCost,
              pNum,
              num,
              price,
              size,
              isRepeat,
              address,
              createTime,
              remark,
              mode,
              isImport,
              name,
              uid,
              operator,
              operatingTime
            } = tableItem;
            const orderItem = {
              id: id,
              channel: cpName,
              pid: pid,
              productName: productName,
              color: colorName,
              name: name,
              phoneNumber: telephone,
              count: num,
              price: totalCost,
              size: size,
              repeatOrder: isRepeat,
              address: address,
              createTime: createTime,
              remarks: remark,
              isUseful: mode,
              logisticsState: isImport,
              salesman: username,
              uid: uid,
              operator: operator,
              nuclearOrderInterval: operatingTime
            };
            searchList.push(orderItem);
          });
          this.list = searchList;
          this.searchButtonLoading = false;
          this.listLoading = false;
        })
        .catch(error => {
          this.searchButtonLoading = false;
          this.listLoading = false;
          console.log(error);
        });
    },
    // 清空搜索项
    handleClearSearch() {
      this.timeSelectValue = ["", ""];
      this.salemanValue = [];
      this.channelValue = "";
      this.productValue = "";
      this.colorInput = "";
      this.nameInput = "";
      this.phoneNumberInput = "";
      this.usefulValue = "";
      this.repeatOrderValue = "";
      this.repeatNamePhoneValue = "";
      this.exportjdValue = "";
      this.minIdInput = "";
      this.maxIdInput = "";
      this.minPriceInput = "";
      this.maxPriceInput = "";
      this.salemanChange();
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
    // 导出excel
    handleDownload() {
      this.downloadLoading = true;
      if (this.multipleSelection.length === 0) {
        this.$message.error("未选择任何数据");
        this.downloadLoading = false;
        return;
      }

      let ids = [];
      this.multipleSelection.forEach(selectItem => {
        ids.push(selectItem.id);
      });
      let idsStr = ids.join(",");
      exportOuterChainExcel(this.category, {
        ids: idsStr,
        logistics: "yd"
      }).then(res => {
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
    // 业务员选择器宽度自适应
    salemanChange() {
      const inputWidth = 178; //选择器原始宽度 178px
      let optionWidth = this.salemanValue.length * 65 + 97; //一个标签宽度65px 右边预留97px
      this.salemanWidth =
        optionWidth > inputWidth
          ? "width:" + optionWidth + "px"
          : "width:" + inputWidth + "px";
    },
    // 选择发生改变
    handleSelectChange(selection) {
      this.multipleSelection = selection;
    },
    // 导出德邦
    handleExportDB() {
      this.downloadLoading = true;
      if (this.multipleSelection.length === 0) {
        this.$message.error("未选择任何数据");
        this.downloadLoading = false;
        return;
      }

      let ids = [];
      this.multipleSelection.forEach(selectItem => {
        ids.push(selectItem.id);
      });
      let idsStr = ids.join(",");
      exportOuterChainExcel(this.category, {
        ids: idsStr,
        logistics: "deppon"
      }).then(res => {
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
    // 批量导入京东
    handleBatchImportIntoJD() {
      if (this.multipleSelection.length === 0) {
        this.$message.error("未选择任何数据");
      } else {
        this.jdSelect = this.multipleSelection;
        this.importTypeDialogVisible = true;
      }
    },
    // 空运
    handleImportSky() {
      let ids = [];
      this.jdSelect.forEach(item => {
        ids.push(item.id);
      });
      let idsStr = ids.join(",");
      importJD(this.category, { ids: idsStr, trans: 2 }).then(res => {});
      this.$message.success("操作成功");
      this.importTypeDialogVisible = false;
    },
    // 陆运
    handleImportLand() {
      let ids = [];
      this.jdSelect.forEach(item => {
        ids.push(item.id);
      });
      let idsStr = ids.join(",");
      importJD(this.category, { ids: idsStr, trans: 1 }).then(res => {});
      this.$message.success("操作成功");
      this.importTypeDialogVisible = false;
    },
    // 合计
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      let count = 0;
      let price = 0;
      columns.forEach((column, index) => {
        if (index === 1) {
          sums[index] = "合计";
          return;
        }
        if (column.label == "数量") {
          data.forEach(index => {
            count = count + parseInt(index.count);
          });
          sums[index] = count || "";
        }
        if (column.label == "总价") {
          data.forEach(index => {
            price = price + parseInt(index.price);
          });
          sums[index] = price || "";
        }
      });
      return sums;
    },
    // 重载页面
    reloadPage() {
      if (JSON.stringify(this.paramsStorage) == "{}") {
        this.getOrderList();
      } else {
        console.log(this.paramsStorage);
        let searchList = [];
        getOuterChainOrder(this.category, this.paramsStorage).then(res => {
          const tableData = res.data.rows;
          tableData.forEach(tableItem => {
            const {
              id,
              cpName,
              pid,
              productName,
              colorName,
              username,
              telephone,
              totalCost,
              pNum,
              num,
              price,
              size,
              isRepeat,
              address,
              createTime,
              remark,
              mode,
              isImport,
              name,
              uid,
              operator,
              operatingTime
            } = tableItem;
            const orderItem = {
              id: id,
              channel: cpName,
              pid: pid,
              productName: productName,
              color: colorName,
              name: name,
              phoneNumber: telephone,
              count: num,
              price: totalCost,
              size: size,
              repeatOrder: isRepeat,
              address: address,
              createTime: createTime,
              remarks: remark,
              isUseful: mode,
              logisticsState: isImport,
              salesman: username,
              uid: uid,
              operator: operator,
              nuclearOrderInterval: operatingTime
            };
            searchList.push(orderItem);
          });
          this.list = searchList;
        });
      }
    },

    /* 移动端事件 */

    // 分页器
    handlePageChange() {
      console.log(this.currentPage)
      this.getList();
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
        this.repeatNamePhoneMobileValue == "请选择"
          ? ""
          : (this.repeatNamePhoneMobileValue = "请选择"),
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
    // 选择是否重复电话姓名
    handleChooseIsRepeatPhoneName() {
      if (!this.mobileRepeatNamePhonePickerShow) {
        this.mobileRepeatNamePhonePickerShow = !this
          .mobileRepeatNamePhonePickerShow;
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
    // 确认选择是否重复电话姓名
    repeatNamePhonePickerConfirm(res) {
      if (this.mobileRepeatNamePhonePickerShow) {
        this.repeatNamePhoneMobileValue = res;
        this.mobileRepeatNamePhonePickerShow = !this
          .mobileRepeatNamePhonePickerShow;
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
      let timeStartValue = "";
      let timeEndValue = "";
      let productId = "";
      let channelId = "";
      let uids = [];
      let repeatOrder = "";
      let usefulOrder = "";

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

      if (this.repeatOrderMobileValue != "请选择") {
        this.repeatOrderMobileValue == "重单"
          ? (repeatOrder = 1)
          : (repeatOrder = 0);
      } else {
        repeatOrder = "";
      }

      if (this.usefulMobileValue != "请选择") {
        this.usefulMobileValue == "有效单"
          ? (usefulOrder = 1)
          : (usefulOrder = 0);
      } else {
        usefulOrder = "";
      }
      this.mobileSearchButtonLoading = true;
      let searchList = [];
      const contains = false;
      const rows = 1000;
      const page = 1;

      let paramsObj = { contains: contains, rows: rows, page: page };
      timeStartValue ? (paramsObj.createTime = timeStartValue) : "";
      timeEndValue ? (paramsObj.createTimeEnd = timeEndValue) : "";
      this.channelValue ? (paramsObj.cid = this.channelValue) : "";
      this.minIdMobileValue ? (paramsObj.id = this.minIdMobileValue) : "";
      this.maxIdMobileValue ? (paramsObj.idEnd = this.maxIdMobileValue) : "";
      repeatOrder ? (paramsObj.isRepeat = repeatOrder) : "";
      usefulOrder ? (paramsObj.mode = usefulOrder) : "";
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
      this.paramsStorage = paramsObj;
      getOuterChainOrder(this.category, paramsObj)
        .then(res => {
          this.listTotal = res.data.total;
          const tableData = res.data.rows;
          if (tableData.length === 0) {
            this.mobileSearchButtonLoading = false;
            this.mobileSearchShow = false;
            return;
          }
          tableData.forEach(tableItem => {
            const {
              id,
              cpName,
              pid,
              productName,
              colorName,
              username,
              telephone,
              totalCost,
              pNum,
              num,
              price,
              size,
              isRepeat,
              address,
              createTime,
              remark,
              mode,
              isImport,
              name,
              uid,
              operator,
              operatingTime
            } = tableItem;
            const orderItem = {
              id: id,
              channel: cpName,
              pid: pid,
              productName: productName,
              color: colorName,
              name: name,
              phoneNumber: telephone,
              count: num,
              price: totalCost,
              size: size,
              repeatOrder: isRepeat,
              address: address,
              createTime: createTime,
              remarks: remark,
              isUseful: mode,
              logisticsState: isImport,
              salesman: username,
              uid: uid,
              operator: operator,
              nuclearOrderInterval: operatingTime
            };
            searchList.push(orderItem);
          });
          this.list = searchList;
          this.mobileSearchButtonLoading = false;
          this.mobileSearchShow = false;
        })
        .catch(error => {
          this.mobileSearchButtonLoading = false;
          this.mobileSearchShow = false;
          console.log(error);
        });
    },
    // 限制页面跳转输入框只能输入数字
    jumpPageInput() {
      this.pageJumpIndex = this.pageJumpIndex.replace(/[^\d]/g, "");
    },
    // 跳转指定页面
    handleJumpPage() {
      let jumpPage = parseInt(this.pageJumpIndex);
      if (jumpPage == this.currentPage) return;
      if (jumpPage > Math.ceil(this.list.length / this.pagesize)) {
        jumpPage = Math.ceil(this.list.length / this.pagesize);
      }
      if (jumpPage < 1) {
        jumpPage = 1;
      }
      this.listLoading = true;
      setTimeout(() => {
        this.pageJumpIndex = jumpPage;
        this.currentPage = jumpPage;
        this.listLoading = false;
      }, 1000);
    }
  }
};
</script>

<style lang="scss" scoped>
.filter-container {
  margin-bottom: 13px;
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
