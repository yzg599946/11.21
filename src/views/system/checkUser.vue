<template>
  <div class="app-container">
    <!-- PC端 搜索 -->
    <div ref="filterBox" v-if="device!='mobile'" class="filter-container">
      <el-date-picker
        v-model="timeSelectValue"
        type="datetimerange"
        value-format="yyyy-MM-dd"
        :picker-options="pickerOptions"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        align="right"
        size="mini"
      ></el-date-picker>
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
        icon="el-icon-edit"
        @click="handleEditIp"
      >修改客服登陆ip</el-button>
    </div>
    <!-- 移动端 搜索 -->
    <div v-else class="filter-mobile">
      <van-button type="info" size="small" @click="handleSearchMobile">搜索</van-button>
    </div>
    <!-- 列表 -->
    <el-table
      v-loading="listLoading"
      @cell-click="handleCheckUser"
      size="mini"
      border
      fit
      :data="list"
      :max-height="tableMaxHeight"
      style="width: 100%;"
    >
      <el-table-column type="index" width="50" align="center"></el-table-column>
      <el-table-column label="用户名" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="登陆状态" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <span
            :style="scope.row.loginStatus == '0' ? 'color:red;cursor:pointer;':'cursor:pointer;'"
          >{{ scope.row.loginStatus == '0' ? '未确认':'已确认' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="确认人" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.Confirmor }}</span>
        </template>
      </el-table-column>
      <el-table-column label="申请时间" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.applicationTime }}</span>
        </template>
      </el-table-column>
    </el-table>
    <!-- 修改ip窗口 -->
    <el-dialog title="修改客服ip" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="ip地址" :label-width="formLabelWidth">
          <el-input v-model="form.ip" autocomplete="off" size="mini"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleEditIpConfirm">确 定</el-button>
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
          </van-cell-group>
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
import { getCheckLoginList, checkLogin } from "@/api/orderList";
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
  name: "system-checkUser",
  directives: { permission },
  data() {
    return {
      list: [],
      pickerOptions: {
        shortcuts: [
          {
            text: "上月",
            onClick(picker) {
              const start = new Date(
                new Date().getFullYear(),
                new Date().getMonth() - 1,
                1
              );
              const end = new Date(
                new Date().getFullYear(),
                new Date().getMonth() - 1,
                new Date(
                  new Date().getFullYear(),
                  new Date().getMonth(),
                  0
                ).getDate()
              );
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      formLabelWidth: "120px",
      dialogTableVisible: false,
      currentPage: 1, //当前页
      mobileCurrentPage: 1,
      pagesizes: [20, 40, 60, 80, 100], //单页最大显示条数
      pagesize: 20, //单页内条数
      listTotal: 0,
      device: "",
      mobileSearchShow: false,
      mobileSearchButtonLoading: false,
      timeSelectValue: "",
      tableMaxHeight: 0,
      listLoading: false,
      timePickerStartValue: "请选择",
      timePickerEndValue: "请选择",
      mobileDatePickerShow: false,
      datetimePickerType: "",
      minDate: new Date(1950, 10, 1),
      maxDate: new Date(),
      currentDate: new Date(),
      minDateEnd: new Date(),
      maxDateStart: new Date(),
      searchButtonLoading: false,
      pageJumpIndex: 1,
      dialogFormVisible: false,
      form: {
        ip: ""
      }
    };
  },
  created() {
    this.getList();
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
    // 获取数据
    getList() {
      this.listLoading = true;
      let searchList = [];
      if (this.timeSelectValue == null) {
        this.timeSelectValue = ["", ""];
      } else {
        this.timeSelectValue == "" ? this.timeSelectValue : ["", ""];
      }
      let paramsObj = {
        contains: false,
        rows: this.pagesize,
        page: this.currentPage
      };
      this.timeSelectValue[0]
        ? (paramsObj.createTime = this.timeSelectValue[0])
        : "";
      this.timeSelectValue[1]
        ? (paramsObj.createTimeEnd = this.timeSelectValue[1])
        : "";
      getCheckLoginList(paramsObj).then(res => {
        this.listTotal = res.data.total;
        const tableList = res.data.rows;
        tableList.forEach(tableItem => {
          const { username, status, checkName, createTime, id } = tableItem;
          const searchItem = {
            username: username,
            loginStatus: status,
            Confirmor: checkName,
            applicationTime: createTime,
            id: id
          };
          searchList.push(searchItem);
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
    handleSizeChange(val) {
      this.pagesize = val;
      this.getList();
    },
    //选择表格当前页数
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getList();
    },
    //搜索
    handleSearch() {
      this.searchButtonLoading = true;
      this.getList();
      this.searchButtonLoading = false;
    },
    //确认登陆
    handleCheckUser(row, column, cell, event) {
      if (column.label === "登陆状态" && row.loginStatus === 0) {
        checkLogin({ id: row.id }).then(res => {
          if (res.status == 200) {
            this.$message({
              type: "success",
              message: "确认成功"
            });
            this.getList();
          } else {
            this.$message.error(res.msg);
          }
        });
      }
      if (this.device == "mobile") return;
      if (this.clickFlag) {
        clearTimeout(this.clickFlag);
        this.clickFlag = null;
      }
      this.clickFlag = setTimeout(() => {
        let count = 0;
        if (column.label == undefined) return;
        if (column.label == "登陆状态") {
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
    // 修改ip
    handleEditIp() {
      this.dialogFormVisible = true;
    },
    // 确认修改ip
    handleEditIpConfirm() {
      if (this.form.ip === "") {
        this.$message.error("请输入ip地址");
        return;
      } else {
        var reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
        if (!reg.test(this.form.ip)) {
          this.$message.error("请输入正确的ip地址");
        } else {
          editLoginIp({ ip: this.form.ip })
            .then(res => {
              if (res.status == 200) {
                this.$message({
                  type: "success",
                  message: "修改成功"
                });
                this.dialogFormVisible = false;
              } else {
                this.$message.error(res.msg || "修改失败");
                this.dialogFormVisible = false;
              }
            })
            .catch(error => {
              this.$message.error(error || "error");
              this.dialogFormVisible = false;
            });
        }
      }
    },

    /* 移动端事件 */

    //获取数据
    getMobileList() {
      this.listLoading = true;
      let searchList = [];
      let paramsObj = {
        contains: false,
        rows: this.pagesize,
        page: this.currentPage
      };
      let timeStartValue = "";
      let timeEndValue = "";
      this.timePickerStartValue == "请选择"
        ? (timeStartValue = "")
        : (timeStartValue = this.timePickerStartValue.replace(/\//g, "-"));
      this.timePickerEndValue == "请选择"
        ? (timeEndValue = "")
        : (timeEndValue = this.timePickerEndValue.replace(/\//g, "-"));
      timeStartValue ? (paramsObj.createTime = timeStartValue) : "";
      timeEndValue ? (paramsObj.createTimeEnd = timeEndValue) : "";

      getCheckLoginList(paramsObj).then(res => {
        this.listTotal = res.data.total;
        const tableList = res.data.rows;
        tableList.forEach(tableItem => {
          const { username, status, checkName, createTime } = tableItem;
          const searchItem = {
            username: username,
            loginStatus: status,
            Confirmor: checkName,
            applicationTime: createTime
          };
          searchList.push(searchItem);
        });
        this.list = searchList;
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
    //取消搜索
    handleSearchMobileCancel() {
      if (this.mobileSearchShow) {
        this.mobileSearchShow = false;
      }
    },
    // 选择开始日期
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
    datetimePickerChange(e) {},
    // 选择结束日期
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
    // 确认选择日期
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
    // 取消选择日期
    datetimePickerCancel() {
      this.mobileDatePickerShow = !this.mobileDatePickerShow;
    },
    //确认搜索
    handleMobileSearch() {
      this.getMobileList();
      this.mobileSearchShow = false;
    },
    //清空所选
    handleSearchMobileClearAll() {},
    //分页器改变
    handlePageChange() {
      this.getMobileList();
    },
    //返回列表
    handleDetailCancel() {
      this.mobileDetailShow = !this.mobileDetailShow;
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
