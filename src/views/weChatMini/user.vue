<template>
  <div class="app-container">
    <!-- PC端 功能按钮 -->
    <div v-if="device=='desktop'" class="filter-container">
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
      <el-input size="mini" class="table-input" placeholder="昵称" v-model="nameInput" clearable></el-input>
      <el-input
        size="mini"
        class="table-input"
        placeholder="电话"
        v-model="phoneNumberInput"
        clearable
      ></el-input>
      <el-select size="mini" clearable filterable v-model="miniprogramValue" placeholder="小程序">
        <el-option
          v-for="item in miniprogramOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-select size="mini" clearable filterable v-model="filterValue" placeholder="是否筛选">
        <el-option
          v-for="item in filterOptions"
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
        :loading="searchButtonLoading"
        @click="handleSearch"
      >搜索</el-button>
    </div>
    <!-- 移动端 功能按钮 -->
    <div v-else class="filter-mobile">
      <van-button type="info" size="small" @click="handleSearchMobile">搜索</van-button>
    </div>
    <!-- 产品列表 -->
    <el-table
      size="mini"
      v-loading="listLoading"
      @cell-click="handleUseful"
      @selection-change="handleSelectChange"
      fit
      border
      :max-height="tableMaxHeight"
      :data="list"
      style="width: 100%;user-select:none;"
    >
      <el-table-column :show-overflow-tooltip="true" label="ID" prop="id" align="center" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="昵称" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="手机号码" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.phoneNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="formId" width="200px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.formId }}</span>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="头像地址" width="250px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.avatarUrl }}</span>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="性别" width="120px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.gender }}</span>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="国家" width="120px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.country }}</span>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="省份" width="120px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.province }}</span>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="城市" width="120px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.city }}</span>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="语言" width="120px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.language }}</span>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="创建时间" width="200px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="到期时间" width="200px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.maturityTime }}</span>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="操作" width="120px" align="center">
        <template slot-scope="scope">
          <el-button @click="handleSendMessage(scope.row)" type="text" size="small">发送信息</el-button>
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
            <van-field
              clearable
              label="昵称"
              v-model="nameMobileValue"
              placeholder="请输入昵称"
              input-align="right"
              is-link
            />
            <van-field
              clearable
              label="电话"
              v-model="phoneMobileValue"
              placeholder="请输入电话"
              input-align="right"
              is-link
            />
            <van-cell
              @click="handleChooseMiniProgramMobile"
              title="小程序"
              is-link
              :value="miniProgramMobileValue"
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
      <!--小程序选择弹窗-->
      <van-popup v-model="mobileMiniProgramPickerShow" position="bottom">
        <van-picker
          show-toolbar
          :columns="MiniProgramColumns"
          @cancel="mobileMiniProgramPickerShow = false"
          @confirm="MiniProgramPickerConfirm"
        />
      </van-popup>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { getWechatUserList, sendWechatMessage } from "@/api/orderList";
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
  name: "weChatMini-user",
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
                new Date().getMonth(),
                1
              );
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      miniprogramOptions: [
        {
          value: "1",
          label: "劳斯宾"
        },
        {
          value: "2",
          label: "掌上淘货"
        },
        {
          value: "3",
          label: "一贝聚站"
        }
      ],
      MiniProgramColumns: ["劳斯宾", "掌上淘货", "一贝聚站"],
      filterOptions: [
        {
          value: "1",
          label: "筛选"
        }
      ],
      timeSelectValue: "",
      filterValue: "1",
      nameInput: "",
      phoneNumberInput: "",
      miniprogramValue: "",
      listLoading: false,
      currentPage: 1, //当前页
      mobileCurrentPage: 1,
      pagesizes: [100, 500, 2000], //单页最大显示条数
      pagesize: 100, //单页内条数
      listTotal: 0, //总数
      multipleSelection: [],
      clickFlag: null, // 单击定时器
      mobileSearchShow: false,
      mobileDatePickerShow: false,
      mobileMiniProgramPickerShow: false,
      minDate: new Date(1950, 10, 1),
      maxDate: new Date(),
      currentDate: new Date(),
      minDateEnd: new Date(),
      maxDateStart: new Date(),
      timePickerStartValue: "请选择",
      timePickerEndValue: "请选择",
      miniProgramMobileValue: "请选择",
      nameMobileValue: "",
      phoneMobileValue: "",
      device: "",
      datetimePickerType: "",
      mobileSearchButtonLoading: false,
      searchButtonLoading: false,
      tableMaxHeight: 0,
      pageJumpIndex: 1
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
      let paramsObj = {
        rows: this.pagesize,
        page: this.currentPage
      };
      this.timeSelectValue == "" ? this.timeSelectValue : ["", ""];
      this.timeSelectValue[0]
        ? (paramsObj.createTime = this.timeSelectValue[0])
        : "";
      this.timeSelectValue[1]
        ? (paramsObj.createTimeEnd = this.timeSelectValue[1])
        : "";
      this.nameInput ? (paramsObj.name = this.nameInput) : "";
      this.phoneNumberInput
        ? (paramsObj.telephone = this.phoneNumberInput)
        : "";
      this.miniprogramValue ? (paramsObj.state = this.miniprogramValue) : "";
      this.filterValue ? (paramsObj.isRepeat = this.filterValue) : "";
      getWechatUserList(paramsObj)
        .then(res => {
          this.listTotal = res.data.total;
          const tableData = res.data.rows;
          tableData.forEach(tableItem => {
            const {
              id,
              nickName,
              phone,
              formId,
              avatarUrl,
              gender,
              country,
              province,
              city,
              language,
              createTime,
              overTime
            } = tableItem;
            const orderItem = {
              id: id,
              name: nickName,
              phoneNumber: phone,
              formId: formId,
              avatarUrl: avatarUrl,
              gender: gender,
              country: country,
              province: province,
              city: city,
              language: language,
              createTime: createTime,
              maturityTime: overTime
            };
            searchList.push(orderItem);
          });
          this.list = searchList;
        })
        .catch(error => {
          console.log(error);
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
    //搜索
    handleSearch() {
      this.searchButtonLoading = true;
      this.getList();
      this.searchButtonLoading = false;
    },
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
    //选择发生改变
    handleSelectChange(selection) {
      this.multipleSelection = selection;
    },
    // 发送消息
    handleSendMessage(rows) {
      const id = rows.id;
      sendWechatMessage({ id: id }).then(res => {
        console.log(res);
      });
    },

    /* 移动端事件 */

    //获取数据
    getMobileList() {
      this.listLoading = true;
      let searchList = [];
      let miniProgramMobile = "";
      let timeStartValue = "";
      let timeEndValue = "";
      let paramsObj = {
        rows: this.pagesize,
        page: this.mobileCurrentPage
      };
      this.timePickerStartValue == "请选择"
        ? (timeStartValue = "")
        : (timeStartValue = this.timePickerStartValue.replace(/\//g, "-"));
      this.timePickerEndValue == "请选择"
        ? (timeEndValue = "")
        : (timeEndValue = this.timePickerEndValue.replace(/\//g, "-"));
      this.miniprogramOptions.forEach(item => {
        if (item.label == this.miniProgramMobileValue) {
          miniProgramMobile = item.value;
        }
      });
      timeStartValue !="" ? (paramsObj.createTime = timeStartValue) : "";
      timeEndValue !="" ? (paramsObj.createTimeEnd = timeEndValue) : "";
      miniProgramMobile != "" ? (paramsObj.state = miniProgramMobile) : "";
      this.nameMobileValue != "" ? (paramsObj.name = this.nameMobileValue) : "";
      this.phoneMobileValue != ""
        ? (paramsObj.telephone = this.phoneMobileValue)
        : "";
      paramsObj.isRepeat = this.filterValue;

      getWechatUserList(paramsObj)
        .then(res => {
          this.listTotal = res.data.total;
          const tableData = res.data.rows;
          tableData.forEach(tableItem => {
            const {
              id,
              nickName,
              phone,
              formId,
              avatarUrl,
              gender,
              country,
              province,
              city,
              language,
              createTime,
              overTime
            } = tableItem;
            const orderItem = {
              id: id,
              name: nickName,
              phoneNumber: phone,
              formId: formId,
              avatarUrl: avatarUrl,
              gender: gender,
              country: country,
              province: province,
              city: city,
              language: language,
              createTime: createTime,
              maturityTime: overTime
            };
            searchList.push(orderItem);
          });
          this.list = searchList;
        })
        .catch(error => {
          console.log(error);
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
      this.timePickerStartValue == "请选择"
        ? ""
        : (this.timePickerStartValue = "请选择"),
        this.timePickerEndValue == "请选择"
          ? ""
          : (this.timePickerEndValue = "请选择"),
        this.nameMobileValue == "" ? "" : (this.nameMobileValue = ""),
        this.phoneMobileValue == "" ? "" : (this.phoneMobileValue = "");
    },
    //选择开始日期
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
    //选择结束日期
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
    //选择小程序
    handleChooseMiniProgramMobile() {
      if (!this.mobileChannelPickerShow) {
        this.mobileMiniProgramPickerShow = true;
      }
    },
    //确认选择小程序
    MiniProgramPickerConfirm(res) {
      if (this.mobileMiniProgramPickerShow) {
        this.miniProgramMobileValue = res;
        this.mobileMiniProgramPickerShow = false;
      }
    },
    datetimePickerChange(e) {},
    //确认选择日期
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
    //取消选择日期
    datetimePickerCancel() {
      this.mobileDatePickerShow = !this.mobileDatePickerShow;
    },
    //开始搜索
    handleMobileSearch() {
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
