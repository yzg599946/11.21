<template>
  <div class="app-container">
    <!-- PC端 功能按钮 -->
    <div v-if="device=='desktop'" class="filter-container">
      <el-input size="mini" class="table-input" placeholder="名称" v-model="nameInput" clearable></el-input>
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
        icon="el-icon-plus"
        @click="handleAdd"
      >新增</el-button>
      <el-button
        size="mini"
        class="filter-item"
        type="primary"
        icon="el-icon-delete"
        @click="handleDeleteSelect"
      >批量删除</el-button>
    </div>
    <!-- 移动端 功能按钮 -->
    <div v-else class="filter-mobile">
      <van-button type="info" size="small" @click="handleSearchMobile">搜索</van-button>
    </div>
    <!-- 列表 -->
    <el-table
      v-loading="listLoading"
      ref="colorTable"
      size="mini"
      border
      fit
      :max-height="tableMaxHeight"
      :data="list"
      style="width: 100%;"
      @cell-click="handleUseful"
      @row-click="handleSelect"
      @selection-change="handleSelectionChange"
    >
      <el-table-column fixed type="selection" align="center" width="50"></el-table-column>
      <el-table-column label="id" :width="device=='desktop'?'500':'170'" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="名称" :width="device=='desktop'?'500':'170'" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="device=='desktop'"
        label="操作"
        :width="device=='desktop'?'500':'100'"
        align="center"
      >
        <template slot-scope="scope">
          <el-button @click="handleUpdata(scope.row)" type="text" size="small">更新</el-button>
          <el-button @click="handleDelete(scope.row)" type="text" size="small">删除</el-button>
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
        v-model="mobileCurrentPage"
        :total-items="listTotal"
        :items-per-page="pagesize"
        :show-page-size="3"
        force-ellipses
        @change="handlePageChange"
      />
    </div>
    <!-- 更新颜色 -->
    <el-dialog title="更新颜色" :visible.sync="UpdateDialogVisible">
      <el-form :model="updateForm">
        <el-form-item label="颜色" :label-width="formLabelWidth">
          <el-input v-model="updateForm.name" clearable placeholder="请输入名称" class="normal-edit"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleUpdateCancel">取 消</el-button>
        <el-button type="primary" @click="handleUpdateConfirm">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 新增颜色 -->
    <el-dialog title="新增颜色" :visible.sync="editDialogVisible">
      <el-form :model="form">
        <el-form-item label="颜色" :label-width="formLabelWidth">
          <el-input v-model="form.colorName" clearable placeholder="请输入名称" class="normal-edit"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleEditCancel">取 消</el-button>
        <el-button type="primary" @click="handleEditConfirm">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 删除颜色 -->
    <el-dialog title="提示" :visible.sync="deleteDialogVisible">
      <span>是否删除{{deleteName}}?</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleDeleteCancel">取 消</el-button>
        <el-button type="primary" @click="handleDeleteConfirm">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 批量删除颜色 -->
    <el-dialog title="提示" :visible.sync="deleteSelectDialogVisible">
      <span>是否删除{{namesStr}}?</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleDeleteSelectCancel">取 消</el-button>
        <el-button type="primary" @click="handleDeleteSelectConfirm">确 定</el-button>
      </span>
    </el-dialog>
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
          <van-field
            clearable
            label="名称"
            v-model="nameMobileValue"
            placeholder="请输入名称"
            input-align="right"
            is-link
          />
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
import {
  getAllColorList,
  addColor,
  updateColor,
  deleteColor,
  deleteSelectColor
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
  name: "composite-color",
  data() {
    return {
      list: [],
      nameInput: "",
      formLabelWidth: "120px",
      dialogTableVisible: false,
      currentPage: 1, //当前页
      mobileCurrentPage: 1,
      pagesizes: [50, 100, 200], //单页最大显示条数
      pagesize: 50, //单页内条数
      listTotal: 0, //总数
      device: "",
      mobileSearchShow: false,
      mobileSearchButtonLoading: false,
      listLoading: false,
      editDialogVisible: false,
      UpdateDialogVisible: false,
      deleteDialogVisible: false,
      deleteSelectDialogVisible: false,
      form: {
        colorName: ""
      },
      updateForm: {
        id: "",
        name: ""
      },
      pageJumpIndex: 1,
      nameMobileValue: "",
      tableMaxHeight: 0,
      paramsStorage: {},
      multipleSelection: [],
      deleteId: "",
      deleteName: "",
      idsStr: "",
      namesStr: ""
    };
  },
  created() {
    this.getList();
    this.device = this.$store.state.app.device;
    this.getHeight();
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
      let orderList = [];
      let paramsObj = {
        contains: false,
        page: this.currentPage,
        rows: this.pagesize
      };
      this.nameInput != "" ? (paramsObj.name = this.name) : "";
      getAllColorList(paramsObj)
        .then(res => {
          this.listTotal = res.data.total;
          let tableList = res.data.rows;
          tableList.forEach(tableItem => {
            const { id, name } = tableItem;
            const orderItem = { id: id, name: name };
            orderList.push(orderItem);
          });
          this.list = orderList;
        })
        .catch(error => {
          console.log(error);
        });
      setTimeout(() => {
        this.listLoading = false;
      }, 1000);
    },
    // 表格高度自适应
    getHeight() {
      let otherHeight = this.device == "desktop" ? 250 : 200;
      this.tableMaxHeight = window.innerHeight - otherHeight;
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
        if (column.label == "操作") {
          this.list.forEach(item => {
            if (item.id == row.id) {
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
    // 单击选择行
    handleSelect(rows, column, event) {
      if (column.label == "操作") return;
      this.$refs.colorTable.toggleRowSelection(rows);
    },
    // 选择改变
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 搜索
    handleSearch() {
      if (this.nameInput == "") {
        this.$message.error("请输入颜色名称");
        return;
      }
      this.getList();
    },
    // 新增
    handleAdd() {
      if (!this.editDialogVisible) {
        this.editDialogVisible = true;
      }
    },
    // 取消新增
    handleEditCancel() {
      if (this.editDialogVisible) {
        this.editDialogVisible = false;
      }
    },
    // 新增验证
    addChannelVerify() {
      const { colorName } = this.form;
      if (colorName == "") {
        this.$message.error("请填写渠道名");
        return false;
      }
      return true;
    },
    // 确认新增
    handleEditConfirm() {
      if (!this.addChannelVerify()) return;
      const { colorName } = this.form;
      addColor({ name: colorName })
        .then(res => {
          if (res.status == 200) {
            this.getList();
            this.$message({
              message: "新增成功",
              type: "success"
            });
          }
        })
        .catch(error => {
          console.log(error);
        });
      this.editDialogVisible = false;
    },
    // 更新
    handleUpdata(row) {
      if (this.device == "mobile") return;
      this.updateForm.id = row.id;
      this.updateForm.name = row.name;
      this.UpdateDialogVisible = true;
    },
    // 更新验证
    updateVerify() {
      const { name } = this.updateForm;
      if (name == "") {
        this.$message.error("请输入颜色");
        return false;
      }
      return true;
    },
    // 确认更新
    handleUpdateConfirm() {
      if (!this.updateVerify()) return;
      const { id, name } = this.updateForm;
      updateColor({ id: id, name: name })
        .then(res => {
          if (res.status == 200) {
            this.getList();
            this.$message({
              message: "更新成功",
              type: "success"
            });
          }
        })
        .catch(error => {
          console.log(error);
        });
      this.UpdateDialogVisible = false;
    },
    // 取消更新
    handleUpdateCancel() {
      if (this.UpdateDialogVisible) {
        this.UpdateDialogVisible = false;
      }
    },
    // 删除
    handleDelete(row) {
      this.deleteId = row.id;
      this.deleteName = row.name;
      if (!this.deleteDialogVisible) {
        this.deleteDialogVisible = true;
      }
    },
    // 确认删除
    handleDeleteConfirm() {
      deleteColor({ id: this.deleteId }).then(res => {
        if (res.status == 200) {
          this.$message({
            message: "删除成功",
            type: "success"
          }),
            this.getList();
        }
        this.deleteDialogVisible = false;
      });
    },
    // 取消删除
    handleDeleteCancel() {
      this.deleteId = "";
      this.deleteName = "";
      if (this.deleteDialogVisible) {
        this.deleteDialogVisible = false;
      }
    },
    // 批量删除
    handleDeleteSelect() {
      if (this.multipleSelection.length === 0) {
        this.$message.error("未选择任何颜色");
        return;
      }
      let ids = [];
      let names = [];
      this.multipleSelection.forEach(selectItem => {
        ids.push(selectItem.id);
        names.push(selectItem.name);
      });
      this.idsStr = ids.join(",");
      this.namesStr = names.join(",");
      if (!this.deleteSelectDialogVisible) {
        this.deleteSelectDialogVisible = true;
      }
    },
    // 确认批量删除
    handleDeleteSelectConfirm() {
      deleteSelectColor({ ids: this.idsStr }).then(res => {
        if (res.status == 200) {
          this.$message({
            message: "删除成功",
            type: "success"
          }),
            this.getList();
        }
        this.deleteSelectDialogVisible = false;
      });
    },
    // 取消批量删除
    handleDeleteSelectCancel() {
      this.idsStr = "";
      this.namesStr = "";
      if (!this.deleteSelectDialogVisible) {
        this.deleteSelectDialogVisible = false;
      }
    },

    /* 移动端事件 */

    //获取数据
    getMobileList() {
      this.listLoading = true;
      let orderList = [];
      let paramsObj = {
        contains: false,
        page: this.mobileCurrentPage,
        rows: this.pagesize
      };
      this.nameMobileValue != "" ? (paramsObj.name = this.nameMobileValue) : "";
      getAllColorList(paramsObj)
        .then(res => {
          this.listTotal = res.data.total;
          let tableList = res.data.rows;
          tableList.forEach(tableItem => {
            const { id, name } = tableItem;
            const orderItem = { id: id, name: name };
            orderList.push(orderItem);
          });
          this.list = orderList;
        })
        .catch(error => {
          console.log(error);
        });
      setTimeout(() => {
        this.listLoading = false;
      }, 1000);
    },
    //搜索
    handleSearchMobile() {
      if (!this.mobileSearchShow) {
        this.mobileSearchShow = true;
      }
    },
    //清空
    handleSearchMobileClearAll() {
      this.nameMobileValue == "" ? "" : (this.nameMobileValue = "");
    },
    //取消搜索
    handleSearchMobileCancel() {
      if (this.mobileSearchShow) {
        this.mobileSearchShow = false;
      }
    },
    // 开始搜索
    handleMobileSearch() {
      if (this.nameMobileValue == "") {
        this.$message.error("请输入渠道名称");
        return;
      }
      this.mobileSearchButtonLoading = true;
      this.getMobileList();
      this.mobileSearchButtonLoading = false;
      this.mobileSearchShow = false;
    },
    // 分页器
    handlePageChange() {
     this.getMobileList();
    },
    // 限制页面跳转输入框只能输入数字
    jumpPageInput() {
      this.pageJumpIndex = this.pageJumpIndex.replace(/[^\d]/g, "");
    },
    // 跳转指定页面
    handleJumpPage() {
      console.log(1)
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
