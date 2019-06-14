<template>
  <div class="app-container">
    <div class="filter-container">
      <el-date-picker
        size="mini"
        v-model="timeSelectValue"
        type="datetimerange"
        :picker-options="pickerOptions"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        align="right"
      ></el-date-picker>
      <el-select
        size="mini"
        class="table-input"
        v-model="salemanValue"
        clearable
        filterable
        placeholder="业务员"
      >
        <el-option
          v-for="item in salemanOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-select
        size="mini"
        class="table-input"
        v-model="productValue"
        clearable
        filterable
        placeholder="产品"
      >
        <el-option
          v-for="item in productOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-select
        size="mini"
        class="table-input"
        v-model="channelValue"
        clearable
        filterable
        placeholder="渠道项目"
      >
        <el-option
          v-for="item in channelOptions"
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
    </div>
    <el-table size="mini" border fit :data="list" style="width: 100%;" @cell-click="handleTimeSlot">
      <el-table-column fixed width="50" align="center">
        <template>
          <i class="el-icon-plus cursor-pointer"></i>
        </template>
      </el-table-column>
      <el-table-column label="渠道项目" width="850" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.channel }}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单数" width="850" sortable="custom" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.orderCount }}</span>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="channelTitle" :visible.sync="dialogTableVisible">
      <el-table :data="gridData">
        <el-table-column property="timeslot" label="时段" width="400"></el-table-column>
        <el-table-column property="orderCount" label="订单数" width="400"></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: [
        {
          channel: "微信小程序",
          orderCount: "4"
        },
        {
          channel: "快手",
          orderCount: "231"
        },
        {
          channel: "百度",
          orderCount: "14"
        }
      ],
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
      channelOptions: [
        {
          value: "选项1",
          label: "渠道1"
        },
        {
          value: "选项2",
          label: "渠道2"
        },
        {
          value: "选项3",
          label: "渠道3"
        },
        {
          value: "选项4",
          label: "渠道4"
        },
        {
          value: "选项5",
          label: "渠道5"
        }
      ],
      productOptions: [
        {
          value: "选项1",
          label: "产品1"
        },
        {
          value: "选项2",
          label: "产品2"
        },
        {
          value: "选项3",
          label: "产品3"
        },
        {
          value: "选项4",
          label: "产品4"
        },
        {
          value: "选项5",
          label: "产品5"
        }
      ],
      salemanOptions: [
        {
          value: "选项1",
          label: "李怀西"
        },
        {
          value: "选项2",
          label: "李怀西"
        },
        {
          value: "选项3",
          label: "李怀西"
        },
        {
          value: "选项4",
          label: "李怀西"
        },
        {
          value: "选项5",
          label: "李怀西"
        }
      ],
      gridData: [
        {
          timeslot: "00:00-00:59",
          orderCount: "546"
        },
        {
          timeslot: "01:00-01:59",
          orderCount: "96"
        },
        {
          timeslot: "02:00-02:59",
          orderCount: "24"
        }
      ],
      salemanValue: "",
      timeSelectValue: "",
      channelValue: "",
      productValue: "",
      formLabelWidth: "120px",
      dialogTableVisible: false,
      channelTitle: ""
    };
  },
  created() {},
  methods: {
    handleSearch() {},
    handleTimeSlot(row, column, cell, event) {
      if (column.label == undefined) {
        this.channelTitle = row.channel;
        this.dialogTableVisible = true;
      } else {
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.filter-container {
  padding-bottom: 10px;
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
</style>
