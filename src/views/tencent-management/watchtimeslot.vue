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
            <el-select  class="table-input" size="mini" v-model="salemanValue" clearable filterable placeholder="业务员">
                <el-option
                    v-for="item in salemanOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                ></el-option>
            </el-select>
            <el-select  class="table-input"  size="mini" v-model="productValue" clearable filterable placeholder="产品">
                <el-option
                    v-for="item in productOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                ></el-option>
            </el-select>
            <el-select  class="table-input" size="mini" v-model="channelValue" clearable filterable placeholder="渠道项目">
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
        <el-table size="mini" fit border :data="list" style="width: 100%;">
            <el-table-column type="index" width="100" align="center"></el-table-column>
            <el-table-column label="省份" width="850" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.timeslot }}</span>
                </template>
            </el-table-column>
            <el-table-column label="订单数" width="850" sortable="custom" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.orderCount }}</span>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
export default {
  data() {
    return {
      list: [
        {
          timeslot: "00:00-00:59",
          orderCount: "4"
        },
        {
          timeslot: "01:00-01:59",
          orderCount: "231"
        },
        {
          timeslot: "02:00-02:59",
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
      salemanValue:"",
      timeSelectValue: "",
      channelValue: "",
      productValue: "",
      formLabelWidth: "120px"
    };
  },
  created() {},
  methods: {
    handleSearch() {},
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
  padding: 0 5px;
  font-size: 14px;
}
</style>
