<template>
  <div class="app-container">
    <el-container>
      <el-aside width="200px">
        <el-tree :data="treeData" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
      </el-aside>
      <el-main>
        <!-- PC端 功能按钮 -->
        <div v-if="device=='desktop'" class="filter-container">
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
        <!-- 产品列表 -->
        <el-table
          size="mini"
          v-loading="listLoading"
          @cell-click="handleUseful"
          @selection-change="handleSelectionChange"
          fit
          border
          :max-height="tableMaxHeight"
          :data="list.slice((currentPage-1)*pagesize,currentPage*pagesize)"
          style="width: 100%;user-select:none;"
        >
          <el-table-column fixed type="selection" width="60" align="center"></el-table-column>
          <el-table-column type="index" width="50" align="center"></el-table-column>
          <el-table-column label="功能名称" :width="500" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column label="标识码" :width="500" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.code }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" :width="300" align="center">
            <template slot-scope="scope">
              <el-button @click="handleUpdateClick(scope.row)" type="text" size="small">更新</el-button>
              <el-button @click="handleDeleteClick(scope.row)" type="text" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 新增权限 -->
        <el-dialog title="新增权限" :visible.sync="addDialogVisible">
          <el-form :model="addForm">
            <el-form-item label="是否关联菜单" :label-width="formLabelWidth">
              <el-cascader
                size="mini"
                placeholder="请输入菜单名"
                :options="parentMenu"
                filterable
                clearable
                :props="props"
                :change-on-select="true"
                :show-all-levels="false"
                @change="handleSelectMenuChange"
              ></el-cascader>
            </el-form-item>
            <el-form-item label="功能名称" :label-width="formLabelWidth">
              <el-input
                v-model="addForm.name"
                clearable
                placeholder="请输入功能名称"
                class="normal-edit"
                size="mini"
              ></el-input>
            </el-form-item>
            <el-form-item label="功能" :label-width="formLabelWidth">
              <el-input
                v-model="addForm.func"
                clearable
                placeholder="请输入功能"
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
        <!-- 更新权限 -->
        <el-dialog title="更新权限" :visible.sync="updateDialogVisible">
          <el-form :model="updateForm">
            <el-form-item label="是否关联菜单" :label-width="formLabelWidth">
              <el-cascader
                size="mini"
                placeholder="请输入菜单名"
                :options="parentMenu"
                filterable
                clearable
                :props="props"
                :change-on-select="true"
                :show-all-levels="false"
                @change="handleSelectMenuChange"
              ></el-cascader>
            </el-form-item>
            <el-form-item label="功能名称" :label-width="formLabelWidth">
              <el-input
                v-model="updateForm.name"
                clearable
                placeholder="请输入功能名称"
                class="normal-edit"
                size="mini"
              ></el-input>
            </el-form-item>
            <el-form-item label="功能" :label-width="formLabelWidth">
              <el-input
                v-model="updateForm.func"
                clearable
                placeholder="请输入功能"
                class="normal-edit"
                size="mini"
              ></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="handleUpdateCancel">取 消</el-button>
            <el-button type="primary" @click="handleUpdateConfirm">确 定</el-button>
          </div>
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
      </el-main>
    </el-container>
  </div>
</template>

<script>
import Vue from "vue";
import { parseTime } from "@/utils";
import { setTimeout, clearTimeout } from "timers";
import { Pagination } from "vant";
import {
  getMenuTree,
  getFunctionList,
  addFunction,
  updateFunction,
  deleteFunction,
  deleteSelectFunction
} from "@/api/orderList";

Vue.use(Pagination);

export default {
  name:'system-function',
  data() {
    return {
      list: [],
      formLabelWidth: "120px",
      SearchButtonLoading: false,
      clearSearchButtonLoading: false,
      importProdcutLoading: false,
      listLoading: false,
      addDialogVisible: false,
      updateDialogVisible: false,
      currentPage: 1, //当前页
      pagesizes: [20, 40, 60, 80, 100], //单页最大显示条数
      pagesize: 20, //单页内条数
      clickFlag: null, // 单击定时器
      mobileSearchShow: false,
      mobileSearchButtonLoading: false,
      tableMaxHeight: 0,
      pageJumpIndex: 1,
      nameInput: "",
      treeData: [],
      defaultProps: {
        children: "children",
        label: "text"
      },
      props: {
        emitPath: false,
        checkStrictly: true,
        label: "text",
        value: "functionId"
      },
      currentId: 0,
      addForm: {
        name: "",
        func: ""
      },
      updateForm: {
        name: "",
        func: ""
      },
      parentMenu: [],
      menuId: "",
      multipleSelection:[]
    };
  },
  created() {
    this.getTreeData();
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
    // 获取树状图数据
    getTreeData() {
      getMenuTree().then(res => {
        if ((res.status = 200)) {
          console.log(res.data);
          this.treeData = res.data;
        }
      });
    },
    // 获取表格列表
    getOrderList() {
      let orderList = [];
      this.listLoading = true;
      getFunctionList({ page: 1, rows: 50 }, "?id=0").then(res => {
        let tableList = res.data.rows;
        tableList.forEach(tableItem => {
          const { name, code, id, parentId } = tableItem;
          const orderItem = {
            name: name,
            code: code,
            id: id,
            parentId: parentId
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
        if (column.label == "操作") {
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
    // 新增
    handleAdd() {
      this.addDialogVisible = true;
      getMenuTree().then(res => {
        this.parentMenu = res.data;
      });
    },
    // 验证新增
    addVerify() {
      if (this.addForm.name == "") {
        this.$message.error("请输入功能名称");
        return false;
      }
      if (this.addForm.func == "") {
        this.$message.error("请输入功能");
        return false;
      }
      return true;
    },
    // 取消新增
    handleAddCancel() {
      this.addDialogVisible = false;
    },
    // 确认新增
    handleAddConfirm() {
      if (!this.addVerify()) return;
      var timestamp = new Date().getTime();
      let paramsObj = {
        parentId: this.currentId,
        name: this.addForm.name,
        code: this.addForm.func,
        menuId: this.menuId
      };
      addFunction(paramsObj).then(res => {
        if (res.status == 200) {
          this.$message({
            type: "success",
            message: "新增权限成功"
          });
        }
      });

      this.addDialogVisible = false;
    },
    // 关联菜单改变
    handleSelectMenuChange(e) {
      this.menuId = e;
    },
    // 更新
    handleUpdateClick(row) {
      this.updateDialogVisible = true;
      getMenuTree().then(res => {
        this.parentMenu = res.data;
        this.updateForm.name = row.name;
        this.updateForm.func = row.code;
        this.currentId = row.id;
      });
    },
    // 取消更新
    handleUpdateCancel() {
      this.updateDialogVisible = false;
    },
    // 验证更新
    updateVerify() {
      console.log(this.updateForm.name);
      if (this.updateForm.name == "") {
        this.$message.error("请输入功能名称");
        return false;
      }
      if (this.updateForm.func == "") {
        this.$message.error("请输入功能");
        return false;
      }
      return true;
    },
    // 确认更新
    handleUpdateConfirm(row) {
      if (!this.updateVerify()) return;
      let paramsObj = {
        id: this.currentId,
        name: this.updateForm.name,
        code: this.updateForm.func
      };
      updateFunction(paramsObj).then(res => {
        if (res.status == 200) {
          this.$message({
            message: "更新成功",
            type: "succes"
          });
        }
      });
      this.updateDialogVisible = false;
    },
    // 删除
    handleDeleteClick(row) {
      let id = row.id;
      this.$confirm("此操作将永久删除该权限, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.listLoading = true;
          deleteFunction({ id: row.id }).then(res => {
            if (res.status === 200) {
              this.reloadPage();
              this.$message({
                type: "success",
                message: "删除权限成功"
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
       this.$confirm("此操作将永久删除该权限, 是否继续?", "提示", {
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
          deleteSelectFunction({ ids: idsStr }).then(res => {
            if (res.status === 200) {
              this.reloadPage();
              this.$message({
                type: "success",
                message: "批量删除权限成功"
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
    // 树形图节点点击事件
    handleNodeClick(e) {
      this.currentId = e.functionId;
      let id = `?id=${e.id}`;
      let orderList = [];
      this.listLoading = true;
      getFunctionList({ page: 1, rows: 50 }, id).then(res => {
        let tableList = res.data.rows;
        tableList.forEach(tableItem => {
          const { name, code, id, parentId } = tableItem;
          const orderItem = {
            name: name,
            code: code,
            id: id,
            parentId: parentId
          };
          orderList.push(orderItem);
        });
      });
      this.listLoading = false;
      this.list = orderList;
    },
    // 选择发生改变
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 重载页面
    reloadPage() {},

    /* 移动端事件 */

    //分页器
    handlePageChange() {
      this.listLoading = true;
      setTimeout(() => {
        this.listLoading = false;
      }, 600);
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
