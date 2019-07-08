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
      ref="channelTable"
      size="mini"
      border
      fit
      :max-height="tableMaxHeight"
      :data="list.slice((currentPage-1)*pagesize,currentPage*pagesize)"
      style="width: 100%;"
      @row-dblclick="handleChildrenDetail"
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
      <el-table-column label="名称" :width="device=='desktop'?'500':'170'" align="center">
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
    <!-- 更新渠道 -->
    <el-dialog title="更新渠道" :visible.sync="UpdateDialogVisible">
      <el-form :model="updateForm">
        <el-form-item label="id" :label-width="formLabelWidth">
          <el-input v-model="updateForm.id" clearable placeholder="请输入ID" class="normal-edit"></el-input>
        </el-form-item>
        <el-form-item label="名称" :label-width="formLabelWidth">
          <el-select v-model="updateForm.name" clearable filterable placeholder="请选择渠道">
            <el-option
              v-for="item in channelOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleUpdateCancel">取 消</el-button>
        <el-button type="primary" @click="handleUpdateConfirm">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 新增渠道 -->
    <el-dialog title="新增渠道" :visible.sync="editDialogVisible">
      <el-form :model="form">
        <el-form-item label="所属渠道" :label-width="formLabelWidth">
          <el-select v-model="form.parentChannel" clearable filterable placeholder="请选择所属渠道">
            <el-option
              v-for="item in channelOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="渠道名" :label-width="formLabelWidth">
          <el-input v-model="form.channelName" clearable placeholder="请输入渠道名" class="normal-edit"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleEditCancel">取 消</el-button>
        <el-button type="primary" @click="handleEditConfirm">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 查看子渠道 -->
    <el-dialog
      v-loading="childrenListLoading"
      :title="childrenChannelTitle"
      :visible.sync="dialogTableVisible"
    >
      <el-table
        :max-height="tableMaxHeight-100"
        size="mini"
        border
        fit
        :data="childrenChannelList.slice((childrenCurrentPage-1)*childrenPagesize,childrenCurrentPage*childrenPagesize)"
      >
        <el-table-column property="id" label="ID" width="400"></el-table-column>
        <el-table-column property="name" label="名称" width="400"></el-table-column>
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
      <el-pagination
        v-if="device!='mobile'"
        @size-change="handleChildrenSizeChange"
        @current-change="handleChildrenCurrentChange"
        :current-page="childrenCurrentPage"
        :page-sizes="childrenPagesizes"
        :page-size="childrenPagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="childrenChannelList.length"
        class="pagination"
      ></el-pagination>
    </el-dialog>
    <!-- 删除渠道 -->
    <el-dialog title="提示" :visible.sync="deleteDialogVisible">
      <span>是否删除{{deleteName}}?</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleDeleteCancel">取 消</el-button>
        <el-button type="primary" @click="handleDeleteConfirm">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 批量删除渠道 -->
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
  getAllChannelList,
  getChannelList,
  addChannel,
  updateChannel,
  deleteChannel,
  deleteSelectChannel
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
      nameInput: "",
      formLabelWidth: "120px",
      dialogTableVisible: false,
      currentPage: 1, //当前页
      pagesizes: [50, 100, 200], //单页最大显示条数
      pagesize: 50, //单页内条数
      device: "",
      mobileSearchShow: false,
      mobileSearchButtonLoading: false,
      listLoading: false,
      channelOptions: [],
      editDialogVisible: false,
      dialogTableVisible: false,
      UpdateDialogVisible: false,
      deleteDialogVisible: false,
      deleteSelectDialogVisible: false,
      form: {
        parentChannel: "",
        channelName: ""
      },
      childrenChannelTitle: "",
      childrenChannelList: [],
      childrenCurrentPage: 1, //当前页
      childrenPagesizes: [100, 200, 500, 1000], //单页最大显示条数
      childrenPagesize: 100, //单页内条数
      childrenListLoading: false,
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
    this.getOrderList();
    this.device = this.$store.state.app.device;
    this.getChannel();
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
    // 获取表格列表
    getOrderList() {
      let orderList = [];
      this.listLoading = true;
      getAllChannelList({
        contains: false,
        page: this.currentPage,
        rows: this.pagesize
      }).then(res => {
        let tableList = res.data.rows;
        tableList.forEach(tableItem => {
          const { id, name } = tableItem;
          const orderItem = {
            id: id,
            name: name
          };
          orderList.push(orderItem);
        });
      });
      setTimeout(() => {
        this.list = orderList;
        this.listLoading = false;
      }, 500);
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
        });
      });
    },
    // 表格高度自适应
    getHeight() {
      let otherHeight = this.device == "desktop" ? 250 : 200;
      this.tableMaxHeight = window.innerHeight - otherHeight;
    },
    // 选择表格尺寸
    handleSizeChange(val) {
      this.pagesize = val;
      this.getOrderList();
    },
    //选择表格当前页数
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getOrderList();
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
      this.$refs.channelTable.toggleRowSelection(rows);
    },
    // 选择改变
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 双击查看
    handleChildrenDetail(row, column, event) {
      if (this.childrenList == true) return;
      let orderList = [];
      const { id, name } = row;
      this.childrenChannelTitle = `${name}子渠道`;
      getAllChannelList({
        parentId: id,
        contains: false,
        page: this.childrenCurrentPage,
        rows: this.childrenPagesize
      })
        .then(res => {
          let tableList = res.data.rows;
          tableList.forEach(tableitem => {
            const { id, name } = tableitem;
            const orderItem = { id: id, name: name };
            orderList.push(orderItem);
          });
        })
        .catch(error => {
          console.log(error);
        });

      this.childrenChannelList = orderList;
      this.dialogTableVisible = true;
    },
    // 选择子渠道表格尺寸
    handleChildrenSizeChange(val) {
      this.childrenListLoading = true;
      setTimeout(() => {
        this.childrenPagesize = val;
        this.childrenListLoading = false;
      }, 500);
    },
    // 选择子渠道表格当前页数
    handleChildrenCurrentChange(val) {
      this.childrenListLoading = true;
      setTimeout(() => {
        this.childrenCurrentPage = val;
        this.childrenListLoading = false;
      }, 500);
    },
    // 搜索
    handleSearch() {
      let orderList = [];
      const name = this.nameInput;
      if (name == "") {
        this.$message.error("请输入渠道名称");
        return;
      }
      this.listLoading = true;
      this.paramsStorage = {
        name: name,
        contains: false,
        page: this.currentPage,
        rows: this.pagesize
      };
      getAllChannelList({
        name: name,
        contains: false,
        page: 1,
        rows: 50
      })
        .then(res => {
          let tableList = res.data.rows;
          tableList.forEach(tableItem => {
            const { id, name } = tableItem;
            const orderItem = { id: id, name: name };
            orderList.push(orderItem);
          });
        })
        .catch(error => {
          console.log(error);
        });
      this.listLoading = false;
      this.list = orderList;
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
      const { channelName, parentChannel } = this.form;
      if (parentChannel == null || parentChannel == "") {
        this.$message.error("请选择所属渠道");
        return false;
      }
      if (channelName == "") {
        this.$message.error("请填写渠道名");
        return false;
      }
      return true;
    },
    // 确认新增
    handleEditConfirm() {
      if (!this.addChannelVerify()) return;
      const { channelName, parentChannel } = this.form;
      addChannel({ parentId: parentChannel, name: channelName })
        .then(res => {
          if (res.status == 200) {
            this.reloadPage();
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
      const { id, name } = this.updateForm;
      if (name == null || name == "") {
        this.$message.error("请选择渠道");
        return false;
      }
      if (id == "") {
        this.$message.error("请输入ID");
        return false;
      }
      return true;
    },
    // 确认更新
    handleUpdateConfirm() {
      if (!this.updateVerify()) return;
      const { id, name } = this.updateForm;
      updateChannel({ id: id, parentId: "", name: name })
        .then(res => {
          if (res.status == 200) {
            this.reloadPage();
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
      deleteChannel({ id: this.deleteId }).then(res => {
        if (res.status == 200) {
          this.$message({
            message: "删除成功",
            type: "success"
          }),
            this.reloadPage();
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
        this.$message.error("未选择任何渠道");
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
      deleteSelectChannel({ ids: this.idsStr }).then(res => {
        if (res.status == 200) {
          this.$message({
            message: "删除成功",
            type: "success"
          }),
            this.reloadPage();
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
    // 重载页面
    reloadPage() {
      if (JSON.stringify(this.paramsStorage) == "{}") {
        this.getOrderList();
      } else {
        let searchList = [];
        getAllColorList(this.paramsStorage).then(res => {
          const tableData = res.data.rows;
          tableData.forEach(tableItem => {
            const { id, name } = tableItem;
            const orderItem = {
              id: id,
              name: name
            };
            searchList.push(orderItem);
          });
          this.list = searchList;
        });
      }
    },

    /* 移动端事件 */

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
      let orderList = [];
      const name = this.nameMobileValue;
      if (name == "") {
        this.$message.error("请输入渠道名称");
        this.mobileSearchShow = false;
        return;
      }
      this.listLoading = true;
      getAllChannelList({
        name: name,
        contains: false,
        page: 1,
        rows: 50
      })
        .then(res => {
          let tableList = res.data.rows;
          tableList.forEach(tableItem => {
            const { id, name } = tableItem;
            const orderItem = { id: id, name: name };
            orderList.push(orderItem);
          });
        })
        .catch(error => {
          console.log(error);
        });
      this.listLoading = false;
      this.mobileSearchShow = false;
      this.list = orderList;
    },
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
