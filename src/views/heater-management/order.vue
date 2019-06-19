<template>
  <div class="app-container">
    <!-- PC端 功能按钮 -->
    <div v-if="device!='mobile'" class="filter-container">
      <el-date-picker
        v-model="timeSelectValue"
        type="datetimerange"
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
      <el-input size="mini" class="table-input" placeholder="颜色名称" v-model="colorInput" clearable></el-input>
      <el-input size="mini" class="table-input" placeholder="姓名" v-model="nameInput" clearable></el-input>
      <el-input
        size="mini"
        class="table-input"
        placeholder="电话"
        v-model="phoneNumberInput"
        clearable
      ></el-input>
      <el-select size="mini" v-model="usefulValue" clearable filterable placeholder="是否有效单">
        <el-option
          v-for="item in usefulOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-select size="mini" v-model="repeatOrderValue" clearable filterable placeholder="是否重单">
        <el-option
          v-for="item in repeatOrderOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-select
        size="mini"
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
      <el-select size="mini" v-model="exportjdValue" clearable filterable placeholder="是否已导入京东">
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
        @click="handleSearch"
      >搜索</el-button>
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
      v-loading="listLoading"
      @row-dblclick="handleEdit"
      @cell-click="handleUseful"
      @selection-change="handleSelectChange"
      fit
      border
      max-height="680"
      :data="list.slice((currentPage-1)*pagesize,currentPage*pagesize)"
      style="width: 100%;"
    >
      <el-table-column v-if="device=='desktop'" fixed type="selection" align="center" width="50"></el-table-column>
      <el-table-column label="ID" prop="id" align="center" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="渠道项目" width="100px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.channel }}</span>
        </template>
      </el-table-column>
      <el-table-column label="产品名称" width="120px" sortable="custom" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.productName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="颜色名称" width="120px" sortable="custom" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.color }}</span>
        </template>
      </el-table-column>
      <el-table-column label="名字" width="100px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="手机" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.phoneNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column label="数量" width="50px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.count }}</span>
        </template>
      </el-table-column>
      <el-table-column label="总价" width="50px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.price }}</span>
        </template>
      </el-table-column>
      <el-table-column label="重单" width="50px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.repeatOrder }}</span>
        </template>
      </el-table-column>
      <el-table-column label="详细地址" width="200px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.address }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" width="100px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.remarks }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否可用" width="80px" align="center">
        <template slot-scope="scope">
          <span
            style="cursor:pointer"
            :class="scope.row.isUseful?'black':'red'"
          >{{ scope.row.isUseful?'有效单':'无效单' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="导入物流状态" width="120px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.logisticsState }}</span>
        </template>
      </el-table-column>
      <el-table-column label="业务员" width="80px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.salesman }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作员" width="80px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.operator }}</span>
        </template>
      </el-table-column>
      <el-table-column label="核单间隔" width="80px" align="center">
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
      :total="list.length"
      class="pagination"
    ></el-pagination>
    <!-- 移动端 分页器 -->
    <div v-else class="mobile-pagination">
      <van-pagination
        v-model="currentPage"
        :total-items="list.length"
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
    >
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
            <van-cell @click="handleChooseProduct" title="产品" is-link :value="productMobileValue"/>
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
          <option v-for="item in salemanOptions" :key="item.value" :value="item.label"/>
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
          <option v-for="item in channelOptions" :key="item.value" :value="item.label"/>
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
          <option v-for="item in productOptions" :key="item.value" :value="item.label"/>
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
import { parseTime } from "@/utils";
import { getOrderList } from "@/api/orderList";
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
import { fail } from "assert";

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
      salemanOptions: [
        {
          value: "选项1",
          label: "李怀西"
        },
        {
          value: "选项2",
          label: "王怀东"
        },
        {
          value: "选项3",
          label: "李怀西"
        },
        {
          value: "选项4",
          label: "李怀西"
        },
        {
          value: "选项5",
          label: "李怀西"
        }
      ],
      salesmanColumns: [
        "李怀西",
        "王怀东",
        "李怀西",
        "李怀西",
        "李怀西",
        "李怀西"
      ],
      channelOptions: [
        {
          value: "选项1",
          label: "渠道1"
        },
        {
          value: "选项2",
          label: "渠道2"
        },
        {
          value: "选项3",
          label: "渠道3"
        },
        {
          value: "选项4",
          label: "渠道4"
        },
        {
          value: "选项5",
          label: "渠道5"
        }
      ],
      channelColumns: ["渠道1", "渠道2", "渠道3", "渠道4", "渠道5", "渠道6"],
      productOptions: [
        {
          value: "选项1",
          label: "产品1"
        },
        {
          value: "选项2",
          label: "产品2"
        },
        {
          value: "选项3",
          label: "产品3"
        },
        {
          value: "选项4",
          label: "产品4"
        },
        {
          value: "选项5",
          label: "产品5"
        }
      ],
      productColumns: [
        "产品1",
        "产品2",
        "产品3",
        "产品4",
        "产品5",
        "产品6",
        "产品7",
        "产品8"
      ],
      usefulOptions: [
        {
          value: "选项1",
          label: "是"
        },
        {
          value: "选项2",
          label: "否"
        }
      ],
      usefulColumns: ["有效单", "无效单"],
      repeatOrderOptions: [
        {
          value: "选项1",
          label: "是"
        },
        {
          value: "选项2",
          label: "否"
        }
      ],
      repeatOrderColumns: ["重单", "不重单"],
      repeatNamePhoneOptions: [
        {
          value: "选项1",
          label: "是"
        },
        {
          value: "选项2",
          label: "否"
        }
      ],
      repeatNamePhoneColumns: ["重复", "不重复"],
      exportjdOptions: [
        {
          value: "选项1",
          label: "是"
        },
        {
          value: "选项2",
          label: "否"
        }
      ],
      exportJDColumns: ["已导入", "未导入"],
      colorOptions: [
        {
          value: "选项1",
          label: "颜色1"
        },
        {
          value: "选项2",
          label: "颜色2"
        },
        {
          value: "选项3",
          label: "颜色3"
        },
        {
          value: "选项4",
          label: "颜色4"
        }
      ],
      colorColumns: ["颜色1", "颜色2", "颜色3", "颜色4", "颜色5", "颜色6"],
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
      listLoading: true,
      currentPage: 1, //当前页
      pagesizes: [20, 40, 60, 80, 100], //单页最大显示条数
      pagesize: 20, //单页内条数
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
      device: "",
      salesmanSearchValue: "",
      channelSearchValue: "",
      productSearchValue:"",
      salesPickerCurrentSelect: 0,
      channelPickerCurrentSelect: 0,
      productPickerCurrentSelect:0,
      datetimePickerType: "",
      mobileSearchButtonLoading: false
    };
  },
  created() {
    this.getDataList();
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
    //获取数据列表
    getDataList() {
      this.listLoading = true;
      this.list = getOrderList();
      this.listLoading = false;
    },
    //单击复制
    handleUseful(row, column, cell, event) {
      if ((this.device = "mobile")) return;
      if (this.clickFlag) {
        clearTimeout(this.clickFlag);
        this.clickFlag = null;
      }
      this.clickFlag = setTimeout(() => {
        let count = 0;
        if (column.label == undefined) return;
        if (column.label == "是否可用") {
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
    // 双击编辑
    handleEdit(e) {
      if (this.device == "mobile") return;
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
    //取消编辑
    handleEditCancel() {
      this.editDialogVisible = false;
    },
    //确认编辑
    handleEditConfirm(row, column, event) {
      let count = 0;
      this.list.forEach(item => {
        if (item.id == this.currentEditID) {
          this.list[count].productName = this.form.productType;
          this.list[count].name = this.form.name;
          this.list[count].color = this.form.color;
          this.list[count].count = this.form.count;
          this.list[count].price = this.form.price;
          this.list[count].remarks = this.form.remarks;
          this.list[count].address = this.form.address;
        } else {
          count++;
        }
      });
      this.editDialogVisible = false;
      this.$message({
        message: "修改成功",
        type: "success"
      });
    },
    handleSearch() {},
    //选择表格尺寸
    handleSizeChange(val) {
      this.listLoading = true;
      setTimeout(() => {
        this.pagesize = val;
        this.listLoading = false;
      }, 500);
    },
    //选择表格当前页数
    handleCurrentChange(val) {
      this.listLoading = true;
      setTimeout(() => {
        this.currentPage = val;
        this.listLoading = false;
      }, 500);
    },
    //导出excel
    handleDownload() {
      this.downloadLoading = true;
      import("@/vendor/Export2Excel").then(excel => {
        const tHeader = [
          "id",
          "渠道项目",
          "产品名称",
          "颜色名称",
          "名字",
          "手机",
          "数量",
          "总价",
          "重单",
          "详细地址",
          "创建时间",
          "备注",
          "是否可用",
          "导入物流状态",
          "业务员",
          "操作员",
          "核单间隔"
        ];
        const filterVal = [
          "id",
          "channel",
          "productName",
          "color",
          "name",
          "phoneNumber",
          "count",
          "price",
          "repeatOrder",
          "address",
          "createTime",
          "remarks",
          "isUseful",
          "logisticsState",
          "salesman",
          "operator",
          "nuclearOrderInterval"
        ];
        const list = this.list;
        const data = this.formatJson(filterVal, list);
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename:
            new Date().toLocaleDateString() + new Date().toLocaleTimeString(),
          autoWidth: true,
          bookType: "xlsx"
        });
        this.downloadLoading = false;
      });
    },
    //格式化数据
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          if (j === "timestamp") {
            return parseTime(v[j]);
          } else {
            return v[j];
          }
        })
      );
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
    //选择发生改变
    handleSelectChange(selection) {
      this.multipleSelection = selection;
    },
    //导入德邦
    handleExportDB() {},
    //批量导入京东
    handleBatchImportIntoJD() {
      if (!this.multipleSelection.length) {
        this.$message.error("未选择任何数据");
      } else {
        this.importTypeDialogVisible = true;
      }
    },
    //空运
    handleImportSky() {
      this.$message.success("操作成功");
      this.importTypeDialogVisible = false;
    },
    //陆运
    handleImportLand() {
      this.$message.success("操作成功");
      this.importTypeDialogVisible = false;
    },

    /* 移动端事件 */

    //分页器
    handlePageChange() {},
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
    //选择产品
    handleChooseProduct() {
      if (!this.mobileProductPickerShow) {
        this.mobileProductPickerShow = !this.mobileProductPickerShow;
      }
    },
    //选择是否有效
    handleChooseIsUseful() {
      if (!this.mobileUsefulPickerShow) {
        this.mobileUsefulPickerShow = !this.mobileUsefulPickerShow;
      }
    },
    //选择是否重单
    handleChooseIsRepeatOrder() {
      if (!this.mobileRepeatOrderPickerShow) {
        this.mobileRepeatOrderPickerShow = !this.mobileRepeatOrderPickerShow;
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
    usefulPickerConfirm(res) {
      if (this.mobileUsefulPickerShow) {
        this.usefulMobileValue = res;
        this.mobileUsefulPickerShow = !this.mobileUsefulPickerShow;
      }
    },
    //确认选择是否重单
    repeatOrderPickerConfirm(res) {
      if (this.mobileRepeatOrderPickerShow) {
        this.repeatOrderMobileValue = res;
        this.mobileRepeatOrderPickerShow = !this.mobileRepeatOrderPickerShow;
      }
    },
    //确认选择是否重复电话姓名
    repeatNamePhonePickerConfirm(res) {
      if (this.mobileRepeatNamePhonePickerShow) {
        this.repeatNamePhoneMobileValue = res;
        this.mobileRepeatNamePhonePickerShow = !this
          .mobileRepeatNamePhonePickerShow;
      }
    },
    //确认选择是否导入京东
    exportJDPickerConfirm(res) {
      if (this.mobileExportJDPickerShow) {
        this.exportJDMobileValue = res;
        this.mobileExportJDPickerShow = !this.mobileExportJDPickerShow;
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
    handleSearchProductItem(){
      this.productPickerCurrentSelect = this.productColumns.indexOf(
        this.productSearchValue
      )
    },
    //开始搜索
    handleMobileSearch() {
      this.mobileSearchButtonLoading = true;
      setTimeout(() => {
        this.mobileSearchButtonLoading = false;
        this.mobileSearchShow = false;
      }, 2000);
      console.log("开始时间:" + this.timePickerStartValue);
      console.log("结束时间:" + this.timePickerEndValue);
      console.log("业务员:" + this.salesmanMobileValue);
      console.log("渠道项目:" + this.channelMobileValue);
      console.log("产品:" + this.productMobileValue);
      console.log("是否有效单:" + this.usefulMobileValue);
      console.log("是否重单:" + this.repeatOrderMobileValue);
      console.log("重复手机姓名:" + this.repeatNamePhoneMobileValue);
      console.log("是否已导入京东:" + this.exportJDMobileValue);
      console.log("姓名:" + this.nameMobileValue);
      console.log("颜色:" + this.colorMobileValue);
      console.log("电话:" + this.phoneMobileValue);
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
</style>
