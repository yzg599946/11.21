<template>
  <div class="app-container">
    <!-- PC端 搜索 -->
    <div v-if="device!='mobile'" class="filter-container">
      <el-date-picker
        v-model="timeSelectValue"
        type="datetimerange"
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
        @click="handleSearch"
      >搜索</el-button>
    </div>
    <!-- 移动端 搜索 -->
    <div v-else class="filter-mobile">
      <van-button type="info" size="small" @click="handleSearchMobile">搜索</van-button>
    </div>
    <!-- 列表 -->
    <el-table size="mini" border fit :data="list" style="width: 100%;" @cell-click="handleTimeSlot">
      <el-table-column label="用户名" :width="device=='desktop'?'500':'100'" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="登陆状态"
        :width="device=='desktop'?'500':'100'"
        sortable="custom"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.loginStatus }}</span>
        </template>
      </el-table-column>
      <el-table-column label="确认人" :width="device=='desktop'?'500':'100'" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.Confirmor }}</span>
        </template>
      </el-table-column>
      <el-table-column label="申请时间" :width="device=='desktop'?'500':'100'" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.applicationTime }}</span>
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
            @click-left="handleSearchMobileCancel"
            @click-right="handleSearchMobileClearAll"
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
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      formLabelWidth: "120px",
      dialogTableVisible: false,
      currentPage: 1, //当前页
      pagesizes: [20, 40, 60, 80, 100], //单页最大显示条数
      pagesize: 20, //单页内条数
      device: "",
      mobileSearchShow: false,
      mobileSearchButtonLoading: false,
      timeSelectValue: ""
    };
  },
  created() {
    this.list = [
      {
        username: "49849",
        loginStatus: "4",
        confirmor: "58",
        applicationTime: "138"
      },
      {
        username: "49849",
        loginStatus: "4",
        confirmor: "58",
        applicationTime: "138"
      },
      {
        username: "49849",
        loginStatus: "4",
        confirmor: "58",
        applicationTime: "138"
      },
      {
        username: "49849",
        loginStatus: "4",
        confirmor: "58",
        applicationTime: "138"
      }
    ];
    this.listLoading = false;
    this.device = this.$store.state.app.device;
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
    handleTimeSlot(row, column, cell, event) {
      this.channelTitle = row.channel;
      if (this.device == "mobile") {
        if (column.label == undefined) {
          this.mobileDetailShow = true;
        }
      } else {
        if (column.label == undefined) {
          this.dialogTableVisible = true;
        } else {
        }
      }
    },
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
    //搜索
    handleSearch() {},

    /* 移动端事件 */
    //新增
    handleSearchMobile() {},
    //取消新增
    handleSearchMobileCancel() {},
    //确认新增
    handleMobileSearch() {},
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
