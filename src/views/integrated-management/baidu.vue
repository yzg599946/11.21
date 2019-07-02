<template>
  <div class="app-container">
    <!-- PC端 功能菜单 -->
    <div v-if="device!='mobile'" class="filter-container">
      <el-button
        size="mini"
        class="filter-item"
        type="primary"
        icon="el-icon-plus"
        @click="handleAdd"
      >新增</el-button>
    </div>
    <!-- 移动端 功能菜单 -->

    <!-- 列表 -->
    <el-table
      size="mini"
      border
      fit
      v-loading="listLoading"
      :data="list.slice((currentPage-1)*pagesize,currentPage*pagesize)"
      style="width: 100%;"
    >
      <el-table-column label="页面" :width="device=='desktop'?'400':'100'" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.page }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="用户"
        :width="device=='desktop'?'400':'100'"
        sortable="custom"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.account }}</span>
        </template>
      </el-table-column>
      <el-table-column label="产品" :width="device=='desktop'?'400':'100'" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.product }}</span>
        </template>
      </el-table-column>
      <el-table-column label="价格" :width="device=='desktop'?'400':'100'" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.price }}</span>
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
      <div class="mobile-pagejump">
        <span class="pagejump-count">共{{list.length}}条</span>
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
    <!-- 新增页面 -->
    <el-dialog title="增加百度页面" :visible.sync="editDialogVisible">
      <el-form :model="form">
        <el-form-item label="页面ID" :label-width="formLabelWidth">
          <el-input v-model="form.pageId" clearable placeholder="请输入页面ID" class="normal-edit"></el-input>
        </el-form-item>
        <el-form-item label="业务员" :label-width="formLabelWidth">
          <el-select v-model="form.salesman" clearable filterable placeholder="请选择业务员">
            <el-option
              v-for="item in salemanOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="产品" :label-width="formLabelWidth">
          <el-select v-model="form.product" clearable filterable placeholder="请选择产品">
            <el-option
              v-for="item in productOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="价格" :label-width="formLabelWidth">
          <el-input v-model="form.price" clearable placeholder="请输入价格" class="normal-edit"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleEditCancel">取 消</el-button>
        <el-button type="primary" @click="handleEditConfirm">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 移动端 功能列表 -->
  </div>
</template>

<script>
import Vue from "vue";
import {
  getBaiduPage,
  addBaiduPage,
  getSalesmanList,
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
  data() {
    return {
      list: [],
      formLabelWidth: "120px",
      dialogTableVisible: false,
      currentPage: 1, //当前页
      pagesizes: [20, 40, 60, 80, 100], //单页最大显示条数
      pagesize: 20, //单页内条数
      device: "",
      mobileSearchShow: false,
      mobileSearchButtonLoading: false,
      listLoading: false,
      pageJumpIndex:1,
      form: {
        pageId: "",
        salesman: "",
        product: "",
        price: ""
      },
      editDialogVisible: false,
      salemanOptions: [],
      productOptions: []
    };
  },
  created() {
    this.list = this.getOrderList();
    this.listLoading = false;
    this.device = this.$store.state.app.device;
    this.getSalesman();
    this.getProduct();
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
      getBaiduPage({ page: 1, rows: 50 }).then(res => {
        let tableList = res.data.rows;
        if (tableList.length === 0) {
          this.listLoading = false;
          return;
        }
        tableList.forEach(tableItem => {
          const { pageId, price, productId, uid } = tableItem;
          const orderItem = {
            page: pageId,
            account: uid,
            product: productId,
            price: price
          };
          orderList.push(orderItem);
        });
      });
      this.listLoading = false;
      return orderList;
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
      });
    },
    // 选择表格尺寸
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
    //新增
    handleAdd() {
      if (!this.editDialogVisible) {
        this.editDialogVisible = true;
      }
    },
    //新增验证
    addPageVerify() {
      const { pageId, price, product, salesman } = this.form;
      if (pageId == "") {
        this.$message.error("请输入页面ID");
        return false;
      }
      if (salesman == "") {
        this.$message.error("请选择业务员");
        return false;
      }
      if (product == "") {
        this.$message.error("请选择产品");
        return false;
      }
      if (price == "") {
        this.$message.error("请输入价格");
        return false;
      }

      return true;
    },
    //确认新增
    handleEditConfirm() {
      if (!this.addPageVerify()) return;
      const { pageId, price, product, salesman } = this.form;
      addBaiduPage({
        pageId: pageId,
        uid: salesman,
        productId: product,
        price: price
      }).then(res => {
        console.log(res);
      });
      if (this.editDialogVisible) {
        this.editDialogVisible = false;
      }
    },
    //取消新增
    handleEditCancel() {
      if (this.editDialogVisible) {
        this.editDialogVisible = false;
      }
    },

    /* 移动端事件 */

    // 分页器
    handlePageChange() {
      this.listLoading = true;
      setTimeout(() => {
        this.listLoading = false;
      }, 600);
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
  width: 120px;
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
