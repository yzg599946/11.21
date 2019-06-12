<template>
    <div class="app-container">
        <div class="filter-container">
            <el-date-picker
                v-model="timeSelectValue"
                type="datetimerange"
                :picker-options="pickerOptions"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                align="right"
            ></el-date-picker>
            <el-select v-model="salemanValue" clearable filterable placeholder="业务员">
                <el-option
                    v-for="item in salemanOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                ></el-option>
            </el-select>
            <el-select v-model="channelValue" clearable filterable placeholder="渠道项目">
                <el-option
                    v-for="item in channelOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                ></el-option>
            </el-select>
            <el-select v-model="productValue" clearable filterable placeholder="产品">
                <el-option
                    v-for="item in productOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                ></el-option>
            </el-select>
            <el-input class="table-input" placeholder="颜色名称" v-model="colorInput" clearable></el-input>
            <el-input class="table-input" placeholder="姓名" v-model="nameInput" clearable></el-input>
            <el-input class="table-input" placeholder="电话" v-model="phoneNumberInput" clearable></el-input>
            <el-input class="table-input" placeholder="起始ID" v-model="minIdInput" clearable></el-input>
            <label>至</label>
            <el-input class="table-input" placeholder="结束ID" v-model="maxIdInput" clearable></el-input>
            <el-input class="table-input" placeholder="起始价格" v-model="minPriceInput" clearable></el-input>
            <label>至</label>
            <el-input class="table-input" placeholder="结束价格" v-model="maxPriceInput" clearable></el-input>
            <el-select v-model="usefulValue" clearable filterable placeholder="是否有效单">
                <el-option
                    v-for="item in usefulOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                ></el-option>
            </el-select>
            <el-select v-model="repeatOrderValue" clearable filterable placeholder="是否重单">
                <el-option
                    v-for="item in repeatOrderOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                ></el-option>
            </el-select>
            <el-select v-model="repeatNamePhoneValue" clearable filterable placeholder="重复姓名手机">
                <el-option
                    v-for="item in repeatNamePhoneOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                ></el-option>
            </el-select>
            <el-select v-model="exportjdValue" clearable filterable placeholder="是否已导入京东">
                <el-option
                    v-for="item in exportjdOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                ></el-option>
            </el-select>
            <el-button
                class="filter-item"
                type="primary"
                icon="el-icon-search"
                @click="handleSearch"
            >搜索</el-button>
            <el-button class="filter-item" type="primary" icon="el-icon-download">导出excel</el-button>
            <el-button class="filter-item" type="primary" icon="el-icon-download">导出为德邦</el-button>
            <el-button class="filter-item" type="primary" icon="el-icon-upload2">批量导入京东</el-button>
        </div>
        <el-table
            @row-dblclick="handleEdit"
            @cell-click="handleUseful"
            fit
            highlight-current-row
            :data="list"
            style="width: 100%;"
        >
            <el-table-column type="selection" align="center" width="50"></el-table-column>
            <el-table-column label="ID" prop="id" align="center" width="80">
                <template slot-scope="scope">
                    <span>{{ scope.row.id }}</span>
                </template>
            </el-table-column>
            <el-table-column label="渠道项目" width="100px" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.channel }}</span>
                </template>
            </el-table-column>
            <el-table-column label="产品名称" width="120px" sortable="custom" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.productName }}</span>
                </template>
            </el-table-column>
            <el-table-column label="颜色名称" width="120px" sortable="custom" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.color }}</span>
                </template>
            </el-table-column>
            <el-table-column label="名字" width="100px" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.name }}</span>
                </template>
            </el-table-column>
            <el-table-column label="手机" width="150px" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.phoneNumber }}</span>
                </template>
            </el-table-column>
            <el-table-column label="数量" width="50px" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.count }}</span>
                </template>
            </el-table-column>
            <el-table-column label="总价" width="50px" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.price }}</span>
                </template>
            </el-table-column>
            <el-table-column label="重单" width="50px" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.repeatOrder }}</span>
                </template>
            </el-table-column>
            <el-table-column label="详细地址" width="200px" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.address }}</span>
                </template>
            </el-table-column>
            <el-table-column label="创建时间" width="150px" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.createTime }}</span>
                </template>
            </el-table-column>
            <el-table-column label="备注" width="100px" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.remarks }}</span>
                </template>
            </el-table-column>
            <el-table-column label="是否可用" width="80px" align="center">
                <template slot-scope="scope">
                    <span
                        style="cursor:pointer"
                        :class="scope.row.isUseful?'black':'red'"
                    >{{ scope.row.isUseful?'有效单':'无效单' }}</span>
                </template>
            </el-table-column>
            <el-table-column label="导入物流状态" width="120px" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.logisticsState }}</span>
                </template>
            </el-table-column>
            <el-table-column label="业务员" width="80px" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.salesman }}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作员" width="80px" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.operator }}</span>
                </template>
            </el-table-column>
            <el-table-column label="核单间隔" width="80px" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.nuclearOrderInterval }}</span>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog title="更新" :visible.sync="editDialogVisible">
            <el-form :model="form">
                <el-form-item label="产品型号" :label-width="formLabelWidth">
                    <el-select v-model="form.productType" clearable filterable placeholder="请选择型号">
                        <el-option
                            v-for="item in productOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="名字" :label-width="formLabelWidth">
                    <el-input v-model="form.name" clearable placeholder="请输入名字" class="normal-edit"></el-input>
                </el-form-item>
                <el-form-item label="颜色" :label-width="formLabelWidth">
                    <el-select v-model="form.color" clearable filterable placeholder="请选择颜色">
                        <el-option
                            v-for="item in colorOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="数量" :label-width="formLabelWidth">
                    <el-input
                        v-model="form.count"
                        clearable
                        placeholder="请输入数量"
                        class="normal-edit"
                    ></el-input>
                </el-form-item>
                <el-form-item label="总价" :label-width="formLabelWidth">
                    <el-input
                        v-model="form.price"
                        clearable
                        placeholder="请输入总价"
                        class="normal-edit"
                    ></el-input>
                </el-form-item>
                <el-form-item label="备注" :label-width="formLabelWidth">
                    <el-input
                        v-model="form.remarks"
                        clearable
                        placeholder="请输入备注"
                        class="remarks-edit"
                    ></el-input>
                </el-form-item>
                <el-form-item label="地址" :label-width="formLabelWidth">
                    <el-input
                        v-model="form.address"
                        clearable
                        placeholder="请输入地址"
                        class="address-edit"
                    ></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="handleEditCancel">取 消</el-button>
                <el-button type="primary" @click="handleEditConfirm">确 定</el-button>
            </div>
        </el-dialog>
        <input
            id="copy_content"
            type="text"
            value=""
            style="position: absolute;top: 0;left: 0;opacity: 0;z-index: -10;"
        >
    </div>
</template>

<script>
export default {
  data() {
    return {
      list: [
        {
          id: "10001",
          channel: "快手",
          productName: "R-1007",
          color: "奢华土豪金",
          name: "李怀西",
          phoneNumber: "18206991975",
          count: "1",
          price: "198",
          repeatOrder: "0",
          address: "广东省 XX市 XX镇 XX号",
          createTime: "2019-06-07 09:33:33",
          remarks: "",
          isUseful: false,
          logisticsState: "未导入",
          salesman: "范银霜",
          operator: "",
          nuclearOrderInterval: ""
        },
        {
          id: "10002",
          channel: "一点咨询",
          productName: "R-1008",
          color: "奢华土豪银",
          name: "吴坤",
          phoneNumber: "18251244684",
          count: "1",
          price: "198",
          repeatOrder: "0",
          address: "广东省 XX市 XX镇 XX号",
          createTime: "2019-06-08 09:33:33",
          remarks: "",
          isUseful: false,
          logisticsState: "未导入",
          salesman: "张佳坤",
          operator: "",
          nuclearOrderInterval: ""
        },
        {
          id: "10003",
          channel: "快手",
          productName: "R-1009",
          color: "奢华樱花粉",
          name: "王恒展",
          phoneNumber: "18206562145",
          count: "1",
          price: "198",
          repeatOrder: "0",
          address: "广东省 XX市 XX镇 XX号",
          createTime: "2019-06-04 09:33:33",
          remarks: "",
          isUseful: true,
          logisticsState: "未导入",
          salesman: "晴丹",
          operator: "",
          nuclearOrderInterval: ""
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
      usefulOptions: [
        {
          value: "选项1",
          label: "是"
        },
        {
          value: "选项2",
          label: "否"
        }
      ],
      repeatOrderOptions: [
        {
          value: "选项1",
          label: "是"
        },
        {
          value: "选项2",
          label: "否"
        }
      ],
      repeatNamePhoneOptions: [
        {
          value: "选项1",
          label: "是"
        },
        {
          value: "选项2",
          label: "否"
        }
      ],
      exportjdOptions: [
        {
          value: "选项1",
          label: "是"
        },
        {
          value: "选项2",
          label: "否"
        }
      ],
      colorOptions: [
        {
          value: "选项1",
          label: "颜色1"
        },
        {
          value: "选项2",
          label: "颜色2"
        },
        {
          value: "选项3",
          label: "颜色3"
        },
        {
          value: "选项4",
          label: "颜色4"
        }
      ],
      timeSelectValue: "",
      salemanValue: "",
      channelValue: "",
      productValue: "",
      usefulValue: "",
      repeatOrderValue: "",
      repeatNamePhoneValue: "",
      exportjdValue: "",
      colorInput: "",
      nameInput: "",
      phoneNumberInput: "",
      minIdInput: "",
      maxIdInput: "",
      minPriceInput: "",
      maxPriceInput: "",
      formLabelWidth: "120px",
      editDialogVisible: false,
      form: {
        productType: "",
        name: "",
        color: "",
        count: "",
        price: "",
        remarks: "",
        address: ""
      },
      currentEditID: 0
    };
  },
  created() {},
  methods: {
    handleEdit(e) {
      this.form.productType = e.productName;
      this.form.name = e.name;
      this.form.color = e.color;
      this.form.count = e.count;
      this.form.price = e.price;
      this.form.remarks = e.remarks;
      this.form.address = e.address;
      this.currentEditID = e.id;
      this.editDialogVisible = true;
    },
    handleEditCancel() {
      this.editDialogVisible = false;
    },
    handleEditConfirm() {
      let count = 0;
      this.list.forEach(item => {
        if (item.id == this.currentEditID) {
          this.list[count].productName = this.form.productType;
          this.list[count].name = this.form.name;
          this.list[count].color = this.form.color;
          this.list[count].count = this.form.count;
          this.list[count].price = this.form.price;
          this.list[count].remarks = this.form.remarks;
          this.list[count].address = this.form.address;
        } else {
          count++;
        }
      });
      this.editDialogVisible = false;
    },
    handleSearch() {
      console.log(this.$router.options.routes)
    },
    handleUseful(row, column, cell, event) {
      let count = 0;
      if (column.label == "是否可用") {
        this.list.forEach(item => {
          if (item.id == row.id) {
            this.list[count].isUseful = !this.list[count].isUseful;
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
          this.$message.error('复制失败，内容可能为空');
        }
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
</style>
