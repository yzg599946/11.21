<template>
  <div class="app-container">
    <!-- PC端 功能按钮 -->
    <div v-if="device=='desktop'" class="filter-container">
      <el-input size="mini" class="table-input" placeholder="角色名" v-model="usernameInput" clearable></el-input>
      <el-button
        size="mini"
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        :loading="searchButtonLoading"
        @click="handleSearch"
      >搜索</el-button>
      <el-button
        v-permission="['system-role-list-insert']"
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
      size="mini"
      v-loading="listLoading"
      fit
      border
      @selection-change="handleSelectionChange"
      :max-height="tableMaxHeight"
      :data="list"
      style="width: 100%;"
    >
      <el-table-column label="id" :width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="角色名" :width="device=='desktop'?'800':'250'" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="device=='desktop'" fixed type="selection" width="60" align="center"></el-table-column>
      <el-table-column
        v-if="device=='desktop' && checkPermission(['system-role-list-update','system-role-list-delete'])"
        label="操作"
        :width="device=='desktop'?'500':'100'"
        align="center"
      >
        <template slot-scope="scope">
          <el-button
            v-permission="['system-role-list-update']"
            @click="handleUpdata(scope.row)"
            type="text"
            size="small"
          >更新</el-button>
          <el-button
            v-permission="['system-role-list-delete']"
            @click="handleDelete(scope.row)"
            type="text"
            size="small"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 新增角色窗口 -->
    <el-dialog title="新增角色" :visible.sync="addDialogVisible">
      <el-form :model="form" size="mini">
        <el-form-item label="角色名" :label-width="formLabelWidth">
          <el-input v-model="form.name" clearable placeholder="请输入角色名" class="normal-edit"></el-input>
        </el-form-item>
        <el-form-item label="权限" :label-width="formLabelWidth">
          <el-tree
            :data="treeData"
            accordion
            show-checkbox
            node-key="id"
            :props="defaultProps"
            @check="handlePermisionCheck"
          ></el-tree>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleAddCancel">取 消</el-button>
        <el-button type="primary" @click="handleAddConfirm">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 更新用户窗口 -->
    <el-dialog title="更新角色" :visible.sync="updateDialogVisible">
      <el-form :model="updateForm" size="mini">
        <el-form-item label="角色名" :label-width="formLabelWidth">
          <el-input v-model="updateForm.name" clearable placeholder="请输入角色名" class="normal-edit"></el-input>
        </el-form-item>
        <el-form-item label="权限" :label-width="formLabelWidth">
          <el-tree
            :data="updateTreeData"
            :default-checked-keys="updateForm.checkList"
            show-checkbox
            node-key="id"
            :props="defaultProps"
            @check="handleUpdatePermisionCheck"
          ></el-tree>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleUpdateCancel">取 消</el-button>
        <el-button type="primary" @click="handleUpdateConfirm">确 定</el-button>
      </div>
    </el-dialog>
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
            <van-field
              clearable
              label="角色名"
              v-model="nameMobileValue"
              placeholder="请输入角色名"
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
import permission from "@/directive/permission/index.js"; // 权限判断指令
import checkPermission from "@/utils/permission"; // 权限判断函数
import {
  getRoleList,
  addRoleInquired,
  addRole,
  updateRoleInquired,
  updateRole,
  deleteRole,
  deleteSelectRole
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
  name: "system-role",
  directives: { permission },
  data() {
    return {
      list: [],
      usernameInput: "",
      usefulValue: "",
      usefulOptions: [
        {
          value: "1",
          label: "是"
        },
        {
          value: "0",
          label: "否"
        }
      ],
      usefulColumns: ["是", "否"],
      formLabelWidth: "120px",
      dialogTableVisible: false,
      currentPage: 1, //当前页
      mobileCurrentPage: 1,
      pagesizes: [100, 200, 500], //单页最大显示条数
      pagesize: 100, //单页内条数
      listTotal: 0, //总数
      device: "",
      mobileSearchShow: false,
      mobileSearchButtonLoading: false,
      searchButtonLoading: false,
      tableMaxHeight: 0,
      addDialogVisible: false,
      updateDialogVisible: false,
      form: {
        checkList: [],
        name: ""
      },
      updateForm: {
        checkList: [],
        username: "",
        name: "",
        password: "",
        telephone: "",
        mode: ""
      },
      updatePermissionList: [],
      listLoading: false,
      multipleSelection: [],
      updateId: "",
      treeData: [],
      defaultProps: {
        children: "children",
        label: "name"
      },
      updateTreeData: [],
      pageJumpIndex: 1,
      nameMobileValue: ""
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
    checkPermission,
    // 获取数据
    getList() {
      this.listLoading = true;
      let searchList = [];
      let paramObj = {
        page: this.currentPage,
        rows: this.pagesize
      };
      this.usernameInput ? (paramObj.name = name) : "";
      getRoleList(paramObj).then(res => {
        const tableList = res.data.rows;
        tableList.forEach(tableItem => {
          const { id, name } = tableItem;
          const orderItem = {
            id: id,
            name: name
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
      let otherHeight = this.device == "desktop" ? 250 : 200;
      this.tableMaxHeight = window.innerHeight - otherHeight;
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
    // 选择改变
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 搜索
    handleSearch() {
      this.searchButtonLoading = true;
      this.getList();
      this.searchButtonLoading = false;
    },
    // 新增
    handleAdd() {
      addRoleInquired().then(res => {
        this.treeData = res.data;
      });
      this.addDialogVisible = true;
    },
    // 权限选择变化时
    handlePermisionCheck(current, status) {
      this.form.checkList = status.checkedKeys;
    },
    // 取消新增
    handleAddCancel() {
      this.addDialogVisible = false;
    },
    // 验证新增
    addVerify() {
      return true;
    },
    // 确认新增
    handleAddConfirm() {
      if (!this.addVerify()) return;
      this.listLoading = true;
      let name = this.form.name;
      let functionId = this.form.checkList.join(",");
      addRole({
        functionId: functionId,
        name: name
      })
        .then(res => {
          if (res.status === 200) {
            this.getList();
            this.$message({
              type: "success",
              message: "添加用户成功"
            });
          } else {
            this.$message.error("添加失败");
          }
        })
        .catch(error => {
          console.log(error);
        });
      this.listLoading = false;
      this.addDialogVisible = false;
    },
    // 更新
    handleUpdata(rows) {
      updateRoleInquired({ id: rows.id }).then(res => {
        this.updateId = rows.id;
        this.updateForm.name = res.data.role.name;
        this.updateForm.checkList = res.data.functiona;
        this.updateTreeData = res.data.functionList;
      });
      this.updateDialogVisible = true;
    },
    // 权限选择变化时
    handleUpdatePermisionCheck(current, status) {
      this.updateForm.checkList = status.checkedKeys;
    },
    // 取消更新
    handleUpdateCancel() {
      this.updateDialogVisible = false;
    },
    // 验证更新
    updateVerify() {
      return true;
    },
    // 确认更新
    handleUpdateConfirm() {
      if (!this.updateVerify()) {
        return;
      }
      this.listLoading = true;
      let id = this.updateId;
      let name = this.updateForm.name;
      let functionId = this.updateForm.checkList.join(",");
      updateRole({
        id: id,
        functionId: functionId,
        name: name
      })
        .then(res => {
          if (res.status === 200) {
            this.getList();
            this.$message({
              type: "success",
              message: "更新用户成功"
            });
          } else {
            this.$message.error("更新失败");
          }
        })
        .catch(error => {
          console.log(error);
        });
      this.listLoading = false;
      this.updateDialogVisible = false;
    },
    // 删除
    handleDelete(rows) {
      this.$confirm("此操作将永久删除该角色, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.listLoading = true;
          deleteRole({ id: rows.id }).then(res => {
            if (res.status === 200) {
              this.getList();
              this.$message({
                type: "success",
                message: "删除角色成功"
              });
            } else {
              this.$message.error("删除失败");
            }
          });
          this.listLoading = false;
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 批量删除
    handleDeleteSelect() {
      this.$confirm("此操作将永久删除该角色, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          if (this.multipleSelection.length === 0) {
            this.$message.error("未选择数据");
            return;
          }
          let ids = [];
          this.multipleSelection.forEach(selectItem => {
            ids.push(selectItem.id);
          });
          let idsStr = ids.join(",");
          deleteSelectRole({ ids: idsStr }).then(res => {
            if (res.status === 200) {
              this.getList();
              this.$message({
                type: "success",
                message: "批量删除角色成功"
              });
            } else {
              this.$message.error("删除失败");
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },

    /* 移动端事件 */

    // 获取数据
    getMobileList() {
      this.listLoading = true;
      let searchList = [];
      let paramObj = {
        page: this.mobileCurrentPage,
        rows: this.pagesize
      };
      this.nameMobileValue ? (paramObj.name = this.nameMobileValue) : "";
      getRoleList(paramObj).then(res => {
        console.log(res)
        this.listTotal = res.data.total;
        const tableList = res.data.rows;
        tableList.forEach(tableItem => {
          const { id, name } = tableItem;
          const orderItem = {
            id: id,
            name: name
          };
          searchList.push(orderItem);
        });
        this.list = searchList;
      });
      setTimeout(() => {
        this.listLoading = false;
      }, 1000);
    },
    // 搜索
    handleSearchMobile() {
      if (!this.mobileSearchShow) {
        this.mobileSearchShow = !this.mobileSearchShow;
      }
    },
    // 取消搜索
    handleSearchMobileCancel() {
      if (this.mobileSearchShow) {
        this.mobileSearchShow = !this.mobileSearchShow;
      }
    },
    // 确认搜索
    handleMobileSearch() {
      this.mobileSearchButtonLoading = true;
      this.getMobileList();
      this.mobileSearchButtonLoading = false;
      this.mobileSearchShow = false;
    },
    // 清空所选
    handleSearchMobileClearAll() {
      this.nameMobileValue = "";
    },
    // 分页器改变
    handlePageChange() {
      this.getMobileList();
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
.cursor-pointer {
  cursor: pointer;
}

.table-input {
  width: 140px;
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
  position: fixed;
  bottom: 0px;
  padding: 10px;
  width: 100%;
  box-shadow: 0 0 10px #e5e5e5;
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
