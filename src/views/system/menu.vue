<template>
  <div class="app-container" v-if="device=='desktop'">
    <!-- PC端 功能按钮 -->
    <div v-if="device=='desktop'" class="filter-container">
      <el-input size="mini" class="table-input" placeholder="名称" v-model="nameInput" clearable></el-input>
      <el-input size="mini" class="table-input" placeholder="链接" v-model="linkInput" clearable></el-input>
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
        v-permission="['system-menu-list-insert']"
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
      <el-button
        size="mini"
        class="filter-item"
        type="primary"
        icon="el-icon-folder-add"
        @click="handleGenerate"
      >一键生成</el-button>
      <el-button
        v-if="returnButton"
        size="mini"
        class="filter-item"
        type="primary"
        icon="el-icon-back"
        @click="handleReturnList"
      >返回</el-button>
    </div>
    <!-- 移动端 功能按钮 -->
    <div v-else class="filter-mobile">
      <van-button type="info" size="small" @click="handleSearchMobile">搜索</van-button>
    </div>
    <!-- 列表 -->
    <el-table
      v-loading="listLoading"
      size="mini"
      border
      fit
      :data="list"
      :max-height="tableMaxHeight"
      @cell-click="handleUseful"
      @row-dblclick="handleChildrenMenu"
      @selection-change="handleSelectionChange"
      style="width: 100%;"
    >
      <el-table-column type="index" width="50" align="center"></el-table-column>
      <el-table-column fixed type="selection" width="60" align="center"></el-table-column>
      <el-table-column label="名称" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="链接地址" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.linkAddress }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否可用" align="center">
        <template slot-scope="scope">
          <span :style="scope.row.isUseful==1?'':'color:red'">{{ scope.row.isUseful==1?'可用':'不可用' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="排序" align="center">
        <template slot-scope="scope">
          <el-button @click="handleMoveUpClick(scope.row)" type="primary" size="mini" plain>上移</el-button>
          <el-button @click="handleMoveDownClick(scope.row)" type="primary" size="mini" plain>下移</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            v-permission="['system-menu-list-update']"
            @click="handleUpdateClick(scope.row)"
            type="primary"
            size="mini"
            plain
          >更新</el-button>
          <el-button
            v-permission="['system-menu-list-delete']"
            @click="handleDeleteClick(scope.row)"
            type="primary"
            size="mini"
            plain
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 新增菜单 -->
    <el-dialog title="新增菜单" :visible.sync="addDialogVisible">
      <el-form :model="addForm" size="mini">
        <el-form-item label="所属菜单" :label-width="formLabelWidth">
          <el-select
            size="mini"
            v-model="addForm.parentMenu"
            clearable
            filterable
            placeholder="所属菜单"
          >
            <el-option
              v-for="item in parentMenu"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="子菜单名" :label-width="formLabelWidth">
          <el-input
            v-model="addForm.childrenName"
            clearable
            placeholder="请输入子菜单名"
            class="normal-edit"
            size="mini"
          ></el-input>
        </el-form-item>
        <el-form-item label="Url" :label-width="formLabelWidth">
          <el-input
            v-model="addForm.url"
            clearable
            placeholder="请输入Url"
            class="normal-edit"
            size="mini"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleAddCancel">取 消</el-button>
        <el-button type="primary" @click="handleAddConfirm">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 更新菜单 -->
    <el-dialog title="更新菜单" :visible.sync="updateDialogVisible">
      <el-form :model="updateForm" size="mini">
        <el-form-item label="所属菜单" :label-width="formLabelWidth">
          <el-select
            size="mini"
            v-model="updateForm.parentMenu"
            clearable
            filterable
            placeholder="所属菜单"
          >
            <el-option
              v-for="item in parentMenu"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="子菜单名" :label-width="formLabelWidth">
          <el-input
            v-model="updateForm.childrenName"
            clearable
            placeholder="请输入子菜单名"
            class="normal-edit"
            size="mini"
          ></el-input>
        </el-form-item>
        <el-form-item label="Url" :label-width="formLabelWidth">
          <el-input
            v-model="updateForm.url"
            clearable
            placeholder="请输入Url"
            class="normal-edit"
            size="mini"
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
    <!-- 一键生成 -->
    <el-dialog title="一键生成" :visible.sync="generateDialogVisible">
      <el-form :model="generateForm" size="mini">
        <el-form-item label="菜单中文名" :label-width="formLabelWidth">
          <el-input
            v-model="generateForm.chineseName"
            clearable
            placeholder="请输入中文名"
            class="normal-edit"
            size="mini"
          ></el-input>
        </el-form-item>
        <el-form-item label="菜单英文名" :label-width="formLabelWidth">
          <el-input
            v-model="generateForm.englishName"
            clearable
            placeholder="请输入英文名"
            class="normal-edit"
            size="mini"
          ></el-input>
        </el-form-item>
      </el-form>
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
      :total="listTotal"
      class="pagination"
    ></el-pagination>
    <!-- 移动端 分页器 -->
    <div v-else class="mobile-pagination">
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
  <div v-else class="app-container">
    <el-alert
      title="移动端无法访问"
      description="请在PC端再使用此功能"
      type="warning"
      effect="dark"
      show-icon
      :closable="false"
    ></el-alert>
  </div>
</template>

<script>
import Vue from "vue";
import permission from "@/directive/permission/index.js"; // 权限判断指令
import {
  getMenuList,
  updateMenuInquired,
  addMenu,
  updateMenu,
  deleteMenu,
  deleteSelectMenu,
  generateMenu,
  moveUpMenu,
  moveDownMenu
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
  name: "system-menu",
  directives: { permission },
  data() {
    return {
      list: [],
      childrenList: [],
      listLoading: false,
      clearSearchButtonLoading: false,
      addDialogVisible: false,
      updateDialogVisible: false,
      generateDialogVisible: false,
      nameInput: "",
      linkInput: "",
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
      searchButtonLoading: false,
      tableMaxHeight: 0,
      childrenListTitle: "",
      parentMenu: [],
      addForm: {
        parentMenu: "",
        childrenName: "",
        url: ""
      },
      updateForm: {
        parentMenu: "",
        childrenName: "",
        url: "",
        mode: ""
      },
      generateForm: {
        chineseName: "",
        englishName: ""
      },
      updateId: "",
      multipleSelection: [],
      returnButton: false,
      childrenMenuRow: {}
    };
  },
  created() {
    this.getList();
    this.device = this.$store.state.app.device;
    this.getHeight();
    // this.getParentMenuList();
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
      if (this.returnButton) {
        this.handleChildrenMenu(this.childrenMenuRow);
      } else {
        let name = this.nameInput;
        let uri = this.linkInput;
        let paramsObj = {
          contains: false,
          page: this.currentPage,
          rows: this.pagesize
        };
        name != "" ? (paramsObj.name = name) : "";
        uri != "" ? (paramsObj.uri = uri) : "";
        let orderList = [];
        let parentList = [];
        getMenuList(paramsObj).then(res => {
          this.listTotal = res.data.total;
          let tableList = res.data.rows;
          tableList.forEach(tableItem => {
            const { name, uri, mode, sort, id, parentId } = tableItem;
            const orderItem = {
              name: name,
              linkAddress: uri,
              isUseful: mode,
              sort: sort,
              id: id,
              parentId: parentId
            };
            const parentItem = {
              label: name,
              value: id
            };
            parentList.push(parentItem);
            orderList.push(orderItem);
          });
          this.list = orderList;
          this.parentMenu = parentList;
        });
      }
      this.listLoading = false;
    },
    // 获取所有一级菜单
    getParentMenuList() {
      let orderList = [];
      updateMenuInquired().then(res => {
        let tableList = res.data;
        tableList.forEach(tableItem => {
          const { name, id } = tableItem;
          const orderItem = {
            label: name,
            value: id
          };
          orderList.push(orderItem);
        });
      });
      this.parentMenu = orderList;
    },
    //表格高度自适应
    getHeight() {
      let otherHeight = this.device == "desktop" ? 316 : 200;
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
        if (column.label == "操作" || column.label == "排序") {
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
    // 表格条数变化
    handleSizeChange(val) {
      this.pagesize = val;
      this.getList();
    },
    //选择表格当前页数
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getList();
    },
    // 获取子菜单数据
    getChildrenList() {},
    // 查看子菜单
    handleChildrenMenu(row) {
      if (row.parentId != 0) return;
      this.childrenMenuRow = row;
      this.returnButton = true;
      this.currentPage = 1;
      this.pagesize = 50;
      this.childrenParamsOjb = {
        parentId: row.id,
        contains: false,
        page: this.currentPage,
        rows: this.pagesize
      };
      getMenuList(this.childrenParamsOjb).then(res => {
        let orderList = [];
        let tableList = res.data.rows;
        tableList.forEach(tableItem => {
          const { name, uri, mode, id, parentId, sort } = tableItem;
          const orderItem = {
            name: name,
            linkAddress: uri,
            isUseful: mode,
            id: id,
            parentId: parentId,
            sort: sort
          };
          orderList.push(orderItem);
        });
        this.list = orderList;
      });
    },
    // 返回主菜单列表
    handleReturnList() {
      this.returnButton = false;
      this.getList();
    },
    // 搜索
    handleSearch() {
      this.searchButtonLoading = true;
      this.getList();
      this.searchButtonLoading = false;
    },
    // 清空搜索项
    handleClearSearch() {
      this.nameInput = "";
      this.linkInput = "";
    },
    handleClick(row) {},
    // 新增
    handleAdd() {
      this.addDialogVisible = true;
    },
    // 验证新增
    addMenuVerify() {
      if (this.addForm.parentMenu == null) {
        this.$message.error("请选择所属菜单");
        return false;
      }
      if (this.addForm.childrenName == "") {
        this.$message.error("请输入子菜单名");
        return false;
      }
      if (this.addForm.url == "") {
        this.$message.error("请输入Url");
        return false;
      }
      return true;
    },
    // 确认新增
    handleAddConfirm() {
      if (this.addForm.parentMenu != "" && this.addForm.url == "") {
        this.$message.error("请输入Url");
        return;
      }
      if (this.addForm.url != "" && this.addForm.parentMenu == "") {
        this.$message.error("请选择所属菜单");
        return;
      }
      addMenu({
        name: this.addForm.childrenName,
        parentId: this.addForm.parentMenu,
        uri: this.addForm.url
      })
        .then(res => {
          if (res.status == 200) {
            this.getList();
            this.$message({
              type: "success",
              message: "新增成功"
            });
          }
        })
        .catch(error => {
        });
      this.addDialogVisible = false;
    },
    // 取消新增
    handleAddCancel() {
      this.addDialogVisible = false;
    },
    // 更新
    handleUpdateClick(row) {
      this.updateForm.mode = row.isUseful;
      this.updateForm.childrenName = row.name;
      this.updateForm.url = row.linkAddress;
      row.parentId == 0
        ? (this.updateForm.parentMenu = "")
        : (this.updateForm.parentMenu = row.parentId);
      this.updateId = row.id;
      this.updateDialogVisible = true;
    },
    // 验证更新
    updateMenuVerify() {
      if (this.updateForm.childrenName == "" && this.updateForm.url != "") {
        this.$message.error("请输入子菜单名");
        return false;
      }
      if (this.updateForm.url == "" && this.updateForm.childrenName != "") {
        this.$message.error("请输入Url");
        return false;
      }
      return true;
    },
    // 确认更新
    handleUpdateConfirm() {
      if (!this.updateMenuVerify) return;
      updateMenu({
        id: this.updateId,
        parentId: this.updateForm.parentMenu,
        name: this.updateForm.childrenName,
        uri: this.updateForm.url,
        mode: this.updateForm.mode
      })
        .then(res => {
          if (res.status == 200) {
            this.getList();
            this.$message({
              type: "success",
              message: "更新成功"
            });
          }
        })
        .catch(error => {
        });
      this.updateDialogVisible = false;
    },
    // 取消更新
    handleUpdateCancel() {
      this.updateDialogVisible = false;
    },
    // 删除
    handleDeleteClick(row) {
      this.$confirm("此操作将永久删除该菜单, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.listLoading = true;
          deleteMenu({ id: row.id }).then(res => {
            if (res.status === 200) {
              this.getList();
              this.$message({
                type: "success",
                message: "删除菜单成功"
              });
              this.dialogTableVisible = false;
            } else {
              this.$message.error("删除失败");
              this.dialogTableVisible = false;
            }
          });
          this.listLoading = false;
        })
        .catch(error => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
          this.dialogTableVisible = false;
        });
    },
    // 批量删除
    handleDeleteSelect() {
      this.$confirm("此操作将永久删除该菜单, 是否继续?", "提示", {
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
          deleteSelectMenu({ ids: idsStr }).then(res => {
            if (res.status === 200) {
              this.getList();
              this.$message({
                type: "success",
                message: "批量删除菜单成功"
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
    // 一键生成
    handleGenerate() {
      this.generateDialogVisible = true;
    },
    // 验证生成
    generateVerify() {
      if (this.generateForm.chineseName == "") {
        this.$message.error("请输入中文名");
        return false;
      }
      if (this.generateForm.englishName == "") {
        this.$message.error("请输入英文名");
        return false;
      }
      return true;
    },
    // 确认生成
    handleGenerateConfirm() {
      if (!this.generateVerify()) return;
      generateMenu({
        chinese: this.generateForm.chineseName,
        english: this.generateForm.englishName
      }).then(res => {
      });
    },
    // 取消生成
    handleGenerateCancel() {},
    // 菜单上移
    handleMoveUpClick(row) {
      var timestamp = new Date().getTime();
      moveUpMenu({
        sort: row.sort,
        parentId: row.parentId,
        id: row.id,
        _: timestamp
      }).then(res => {
        if (res.status == 200) {
          this.getList();
          this.$message({
            type: "success",
            message: "操作成功"
          });
        }
      });
    },
    // 菜单下移
    handleMoveDownClick(row) {
      var timestamp = new Date().getTime();
      moveDownMenu({
        sort: row.sort,
        parentId: row.parentId,
        id: row.id,
        _: timestamp
      }).then(res => {
        if (res.status == 200) {
          this.getList();
          this.$message({
            type: "success",
            message: "操作成功"
          });
        }
      });
    },
    // 选择发生改变
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    /* 移动端事件 */

    // 新增
    handleSearchMobile() {},
    // 取消新增
    handleAddMobileCancel() {},
    // 确认新增
    handleMobileAdd() {},
    // 清空所选
    handleSearchMobileClearAll() {},
    // 分页器改变
    handlePageChange() {},
    // 返回列表
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
  width: 130px;
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
