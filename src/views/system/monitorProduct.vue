<template>
  <div class="app-container">
    <!-- PC端 功能按钮 -->
    <div v-if="device=='desktop'" class="filter-container">
      <el-input size="mini" class="table-input" placeholder="产品名称" v-model="nameInput" clearable></el-input>
      <el-button
        size="mini"
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        :loading="SearchButtonLoading"
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
        :loading="importProdcutLoading"
        @click="handleImportProduct"
      >导入商品</el-button>
    </div>
    <!-- 移动端 功能按钮 -->
    <div v-else class="filter-mobile">
      <van-button type="info" size="small" @click="handleSearchMobile">搜索</van-button>
    </div>
    <!-- 产品列表 -->
    <el-table
      size="mini"
      v-loading="listLoading"
      @cell-click="handleUseful"
      fit
      border
      :max-height="tableMaxHeight"
      :data="list.slice((currentPage-1)*pagesize,currentPage*pagesize)"
      style="width: 100%;user-select:none;"
    >
      <el-table-column label="商品名称" width="200px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.productName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="店铺名称" width="200px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.storeName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="商品主图" width="150px" align="center">
        <template slot-scope="scope">
          <img style="width: 100px; height: 100px" :src="scope.row.productMainImageUrl" />
        </template>
      </el-table-column>
      <el-table-column label="最低价格" width="100px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.minPrice }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="200px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" width="200px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.updateTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="总单量" width="100px" sortable="custom" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.count }}</span>
        </template>
      </el-table-column>
      <el-table-column label="1小时内" width="120px" sortable="custom" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.withInOneHour }}</span>
        </template>
      </el-table-column>
      <el-table-column label="3小时内" width="120px" sortable="custom" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.withInThreeHour }}</span>
        </template>
      </el-table-column>
      <el-table-column label="6小时内" width="120px" sortable="custom" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.withInSixHour }}</span>
        </template>
      </el-table-column>
      <el-table-column label="12小时内" width="120px" sortable="custom" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.withInTwelveHour }}</span>
        </template>
      </el-table-column>
      <el-table-column label="昨天" width="100px" sortable="custom" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.yestoday }}</span>
        </template>
      </el-table-column>
      <el-table-column label="昨日增长率" width="120px" sortable="custom" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.growthRate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="链接地址" width="120px" align="center">
        <template slot-scope="scope">
          <el-button :data-link="scope.row.linkChannel" type="primary" plain size="mini">点击访问</el-button>
        </template>
      </el-table-column>
      <el-table-column label="链接渠道" width="120px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.linkAddress }}</span>
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
      :total="list.length"
      class="pagination"
    ></el-pagination>
    <!-- 移动端 分页器 -->
    <div v-else class="mobile-pagination">
      <div class="mobile-pagejump">
        <span class="pagejump-count">共{{list.length}}条</span>
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
        v-model="currentPage"
        :total-items="list.length"
        :items-per-page="pagesize"
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
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { getMonitorProdutcList } from "@/api/orderList";
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
  name:'system-monitorProduct',
  data() {
    return {
      list: [],
      formLabelWidth: "120px",
      SearchButtonLoading: false,
      clearSearchButtonLoading: false,
      importProdcutLoading: false,
      listLoading: false,
      currentPage: 1, //当前页
      pagesizes: [20, 40, 60, 80, 100], //单页最大显示条数
      pagesize: 20, //单页内条数
      clickFlag: null, // 单击定时器
      mobileSearchShow: false,
      mobileSearchButtonLoading: false,
      tableMaxHeight: 0,
      pageJumpIndex: 1,
      nameInput: "",
      phoneMobileValue:""
    };
  },
  created() {
    this.list = this.getOrderList();
    this.device = this.$store.state.app.device;
    window.addEventListener("resize", this.getHeight);
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
    // 获取表格列表
    getOrderList() {
      let orderList = [];
      this.listLoading = true;
      getMonitorProdutcList({ contains: false, page: 1, rows: 500 }).then(
        res => {
          const tableList = res.data.rows;
          tableList.forEach(tableItem => {
            const {
              createTime,
              img,
              name,
              numbering,
              oneUp,
              threeUp,
              sixUp,
              twelveUp,
              twentyfourUp,
              twentyfourPercentage,
              sellNum,
              shopId,
              shopName,
              skuMinPrice,
              status,
              text,
              updateTime,
              url
            } = tableItem;
            const orderItem = {
              productName: name,
              storeName: shopName,
              productMainImageUrl: img,
              minPrice: skuMinPrice,
              createTime: createTime,
              updateTime: updateTime,
              count: sellNum,
              withInOneHour: oneUp,
              withInThreeHour: threeUp,
              withInSixHour: sixUp,
              withInTwelveHour: twelveUp,
              yestoday: twentyfourUp,
              growthRate: twentyfourPercentage,
              linkAddress: text,
              linkChannel: url
            };
            orderList.push(orderItem);
          });
        }
      );
      setTimeout(() => {
        this.listLoading = false;
      }, 1000);
      return orderList;
    },
    //表格高度自适应
    getHeight() {
      let otherHeight = this.device == "desktop" ? 250 : 200;
      this.tableMaxHeight = window.innerHeight - otherHeight;
    },
    //单击复制
    handleUseful(row, column, cell, event) {
      if (this.device == "mobile") return;
      if (this.clickFlag) {
        clearTimeout(this.clickFlag);
        this.clickFlag = null;
      }
      this.clickFlag = setTimeout(() => {
        let count = 0;
        if (column.label == undefined) return;
        if (column.label == "链接地址") {
          window.open(row.linkChannel);
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
    //搜索
    handleSearch() {
      let searchList = [];
      const name = this.nameInput;
      if (name == "") {
        this.$message.error("请填写产品名称");
        return;
      }
      this.listLoading = true;
      this.SearchButtonLoading = true;
      getMonitorProdutcList({
        contains: false,
        page: 1,
        rows: 500,
        name: name
      }).then(res => {
        const tableList = res.data.rows;
        tableList.forEach(tableItem => {
          const {
            createTime,
            img,
            name,
            numbering,
            oneUp,
            threeUp,
            sixUp,
            twelveUp,
            twentyfourUp,
            twentyfourPercentage,
            sellNum,
            shopId,
            shopName,
            skuMinPrice,
            status,
            text,
            updateTime,
            url
          } = tableItem;
          const orderItem = {
            productName: name,
            storeName: shopName,
            productMainImageUrl: img,
            minPrice: skuMinPrice,
            createTime: createTime,
            updateTime: updateTime,
            count: sellNum,
            withInOneHour: oneUp,
            withInThreeHour: threeUp,
            withInSixHour: sixUp,
            withInTwelveHour: twelveUp,
            yestoday: twentyfourUp,
            growthRate: twentyfourPercentage,
            linkAddress: text,
            linkChannel: url
          };
          searchList.push(orderItem);
        });
        this.list = searchList;
      });
      setTimeout(() => {
        this.listLoading = false;
        this.SearchButtonLoading = false;
      }, 1000);
    },
    handleClearSearch() {},
    handleImportProduct() {},
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

    /* 移动端事件 */

    //分页器
    handlePageChange() {
      this.listLoading = true;
      setTimeout(() => {
        this.listLoading = false;
      }, 600);
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
    //开始搜索
    handleMobileSearch() {
      this.mobileSearchButtonLoading = true;
      setTimeout(() => {
        this.mobileSearchButtonLoading = false;
        this.mobileSearchShow = false;
      }, 2000);
    },
    //限制页面跳转输入框只能输入数字
    jumpPageInput() {
      this.pageJumpIndex = this.pageJumpIndex.replace(/[^\d]/g, "");
    },
    //跳转指定页面
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
