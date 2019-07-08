<template>
  <div class="app-container">
    <!-- PC端 功能按钮 -->
    <div v-if="device=='desktop'" class="filter-container">
      <el-input size="mini" class="table-input" placeholder="用户名" v-model="usernameInput" clearable></el-input>
      <el-select size="mini" v-model="usefulValue" clearable filterable placeholder="是否可用">
        <el-option
          v-for="item in usefulOptions"
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
        @click="handleSearch"
      >搜索</el-button>
      <el-button
        v-permission="['system-user-list-insert']"
        size="mini"
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleAdd"
      >新增</el-button>
      <el-button
        size="mini"
        class="filter-item"
        type="primary"
        icon="el-icon-search"
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
      show-summary
      @selection-change="handleSelectionChange"
      :max-height="tableMaxHeight"
      :data="list.slice((currentPage-1)*pagesize,currentPage*pagesize)"
      style="width: 100%;"
    >
      <el-table-column v-if="device=='desktop'" fixed type="selection" width="60" align="center"></el-table-column>
      <el-table-column label="id" :width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户名" :width="200" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="姓名" :width="200" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="手机号码" :width="200" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.phoneNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否可用" :width="200" align="center">
        <template slot-scope="scope">
          <span :style="scope.row.isUseful==1?'':'color:red'">{{ scope.row.isUseful==1?'可用':'不可用' }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="device=='desktop'&& checkPermission(['system-user-list-update','system-user-list-delete'])"
        label="操作"
        :width="device=='desktop'?'500':'100'"
        align="center"
      >
        <template slot-scope="scope">
          <el-button v-permission="['system-user-list-update']" @click="handleUpdata(scope.row)" type="text" size="small">更新</el-button>
          <el-button v-permission="['system-user-list-delete']" @click="handleDelete(scope.row)" type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 新增用户窗口 -->
    <el-dialog title="新增用户" :visible.sync="addDialogVisible">
      <el-form :model="form">
        <el-form-item label="关联角色" :label-width="formLabelWidth">
          <template>
            <el-checkbox
              :indeterminate="isIndeterminate"
              v-model="checkAll"
              @change="handleCheckAllChange"
            >全选</el-checkbox>
            <el-checkbox-group v-model="form.checkList" @change="handleCheckedCitiesChange">
              <el-checkbox
                size="mini"
                v-for="permissionItem in permissionList"
                :label="permissionItem.id"
                :key="permissionItem.id"
              >{{permissionItem.name}}</el-checkbox>
            </el-checkbox-group>
          </template>
        </el-form-item>
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input v-model="form.username" clearable placeholder="请输入用户名" class="normal-edit"></el-input>
        </el-form-item>
        <el-form-item label="姓名" :label-width="formLabelWidth">
          <el-input v-model="form.name" clearable placeholder="请输入姓名" class="normal-edit"></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth">
          <el-input
            v-model="form.password"
            clearable
            placeholder="请输入密码"
            class="normal-edit"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item label="手机号" :label-width="formLabelWidth">
          <el-input v-model="form.telephone" clearable placeholder="请输入手机号" class="normal-edit"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleAddCancel">取 消</el-button>
        <el-button type="primary" @click="handleAddConfirm">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 更新用户窗口 -->
    <el-dialog title="更新用户" :visible.sync="updateDialogVisible">
      <el-form :model="updateForm">
        <el-form-item label="关联角色" :label-width="formLabelWidth">
          <template>
            <el-checkbox-group v-model="updateForm.checkList" @change="handleUpdateCheckListChange">
              <el-checkbox
                size="mini"
                v-for="updatePermissionItem in updatePermissionList"
                :label="updatePermissionItem.id"
                :key="updatePermissionItem.id"
              >{{updatePermissionItem.name}}</el-checkbox>
            </el-checkbox-group>
          </template>
        </el-form-item>
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input
            v-model="updateForm.username"
            clearable
            placeholder="请输入用户名"
            class="normal-edit"
          ></el-input>
        </el-form-item>
        <el-form-item label="姓名" :label-width="formLabelWidth">
          <el-input v-model="updateForm.name" clearable placeholder="请输入姓名" class="normal-edit"></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth">
          <el-input
            v-model="updateForm.password"
            clearable
            placeholder="请输入密码"
            class="normal-edit"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item label="手机号" :label-width="formLabelWidth">
          <el-input
            v-model="updateForm.telephone"
            clearable
            placeholder="请输入手机号"
            class="normal-edit"
          ></el-input>
        </el-form-item>
        <el-form-item label="是否可用" :label-width="formLabelWidth">
          <template>
            <el-radio-group v-model="updateForm.mode">
              <el-radio :label="1">可用</el-radio>
              <el-radio :label="0">不可用</el-radio>
            </el-radio-group>
          </template>
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
      <van-pagination
        v-model="currentPage"
        :total-items="list.length"
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
            @click-left="handleAddMobileCancel"
            @click-right="handleSearchMobileClearAll"
          />
          <div class="mobile-search">
            <van-button
              type="info"
              :loading="mobileSearchButtonLoading"
              :disabled="mobileSearchButtonLoading"
              size="large"
              @click="handleMobileAdd"
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
import checkPermission from '@/utils/permission' // 权限判断函数
import {
  getUserList,
  deleteUser,
  deleteSelectUser,
  addUser,
  addUserInquire,
  updateUser,
  updateUserInquired
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
  name:'system-user',
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
      pagesizes: [100, 200, 500], //单页最大显示条数
      pagesize: 100, //单页内条数
      device: "",
      mobileSearchShow: false,
      mobileSearchButtonLoading: false,
      tableMaxHeight: 0,
      addDialogVisible: false,
      updateDialogVisible: false,
      form: {
        checkList: [],
        username: "",
        name: "",
        password: "",
        telephone: ""
      },
      updateForm: {
        checkList: [],
        username: "",
        name: "",
        password: "",
        telephone: "",
        mode: ""
      },
      permissionList: [],
      updatePermissionList: [],
      paramsStorage: {},
      listLoading: false,
      multipleSelection: [],
      updateId: "",
      checkAll: false,
      isIndeterminate: false
    };
  },
  created() {
    this.list = this.getOrderList();
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
    // 获取表格列表
    getOrderList() {
      let orderList = [];
      this.listLoading = true;
      getUserList({ page: 1, rows: 500 }).then(res => {
        const tableList = res.data.rows;
        tableList.forEach(tableItem => {
          const { id, username, name, telephone, mode } = tableItem;
          const orderItem = {
            id: id,
            username: username,
            name: name,
            phoneNumber: telephone,
            isUseful: mode
          };
          orderList.push(orderItem);
        });
      });
      this.listLoading = false;
      return orderList;
    },
    //表格高度自适应
    getHeight() {
      let otherHeight = this.device == "desktop" ? 250 : 200;
      this.tableMaxHeight = window.innerHeight - otherHeight;
    },
    // 页面条数切换
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
    // 选择改变
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 搜索
    handleSearch() {
      let searchList = [];
      this.listLoading = true;
      let name = this.usernameInput;
      let isUseful = this.usefulValue;
      let paramObj = {
        page: 1,
        rows: 500
      };
      name ? (paramObj.name = name) : "",
        isUseful ? (paramObj.mode = isUseful) : "";
      this.paramsStorage = paramObj;
      getUserList(paramObj).then(res => {
        const tableList = res.data.rows;
        tableList.forEach(tableItem => {
          const { id, username, name, telephone, mode } = tableItem;
          const orderItem = {
            id: id,
            username: username,
            name: name,
            phoneNumber: telephone,
            isUseful: mode
          };
          searchList.push(orderItem);
        });
      });
      this.listLoading = false;
      this.list = searchList;
    },
    // 新增
    handleAdd() {
      addUserInquire().then(res => {
        this.permissionList = res.data;
      });
      this.addDialogVisible = true;
    },
    handleUpdateCheckListChange(value) {},
    // 取消新增
    handleAddCancel() {
      this.addDialogVisible = false;
    },
    // 验证新增
    addVerify() {
      if (this.form.checkList.length === 0) {
        this.$message.error("请选择一项角色");
        return false;
      }
      if (this.form.username == "") {
        this.$message.error("请输入用户名");
        return false;
      }
      if (this.form.name == "") {
        this.$message.error("请输入姓名");
        return false;
      }
      if (this.form.password == "") {
        this.$message.error("请输入密码");
        return false;
      }
      if (this.form.telephone == "") {
        this.$message.error("请输入手机号");
        return false;
      }
      return true;
    },
    // 确认新增
    handleAddConfirm() {
      if (!this.addVerify()) return;
      this.listLoading = true;
      let username = this.form.username;
      let name = this.form.name;
      let password = this.form.password;
      let telephone = this.form.telephone;
      let functionId = this.form.checkList.join(",");
      addUser({
        functionId: functionId,
        username: username,
        name: name,
        password: password,
        telephone: telephone
      })
        .then(res => {
          if (res.status === 200) {
            this.reloadPage();
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
    // 全选
    handleCheckAllChange(val) {
      this.form.checkList = val ? [] : [];
      this.isIndeterminate = false;
    },
    handleCheckedCitiesChange(val) {
      let checkedCount = val.length;
      this.checkAll = checkedCount === this.form.checkList.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.form.checkList.length;
    },
    // 更新
    handleUpdata(rows) {
      updateUserInquired({ id: rows.id }).then(res => {
        console.log(res.data);
        this.updatePermissionList = res.data.roleList;
        this.updateForm.checkList = res.data.roles;
        this.updateForm.username = res.data.user.username;
        this.updateForm.name = res.data.user.name;
        this.updateForm.telephone = res.data.user.telephone;
        this.updateForm.password = res.data.user.password;
        this.updateForm.mode = res.data.user.mode;
        this.updateId = rows.id;
        this.updateDialogVisible = true;
      });
    },
    // 取消更新
    handleUpdateCancel() {
      this.updateDialogVisible = false;
    },
    // 验证更新
    updateVerify() {
      if (this.updateForm.checkList.length === 0) {
        this.$message.error("请选择一项角色");
        return false;
      }
      if (this.updateForm.username == "") {
        this.$message.error("请输入用户名");
        return false;
      }
      if (this.updateForm.name == "") {
        this.$message.error("请输入姓名");
        return false;
      }
      if (this.updateForm.password == "") {
        this.$message.error("请输入密码");
        return false;
      }
      if (this.updateForm.telephone == "") {
        this.$message.error("请输入手机号");
        return false;
      }
      return true;
    },
    // 确认更新
    handleUpdateConfirm() {
      if (!this.updateVerify()) {
        return;
      }
      this.listLoading = true;
      let id = this.updateId;
      let username = this.updateForm.username;
      let name = this.updateForm.name;
      let password = this.updateForm.password;
      let telephone = this.updateForm.telephone;
      let mode = this.updateForm.mode;
      let functionId = this.updateForm.checkList.join(",");
      updateUser({
        id: id,
        functionId: functionId,
        username: username,
        name: name,
        password: password,
        telephone: telephone,
        mode: mode
      })
        .then(res => {
          if (res.status === 200) {
            this.reloadPage();
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
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.listLoading = true;
          deleteUser({ id: rows.id }).then(res => {
            if (res.status === 200) {
              this.reloadPage();
              this.$message({
                type: "success",
                message: "删除用户成功"
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
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
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
          deleteSelectUser({ ids: idsStr }).then(res => {
            if (res.status === 200) {
              this.reloadPage();
              this.$message({
                type: "success",
                message: "批量删除用户成功"
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
    // 重载页面
    reloadPage() {
      if (JSON.stringify(this.paramsStorage) == "{}") {
        this.list = this.getOrderList();
      } else {
        let searchList = [];
        getUserList(this.paramsStorage).then(res => {
          const tableData = res.data.rows;
          tableData.forEach(tableItem => {
            const { id, username, name, telephone, mode } = tableItem;
            const orderItem = {
              id: id,
              username: username,
              name: name,
              phoneNumber: telephone,
              isUseful: mode
            };
            searchList.push(orderItem);
          });
          this.list = searchList;
        });
      }
    },

    /* 移动端事件 */
    //新增
    handleSearchMobile() {},
    //取消新增
    handleAddMobileCancel() {},
    //确认新增
    handleMobileAdd() {},
    //清空所选
    handleSearchMobileClearAll() {},
    //分页器改变
    handlePageChange() {},
    //返回列表
    handleDetailCancel() {
      this.mobileDetailShow = !this.mobileDetailShow;
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
  position: fixed;
  bottom: 0px;
  padding: 10px;
  width: 100%;
  box-shadow: 0 0 10px #e5e5e5;
}
</style>
