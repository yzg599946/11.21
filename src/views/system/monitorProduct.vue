<template>
  <div class="app-container">
    <!-- PC端 功能按钮 -->
    <div ref="filterBox" v-if="device=='desktop'" class="filter-container">
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
    <vxe-table
      size="mini"
      ref="orderTable"
      :loading="listLoading"
      @cell-click="handleUseful"
      border
      :max-height="tableMaxHeight"
      :data.sync="list"
    >
      <vxe-table-column field="productName" title="商品名称" align="center" width="200" show-overflow></vxe-table-column>
      <vxe-table-column
        field="storeName"
        title="店铺名称"
        sortable
        align="center"
        width="200"
        show-overflow
      ></vxe-table-column>
      <vxe-table-column title="商品主图" sortable align="center" width="120" show-overflow>
        <template v-slot="{ row }">
          <div style="height:100px">
            <el-image fit="cover" :src="row.productMainImageUrl" lazy>
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline"></i>
              </div>
            </el-image>
          </div>
        </template>
      </vxe-table-column>
      <vxe-table-column field="minPrice" title="最低价格" width="90" align="center" show-overflow></vxe-table-column>
      <vxe-table-column field="createTime" title="创建时间" width="200" align="center" show-overflow></vxe-table-column>
      <vxe-table-column field="updateTime" title="更新时间" width="200" align="center" show-overflow></vxe-table-column>
      <vxe-table-column field="count" title="总单量" width="80" align="center" show-overflow></vxe-table-column>
      <vxe-table-column field="withInOneHour" title="1小时内" width="100" align="center" show-overflow></vxe-table-column>
      <vxe-table-column
        field="withInThreeHour"
        title="3小时内"
        width="100"
        align="center"
        show-overflow
      ></vxe-table-column>
      <vxe-table-column field="withInSixHour" title="6小时内" width="100" align="center" show-overflow></vxe-table-column>
      <vxe-table-column
        field="withInTwelveHour"
        title="12小时内"
        width="100"
        align="center"
        show-overflow
      ></vxe-table-column>
      <vxe-table-column field="yestoday" title="昨天" width="100" align="center" show-overflow></vxe-table-column>
      <vxe-table-column field="growthRate" title="昨日增长率" width="120" align="center" show-overflow></vxe-table-column>
      <vxe-table-column title="链接地址" width="100" align="center" show-overflow>
        <template v-slot="{ row }">
          <el-link :href="row.linkChannel" type="primary" target="_blank" :underline="false">点击访问</el-link>
        </template>
      </vxe-table-column>
      <vxe-table-column field="linkAddress" title="链接渠道" width="120" align="center" show-overflow></vxe-table-column>
    </vxe-table>

    <!-- 导入产品 -->
    <el-dialog
      v-loading="importLoading"
      title="导入商品"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <el-row :gutter="20" style="margin-bottom:20px;">
        <el-col :span="18">
          <el-input size="mini" v-model="urlInput" placeholder="请输入URL地址" clearable></el-input>
        </el-col>
        <el-col :span="6">
          <el-button size="mini" type="primary" @click="handleImportProductByUrl">导入</el-button>
        </el-col>
      </el-row>

      <el-upload
        class="upload-demo"
        ref="upload"
        :action="baseUrl+'/admin/monitorProduct'"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :file-list="fileList"
        :auto-upload="false"
        :with-credentials="true"
      >
        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
        <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">确认</el-button>
      </el-upload>
    </el-dialog>
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
              label="产品名称"
              v-model="nameMobileValue"
              placeholder="请输入产品名称"
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
import XEUtils from "xe-utils";
import permission from "@/directive/permission/index.js"; // 权限判断指令
import { getMonitorProductList, importMonitorProduct } from "@/api/orderList";
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
  name: "system-monitorProduct",
  directives: { permission },
  data() {
    return {
      list: [],
      formLabelWidth: "120px",
      SearchButtonLoading: false,
      clearSearchButtonLoading: false,
      importProdcutLoading: false,
      listLoading: false,
      currentPage: 1, //当前页
      mobileCurrentPage: 1,
      pagesizes: [500, 1000, 2000], //单页最大显示条数
      pagesize: 500, //单页内条数
      listTotal: 0, //总数
      clickFlag: null, // 单击定时器
      mobileSearchShow: false,
      mobileSearchButtonLoading: false,
      tableMaxHeight: 0,
      pageJumpIndex: 1,
      nameInput: "",
      nameMobileValue: "",
      dialogVisible: false,
      urlInput: "",
      fileList: [],
      importLoading: false,
      baseUrl: ""
    };
  },
  created() {
    this.getList();
    this.device = this.$store.state.app.device;
    window.addEventListener("resize", this.getHeight);
    this.getHeight();
    this.baseUrl = process.env.VUE_APP_BASE_API;
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
      let paramsObj = {
        contains: false,
        page: this.currentPage,
        rows: this.pagesize
      };
      this.nameInput == "" ? (paramsObj.name = this.nameInput) : "";
      getMonitorProductList(paramsObj).then(res => {
        this.listTotal = res.data.total;
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
      }, 1000);
    },
    //表格高度自适应
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
      if (this.nameInput == "") {
        this.$message.error("请输入产品名称");
        return;
      }
      this.SearchButtonLoading = true;
      this.getList();
      this.SearchButtonLoading = false;
    },
    handleClearSearch() {},
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
    //导入产品
    handleImportProduct() {
      this.dialogVisible = true;
    },
    // 确认选择
    submitUpload() {
      this.$refs.upload.submit();
      this.dialogVisible = false;
    },
    // 选择文件
    handlePreview(file) {},
    // 移除选择
    handleRemove(file, fileList) {},
    // 关闭
    handleClose() {
      this.dialogVisible = false;
    },
    // 导入商品
    handleImportProductByUrl() {
      if (this.urlInput == "") {
        this.$message.error("请输入URL地址");
        return;
      }
      this.importLoading = true;
      importMonitorProduct({ url: this.urlInput }).then(res => {
        if (res.status == 200) {
          this.dialogVisible = false;
          this.importLoading = false;
          this.$alert(res.data.replace(/;/g, "<br>"), "导入结果", {
            dangerouslyUseHTMLString: true,
            confirmButtonText: "确定",
            callback: action => {}
          });
        }
      });
    },

    /* 移动端事件 */

    //获取数据
    getMobileList() {
      this.listLoading = true;
      let searchList = [];
      let paramsObj = {
        contains: false,
        page: this.mobileCurrentPage,
        rows: this.pagesize
      };
      this.nameMobileValue != "" ? (paramsObj.name = this.nameMobileValue) : "";
      getMonitorProductList(paramsObj).then(res => {
        this.listTotal = res.data.total;
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
      this.nameMobileValue == "" ? "" : (this.nameMobileValue = "");
    },
    //开始搜索
    handleMobileSearch() {
      if (this.nameMobileValue == "") {
        this.$message.error("请输入产品名称");
        return;
      }
      this.mobileSearchButtonLoading = true;
      this.getMobileList();
      this.mobileSearchButtonLoading = false;
      this.mobileSearchShow = false;
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
      this.currentPage = jumpPage;
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
