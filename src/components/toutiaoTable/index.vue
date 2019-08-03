<template>
  <div class="app-container">
    <!-- PC端 功能按钮 -->
    <div ref="filterBox" v-if="device=='desktop'" class="filter-container">
      <el-date-picker
        v-model="timeSelectValue"
        type="daterange"
        value-format="yyyy-MM-dd"
        :picker-options="pickerOptions"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        align="right"
        size="mini"
        @change="handleChooseDate"
      ></el-date-picker>
      <el-select
        v-permission="['tt-list-user']"
        multiple
        size="mini"
        v-model="salemanValue"
        @change="salemanChange"
        clearable
        filterable
        placeholder="业务员"
        :style="salemanWidth"
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
        v-model="accountValue"
        clearable
        filterable
        placeholder="账户"
      >
        <el-option
          v-for="item in accountOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-select
        size="mini"
        v-model="productValue"
        clearable
        filterable
        no-data-text="无数据"
        placeholder="产品"
      >
        <el-option
          v-for="item in productOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-input
        v-if="category == 'qtt'"
        size="mini"
        class="table-input"
        placeholder="套餐属性"
        v-model="packageAttributesValue"
        clearable
      ></el-input>
      <el-select
        v-if="category == 'tt'"
        size="mini"
        v-model="packageAttributesValue"
        clearable
        filterable
        no-data-text="无数据"
        placeholder="套餐属性"
      >
        <el-option
          v-for="item in pageInfoOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-input size="mini" class="table-input" placeholder="姓名" v-model="nameInput" clearable></el-input>
      <el-input
        size="mini"
        class="table-input"
        placeholder="电话"
        v-model="phoneNumberInput"
        clearable
      ></el-input>
      <el-select
        size="mini"
        class="table-input"
        v-model="usefulValue"
        clearable
        filterable
        placeholder="是否有效单"
      >
        <el-option
          v-for="item in usefulOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-select
        size="mini"
        class="table-input"
        v-model="repeatOrderValue"
        clearable
        filterable
        placeholder="是否重单"
      >
        <el-option
          v-for="item in repeatOrderOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-select
        size="mini"
        class="table-input"
        v-model="repeatNamePhoneValue"
        clearable
        filterable
        placeholder="重复姓名手机"
      >
        <el-option
          v-for="item in repeatNamePhoneOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-select
        size="mini"
        class="table-input"
        v-model="exportjdValue"
        clearable
        filterable
        placeholder="是否已导入京东"
      >
        <el-option
          v-for="item in exportjdOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-input size="mini" class="table-input" placeholder="起始ID" v-model="minIdInput" clearable></el-input>
      <label>至</label>
      <el-input size="mini" class="table-input" placeholder="结束ID" v-model="maxIdInput" clearable></el-input>
      <el-input
        size="mini"
        class="table-input"
        placeholder="起始价格"
        v-model="minPriceInput"
        clearable
      ></el-input>
      <label>至</label>
      <el-input
        size="mini"
        class="table-input"
        placeholder="结束价格"
        v-model="maxPriceInput"
        clearable
      ></el-input>

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
        icon="el-icon-close"
        @click="handleClearSearch"
      >清空</el-button>
      <el-button
        v-permission="[ this.category + '-list-export']"
        size="mini"
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        :loading="downloadLoading"
        @click="handleDownload"
      >导出excel</el-button>
      <el-button
        v-permission="[ this.category + '-list-export']"
        size="mini"
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        @click="handleExportDB"
      >导出为德邦</el-button>
      <el-button
        v-permission="[ 'logistics-import' ]"
        size="mini"
        class="filter-item"
        type="primary"
        icon="el-icon-upload2"
        @click="handleBatchImportIntoJD"
      >批量导入京东</el-button>
      <el-button
        v-permission="[ this.category + '-list-update' ]"
        size="mini"
        class="filter-item"
        type="primary"
        icon="el-icon-document-copy"
        @click="handleReplaceDuplicates"
      >替换重复项</el-button>
    </div>
    <!-- 移动端 功能按钮 -->
    <div v-else class="filter-mobile">
      <van-button type="info" size="small" @click="handleSearchMobile">搜索</van-button>
      <van-button type="info" size="small" @click="handleRefreshMobile">刷新</van-button>
    </div>
    <!-- PC端 产品列表 -->
    <vxe-table
      v-if="device=='desktop'"
      size="mini"
      ref="orderTable"
      :loading="listLoading"
      @header-cell-click="handleSort"
      @cell-dblclick="handleEdit"
      @cell-click="handleUseful"
      @select-change="handleSelectChange"
      @select-all="handleSelectAll"
      border
      show-footer
      show-overflow
      resizable
      :cell-class-name="cellClassName"
      :footer-method="footerMethod"
      :max-height="tableMaxHeight"
      :data.sync="list"
      :optimization="{scrollY: {gt: 500, oSize: 20, rSize: 60}}"
    >
      <vxe-table-column type="index" width="60" align="center"></vxe-table-column>
      <vxe-table-column type="selection" width="50" align="center"></vxe-table-column>
      <vxe-table-column field="id" title="id" align="center" width="65"></vxe-table-column>
      <vxe-table-column field="productName" title="产品名称" align="center" width="90">
        <template v-slot:header="{ column }">
          <span>产品名称</span>
          <i v-if="orderType == '' || orderName == 'colorName'" class="el-icon-sort"></i>
          <i v-if="orderType == 'asc' && orderName == 'productName'" class="el-icon-sort-up"></i>
          <i v-if="orderType == 'desc' && orderName == 'productName'" class="el-icon-sort-down"></i>
        </template>
      </vxe-table-column>
      <vxe-table-column field="pageInfo" title="套餐属性" align="center" width="100"></vxe-table-column>
      <vxe-table-column
        v-if="category == 'tt'"
        field="toutiaoName"
        title="头条产品名"
        align="center"
        width="160"
      ></vxe-table-column>
      <vxe-table-column field="name" title="名字" width="80" align="center"></vxe-table-column>
      <vxe-table-column field="telephone" title="手机" width="100" align="center"></vxe-table-column>
      <vxe-table-column field="num" title="数量" width="50" align="center"></vxe-table-column>
      <vxe-table-column field="totalCost" title="总价" width="70" align="center"></vxe-table-column>
      <vxe-table-column field="isRepeat" title="重单" width="50" align="center"></vxe-table-column>
      <vxe-table-column field="address" title="详细地址" min-width="250" align="left"></vxe-table-column>
      <vxe-table-column field="createTime" title="创建时间" width="150" align="center"></vxe-table-column>
      <vxe-table-column field="remark" title="备注" width="90" align="left"></vxe-table-column>
      <vxe-table-column title="是否可用" width="80" align="center">
        <template v-slot="{row}">
          <span v-if="row.mode == 1" style="color:#1890ff;cursor:pointer;">有效单</span>
          <span v-else style="color:red;cursor:pointer;">无效单</span>
        </template>
      </vxe-table-column>
      <vxe-table-column title="导入物流状态" width="120" align="center">
        <template v-slot="{row}">
          <span v-if="row.isImport == 1" style="color:#1890ff">已导入</span>
          <span v-else style="color:red">未导入</span>
        </template>
      </vxe-table-column>
      <vxe-table-column field="username" title="业务员" width="80" align="center"></vxe-table-column>
      <vxe-table-column field="operator" title="操作员" width="80" align="center"></vxe-table-column>
      <vxe-table-column field="operatingTime" title="核单间隔" min-width="80" align="center"></vxe-table-column>
    </vxe-table>
    <!-- 移动端 产品列表 -->
    <el-table
      v-else
      ref="orderTable"
      v-loading="listLoading"
      size="mini"
      border
      fit
      show-summary
      :highlight-current-row="false"
      :summary-method="getSummaries"
      :data="list"
      style="width: 100%;"
      :max-height="tableMaxHeight"
      :cell-class-name="mobileCellClassName"
    >
      <el-table-column type="index" width="50" align="center"></el-table-column>
      <el-table-column prop="id" label="id" width="65" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column
        prop="productName"
        label="产品名称"
        width="150"
        align="center"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="pageInfo"
        label="套餐属性"
        width="120"
        align="center"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        v-if="category == 'tt'"
        prop="toutiaoName"
        label="头条产品名"
        width="130"
        align="cenger"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column prop="name" label="名字" width="120" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="telephone" label="手机" width="120" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="num" label="数量" width="80" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="totalCost" label="总价" width="90" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="isRepeat" label="重单" width="80" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="address" label="详细地址" width="300" align="left" show-overflow-tooltip></el-table-column>
      <el-table-column prop="remark" label="备注" width="100" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="ip" label="ip地址" width="100" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
        width="150"
        align="center"
        show-overflow-tooltip
        resizable
      ></el-table-column>
      <el-table-column label="是否可用" width="90" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-if="scope.row.mode == 1" style="color:#1890ff;">有效单</span>
          <span v-else style="color:red;">无效单</span>
        </template>
      </el-table-column>
      <el-table-column label="导入物流状态" width="120" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-if="scope.row.isImport == 1" style="color:#1890ff">已导入</span>
          <span v-else style="color:red">未导入</span>
        </template>
      </el-table-column>
      <el-table-column prop="username" label="业务员" width="100" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="operator" label="操作员" width="100" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column
        prop="operatingTime"
        label="核单间隔"
        width="120"
        align="center"
        show-overflow-tooltip
        resizable
      ></el-table-column>
    </el-table>
    <!-- PC端 分页器 -->
    <el-row v-if="device!='mobile'" type="flex" align="middle">
      <el-col :span="23">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="pagesizes"
          :page-size="pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="listTotal"
          class="pagination"
        ></el-pagination>
      </el-col>
      <el-col :span="1">
        <el-button
          size="mini"
          class="filter-item"
          type="primary"
          icon="el-icon-refresh"
          @click="handleRefresh"
        >刷新</el-button>
      </el-col>
    </el-row>
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
        :items-per-page="50"
        :show-page-size="3"
        force-ellipses
        @change="handlePageChange"
      />
    </div>
    <!-- 编辑信息窗口 -->
    <el-dialog title="更新" :visible.sync="editDialogVisible" width="40%">
      <el-form :model="form" size="mini">
        <el-form-item label="产品型号" :label-width="formLabelWidth">
          <el-select v-model="form.productId" clearable filterable placeholder="请选择型号">
            <el-option
              v-for="item in productAllOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="名字" :label-width="formLabelWidth">
          <el-input v-model="form.name" clearable placeholder="请输入名字" class="normal-edit"></el-input>
        </el-form-item>
        <el-form-item label="套餐属性" :label-width="formLabelWidth">
          <el-input v-model="form.pageInfo" clearable placeholder="套餐属性" class="remarks-edit"></el-input>
        </el-form-item>
        <el-form-item label="数量" :label-width="formLabelWidth">
          <el-input v-model="form.num" clearable placeholder="请输入数量" class="normal-edit"></el-input>
        </el-form-item>
        <el-form-item label="总价" :label-width="formLabelWidth">
          <el-input v-model="form.totalCost" clearable placeholder="请输入总价" class="normal-edit"></el-input>
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth">
          <el-input v-model="form.remark" clearable placeholder="请输入备注" class="remarks-edit"></el-input>
        </el-form-item>
        <el-form-item label="地址" :label-width="formLabelWidth">
          <el-input v-model="form.address" clearable placeholder="请输入地址" class="remarks-edit"></el-input>
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
      value
      style="position: absolute;top: 0;left: 0;opacity: 0;z-index: -10;"
    />
    <!--导入京东窗口 -->
    <el-dialog
      class="import-jd"
      size="mini"
      title="选择导入方式"
      :visible.sync="importTypeDialogVisible"
      width="30%"
      center
    >
      <div>
        <el-radio-group v-model="exportType">
          <el-radio label="1" border>快速无序导入</el-radio>
          <el-radio label="2" border>慢速顺序导入</el-radio>
        </el-radio-group>
      </div>
      <div style="margin-top: 20px">
        <el-radio-group v-model="transport">
          <el-radio label="1" border>陆运件</el-radio>
          <el-radio label="2" border>空运件</el-radio>
        </el-radio-group>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="importTypeDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleExportJd">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 替换重复项 -->
    <el-dialog title="替换套餐属性" :visible.sync="dialogFormVisible" width="30%">
      <el-form :model="replaceForm">
        <el-form-item label="新产品型号" :label-width="formLabelWidth">
          <el-select
            v-model="replaceForm.productType"
            clearable
            filterable
            placeholder="请选择型号"
            size="mini"
          >
            <el-option
              v-for="item in productAllOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="新套餐属性" :label-width="formLabelWidth">
          <el-input
            v-model="replaceForm.pageInfo"
            autocomplete="off"
            size="mini"
            class="select-input"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">关闭</el-button>
        <el-button type="primary" @click="handeleConfirmRepalce">保存</el-button>
      </div>
    </el-dialog>
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
            <van-cell
              @click="handleChooseSalesman"
              title="业务员"
              is-link
              :value="salesmanMobileValue"
            />
            <van-cell @click="handleChooseAccount" title="账户" is-link :value="accountMobileValue" />
            <van-cell @click="handleChooseProduct" title="产品" is-link :value="productMobileValue" />
            <van-cell
              v-if="category == 'tt'"
              @click="handleChoosePageInfo"
              title="套餐属性"
              is-link
              :value="pageInfoMobileValue"
            />
            <van-cell
              @click="handleChooseIsUseful"
              title="是否有效单"
              is-link
              :value="usefulMobileValue"
            />
            <van-cell
              @click="handleChooseIsRepeatOrder"
              title="是否重单"
              is-link
              :value="repeatOrderMobileValue"
            />
            <van-cell
              @click="handleChooseIsRepeatPhoneName"
              title="重复手机姓名"
              is-link
              :value="repeatNamePhoneMobileValue"
            />
            <van-cell
              @click="handleChooseExportJD"
              title="是否已导入京东"
              is-link
              :value="exportJDMobileValue"
            />
            <van-field
              clearable
              label="姓名"
              v-model="nameMobileValue"
              placeholder="请输入姓名"
              input-align="right"
              is-link
            />
            <van-field
              v-if="category == 'qtt'"
              clearable
              label="套餐属性"
              v-model="pageInfoMobileValue"
              placeholder="请输入套餐属性"
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
            <van-field
              clearable
              label="起始ID"
              v-model="minIdMobileValue"
              placeholder="请输入起始ID"
              input-align="right"
              is-link
            />
            <van-field
              clearable
              label="结束ID"
              v-model="maxIdMobileValue"
              placeholder="请输入结束ID"
              input-align="right"
              is-link
            />
            <van-field
              clearable
              label="起始价格"
              v-model="minPriceMobileValue"
              placeholder="请输入起始价格"
              input-align="right"
              is-link
            />
            <van-field
              clearable
              label="结束价格"
              v-model="maxPriceMobileValue"
              placeholder="请输入结束价格"
              input-align="right"
              is-link
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
      <!--业务员选择弹窗-->
      <van-popup v-model="mobileSalesmanPickerShow" position="bottom">
        <van-search
          clearable
          show-action
          placeholder="请输入搜索关键词"
          v-model="salesmanSearchValue"
          list="salesmanIde"
        >
          <div slot="action" @click="handleSearchSalesmanItem">搜索</div>
        </van-search>
        <datalist id="salesmanIde">
          <option v-for="item in salemanOptions" :key="item.value" :value="item.label" />
        </datalist>
        <van-picker
          show-toolbar
          :default-index="salesPickerCurrentSelect"
          :columns="salesmanColumns"
          @cancel="mobileSalesmanPickerShow = false"
          @confirm="salesmanPickerConfirm"
        />
      </van-popup>
      <!--账户选择弹窗-->
      <van-popup v-model="mobileAccountPickerShow" position="bottom">
        <van-search
          clearable
          show-action
          placeholder="请输入搜索关键词"
          v-model="accountSearchValue"
          list="accountIde"
        >
          <div slot="action" @click="handleSearchAccountItem">搜索</div>
        </van-search>
        <datalist id="accountIde">
          <option v-for="item in accountOptions" :key="item.value" :value="item.label" />
        </datalist>
        <van-picker
          show-toolbar
          :default-index="accountPickerCurrentSelect"
          :columns="accountColumns"
          @cancel="mobileAccountPickerShow = false"
          @confirm="accountPickerConfirm"
        />
      </van-popup>
      <!--产品选择弹窗-->
      <van-popup v-model="mobileProductPickerShow" position="bottom">
        <van-search
          clearable
          show-action
          placeholder="请输入搜索关键词"
          v-model="productSearchValue"
          list="productIde"
        >
          <div slot="action" @click="handleSearchProductItem">搜索</div>
        </van-search>
        <datalist id="productIde">
          <option v-for="item in productOptions" :key="item.value" :value="item.label" />
        </datalist>
        <van-picker
          show-toolbar
          :default-index="productPickerCurrentSelect"
          :columns="productColumns"
          @cancel="mobileProductPickerShow = false"
          @confirm="productPickerConfirm"
        />
      </van-popup>
      <!-- 套餐属性选择弹窗 -->
      <van-popup v-model="mobilePageInfoPickerShow" position="bottom">
        <van-search
          clearable
          show-action
          placeholder="请输入搜索关键词"
          v-model="pageInfoMobileValue"
          list="pageInfoIde"
        >
          <div slot="action" @click="handleSearchPageInfoItem">搜索</div>
        </van-search>
        <datalist id="productIde">
          <option v-for="item in pageInfoOptions" :key="item.value" :value="item.label" />
        </datalist>
        <van-picker
          show-toolbar
          :default-index="pageInfoPickerCurrentSelect"
          :columns="pageInfoColumns"
          @cancel="mobilePageInfoPickerShow = false"
          @confirm="pageInfoPickerConfirm"
        />
      </van-popup>
      <!--是否有效选择弹窗-->
      <van-popup v-model="mobileUsefulPickerShow" position="bottom">
        <van-picker
          show-toolbar
          :columns="usefulColumns"
          @cancel="mobileUsefulPickerShow = false"
          @confirm="usefulPickerConfirm"
        />
      </van-popup>
      <!--是否重单选择弹窗-->
      <van-popup v-model="mobileRepeatOrderPickerShow" position="bottom">
        <van-picker
          show-toolbar
          :columns="repeatOrderColumns"
          @cancel="mobileRepeatOrderPickerShow = false"
          @confirm="repeatOrderPickerConfirm"
        />
      </van-popup>
      <!--是否重复名字电话选择弹窗-->
      <van-popup v-model="mobileRepeatNamePhonePickerShow" position="bottom">
        <van-picker
          show-toolbar
          :columns="repeatNamePhoneColumns"
          @cancel="mobileRepeatNamePhonePickerShow = false"
          @confirm="repeatNamePhonePickerConfirm"
        />
      </van-popup>
      <!--是否导入京东-->
      <van-popup v-model="mobileExportJDPickerShow" position="bottom">
        <van-picker
          show-toolbar
          :columns="exportJDColumns"
          @cancel="mobileExportJDPickerShow = false"
          @confirm="exportJDPickerConfirm"
        />
      </van-popup>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { getStore } from "@/utils/store";
import XEUtils from "xe-utils";
import permission from "@/directive/permission/index.js"; // 权限判断指令
import { parseTime } from "@/utils";
import { setTimeout, clearTimeout } from "timers";
import {
  getToutiaoOrderList,
  editToutiaoUseful,
  editToutiaoOrder,
  getToutiaoOrderInfo,
  getSalesmanList,
  exportToutiaoExcel,
  importJD,
  getProductSelectList,
  replaceDuplicates,
  getProductList,
  getPageInfoList
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
  name: "toutiaoTable",
  props: ["category"],
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
      salemanOptions: [],
      salesmanColumns: [],
      accountOptions: [
        {
          value: "瑞士劳斯宾腕表旗舰店",
          label: "瑞士劳斯宾腕表旗舰店"
        },
        {
          value: "LAOSIBIN隆辉腾专卖店",
          label: "LAOSIBIN隆辉腾专卖店"
        },
        {
          value: "瑞士劳斯宾品牌专卖店",
          label: "瑞士劳斯宾品牌专卖店"
        },
        {
          value: "杂货铺",
          label: "杂货铺"
        },
        {
          value: "凯迪表业",
          label: "凯迪表业"
        }
      ],
      accountColumns: [
        "瑞士劳斯宾腕表旗舰店",
        "LAOSIBIN隆辉腾专卖店",
        "瑞士劳斯宾品牌专卖店",
        "杂货铺",
        "凯迪表业"
      ],
      productOptions: [],
      productColumns: [],
      productAllOptions: [],
      pageInfoOptions: [],
      pageInfoColumns: [],
      usefulOptions: [
        {
          value: "0",
          label: "无效单"
        },
        {
          value: "1",
          label: "有效单"
        }
      ],
      usefulColumns: ["无效单", "有效单"],
      repeatOrderOptions: [
        {
          value: "0",
          label: "不重单"
        },
        {
          value: "1",
          label: "重单"
        }
      ],
      repeatOrderColumns: ["不重单", "重单"],
      repeatNamePhoneOptions: [
        {
          value: "0",
          label: "不重复手机姓名"
        },
        {
          value: "1",
          label: "重复手机姓名"
        }
      ],
      repeatNamePhoneColumns: ["不重复", "重复"],
      exportjdOptions: [
        {
          value: "0",
          label: "未导入"
        },
        {
          value: "1",
          label: "已导入"
        }
      ],
      exportJDColumns: ["未导入", "已导入"],
      timeSelectValue: "",
      salemanValue: "",
      accountValue: "",
      productValue: "",
      packageAttributesValue: "",
      usefulValue: "",
      repeatOrderValue: "",
      repeatNamePhoneValue: "",
      exportjdValue: "",
      nameInput: "",
      phoneNumberInput: "",
      minIdInput: "",
      maxIdInput: "",
      minPriceInput: "",
      maxPriceInput: "",
      formLabelWidth: "120px",
      editDialogVisible: false,
      form: {
        productName: "",
        name: "",
        pageInfo: "",
        num: "",
        totalCost: "",
        remark: "",
        address: ""
      },
      currentEditID: 0,
      downloadLoading: false,
      listLoading: false,
      currentPage: 1, //当前页
      mobileCurrentPage: 1,
      pagesizes: [300, 500, 1000, 5000], //单页最大显示条数
      pagesize: 300, //单页内条数
      listTotal: 0, //总数
      salemanWidth: "",
      importTypeDialogVisible: false,
      multipleSelection: [],
      clickFlag: null, // 单击定时器
      mobileSearchShow: false,
      mobileDatePickerShow: false,
      mobileSalesmanPickerShow: false,
      mobileAccountPickerShow: false,
      mobileProductPickerShow: false,
      mobilePageInfoPickerShow: false,
      mobilePackageAttributesPickerShow: false,
      mobileUsefulPickerShow: false,
      mobileRepeatOrderPickerShow: false,
      mobileRepeatNamePhonePickerShow: false,
      mobileExportJDPickerShow: false,
      minDate: new Date(1950, 10, 1),
      maxDate: new Date(),
      currentDate: new Date(),
      minDateEnd: new Date(),
      maxDateStart: new Date(),
      timePickerStartValue: "请选择",
      timePickerEndValue: "请选择",
      salesmanMobileValue: "请选择",
      channelMobileValue: "请选择",
      accountMobileValue: "请选择",
      productMobileValue: "请选择",
      packageAttributesMobileValue: "请选择",
      usefulMobileValue: "请选择",
      repeatOrderMobileValue: "请选择",
      repeatNamePhoneMobileValue: "请选择",
      exportJDMobileValue: "请选择",
      nameMobileValue: "",
      pageInfoMobileValue: "",
      phoneMobileValue: "",
      minIdMobileValue: "",
      maxIdMobileValue: "",
      minPriceMobileValue: "",
      maxPriceMobileValue: "",
      device: "",
      salesmanSearchValue: "",
      productSearchValue: "",
      pageInfoSearchValue: "",
      accountSearchValue: "",
      PackageAttributesSearchValue: "",
      salesPickerCurrentSelect: 0,
      channelPickerCurrentSelect: 0,
      productPickerCurrentSelect: 0,
      pageInfoPickerCurrentSelect: 0,
      accountPickerCurrentSelect: 0,
      packageAttributesPickerCurrentSelect: 0,
      datetimePickerType: "",
      mobileSearchButtonLoading: false,
      tableMaxHeight: 0,
      pageJumpIndex: 1,
      contains: false,
      jdSelect: [],
      dialogFormVisible: false,
      replaceForm: {
        productType: "",
        pageInfo: ""
      },
      exportType: "1",
      transport: "1",
      orderType: "",
      orderName: ""
    };
  },
  created() {
    this.device = this.$store.state.app.device;
    window.addEventListener("resize", this.getHeight);
    this.$nextTick(() => {
      if (this.device === "desktop") {
        this.getList();
        this.getProductList();
        if (this.category == "tt") {
          this.getPageInfo();
        }
      } else {
        this.getMobileList();
        this.getProductListMobile();
        if (this.category == "tt") {
          this.getPageInfoListMobile();
          this.pageInfoMobileValue = "请选择";
        }
      }
    });
    this.getHeight();
    this.getSalesman();
    this.getProduct();
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
      this.searchButtonLoading = true;
      this.listLoading = true;
      if (this.timeSelectValue == null) {
        this.timeSelectValue = ["", ""];
      } else {
        this.timeSelectValue == "" ? this.timeSelectValue : ["", ""];
      }
      let paramsObj = {
        contains: this.contains,
        rows: this.pagesize,
        page: this.currentPage
      };
      this.timeSelectValue[0]
        ? (paramsObj.createTime = this.timeSelectValue[0])
        : "";
      this.timeSelectValue[1]
        ? (paramsObj.createTimeEnd = this.timeSelectValue[1])
        : "";
      this.minIdInput ? (paramsObj.id = this.minIdInput) : "";
      this.maxIdInput ? (paramsObj.idEnd = this.maxIdInput) : "";
      this.repeatOrderValue ? (paramsObj.isRepeat = this.repeatOrderValue) : "";
      this.usefulValue ? (paramsObj.mode = this.usefulValue) : "";
      this.accountValue ? (paramsObj.text = this.accountValue) : "";
      this.exportjdValue ? (paramsObj.isImport = this.exportjdValue) : "";
      this.repeatNamePhoneValue
        ? (paramsObj.isNameRepeat = this.repeatNamePhoneValue)
        : "";
      this.nameInput ? (paramsObj.name = this.nameInput) : "";
      this.productValue ? (paramsObj.productId = this.productValue) : "";
      this.phoneNumberInput
        ? (paramsObj.telephone = this.phoneNumberInput)
        : "";
      this.minPriceInput ? (paramsObj.totalCost = this.minPriceInput) : "";
      this.maxPriceInput ? (paramsObj.totalCostEnd = this.maxPriceInput) : "";
      this.packageAttributesValue
        ? (paramsObj.pageInfo = this.packageAttributesValue)
        : "";
      if (this.salemanValue.length > 0) {
        paramsObj.uids = this.salemanValue.join(",");
      }
      if (this.orderType != "") {
        paramsObj.order = this.orderType;
        paramsObj.sort = this.orderName;
      }
      getToutiaoOrderList(this.category, paramsObj)
        .then(res => {
          this.listTotal = res.data.total;
          this.list = res.data.rows;
          this.listLoading = false;
          this.$refs.orderTable.clearScroll();
        })
        .catch(error => {
          this.listLoading = false;
          this.$message.error("获取数据时出错");
        });
    },
    // 更改背景色
    cellClassName({ row, rowIndex, column, columnIndex }) {
      if (column.property === "name") {
        if (row.repeatName == "1") {
          return "col-red";
        }
      }
      if (column.property === "telephone") {
        if (row.repeatTelephone == "1") {
          return "col-red";
        }
      }
    },
    // 获取业务员列表
    getSalesman() {
      let salesmanList = getStore({ name: "salesmanList" });
      this.salemanOptions = JSON.parse(salesmanList);
      let salesmanColumns = [];
      this.salemanOptions.forEach(salesmanItem => {
        salesmanColumns.push(salesmanItem.label);
      });
      this.salesmanColumns = salesmanColumns;
    },
    // 获取产品列表
    getProduct() {
      let productList = getStore({ name: "productList" });
      this.productAllOptions = JSON.parse(productList);
    },
    // 表格高度自适应
    getHeight() {
      this.$nextTick(() => {
        if (this.device === "desktop") {
          this.tableMaxHeight =
            document.body.offsetHeight -
            (200 + this.$refs.filterBox.offsetHeight + 40 + 18);
        } else {
          this.tableMaxHeight =
            document.body.offsetHeight - (100 + 40 + 40 + 86 + 10 + 37);
        }
      });
    },
    // 单击复制
    handleUseful({ row, rowIndex, column, columnIndex }, event) {
      if (this.device == "mobile") return;
      if (this.clickFlag) {
        clearTimeout(this.clickFlag);
        this.clickFlag = null;
      }
      this.clickFlag = setTimeout(() => {
        let count = 0;
        if (column.title == undefined) return;
        if (column.title == "是否可用") {
          //判断权限
          const roles = this.$store.getters && this.$store.getters.roles;
          if (roles.indexOf(this.category + "-list-mode") == -1) {
            return;
          }
          this.list.forEach(item => {
            if (item.id == row.id) {
              this.handleEditUseful({
                id: row.id,
                mode: this.list[count].mode
              });
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
    // 修改可用状态
    handleEditUseful(data) {
      const { id, mode } = data;
      let modeInt;
      mode == 1 ? (modeInt = 0) : (modeInt = 1);
      editToutiaoUseful(this.category, {
        id: id,
        mode: modeInt
      })
        .then(res => {
          this.getList();
          setTimeout(() => {
            this.$message({
              message: "修改成功",
              type: "success"
            });
          }, 1000);
        })
        .catch(error => {
          this.$message.error("修改失败");
        });
    },
    // 双击编辑
    handleEdit({ row, rowIndex, column, columnIndex }, event) {
      if (this.device == "mobile") return;
      //判断权限
      const roles = this.$store.getters && this.$store.getters.roles;
      if (roles.indexOf(this.category + "-list-update") == -1) {
        return;
      }
      if (this.clickFlag) {
        clearTimeout(this.clickFlag);
        this.clickFlag = null;
      }
      let timestamp = Date.parse(new Date());
      let paramsObj = {
        id: row.id,
        _: timestamp
      };
      if (this.category == "qtt") {
        paramsObj.text = "watch";
      }
      getToutiaoOrderInfo(this.category, paramsObj).then(res => {
        this.form = res.data;
        this.currentEditID = row.id;
        this.editDialogVisible = true;
      });
    },
    // 取消编辑
    handleEditCancel() {
      this.editDialogVisible = false;
    },
    // 确认编辑
    handleEditConfirm(row, column, event) {
      let count = 0;
      this.list.forEach(item => {
        if (item.id == this.currentEditID) {
          const params = {
            id: this.list[count].id,
            productId: this.form.productId,
            name: this.form.name,
            pageInfo: this.form.pageInfo,
            num: this.form.num,
            totalCost: this.form.totalCost,
            remark: this.form.remark,
            address: this.form.address
          };
          editToutiaoOrder(this.category, params)
            .then(res => {
              this.getList();
              setTimeout(() => {
                this.$message({
                  message: "修改成功",
                  type: "success"
                });
              }, 1000);
            })
            .catch(error => {
              this.$message.error("修改失败");
            });
        } else {
          count++;
        }
      });
      this.editDialogVisible = false;
    },
    // 搜索验证
    searchVerify() {
      if (
        (this.minIdInput && !this.maxIdInput) ||
        (!this.minIdInput && this.maxIdInput)
      ) {
        this.$message({
          message: "未填写完整的ID范围",
          type: "warning"
        });
        return false;
      }
      if (
        (this.minPriceInput && !this.maxPriceInput) ||
        (!this.minPriceInput && this.maxPriceInput)
      ) {
        this.$message({
          message: "未填写完整的价格范围",
          type: "warning"
        });
        return false;
      }
      return true;
    },
    // 搜索
    handleSearch() {
      if (!this.searchVerify()) return;
      this.searchButtonLoading = true;
      this.getList();
      this.searchButtonLoading = false;
    },
    // 清空搜索项
    handleClearSearch() {
      this.timeSelectValue = "";
      this.salemanValue = [];
      this.accountValue = "";
      this.productValue = "";
      this.nameInput = "";
      this.phoneNumberInput = "";
      this.usefulValue = "";
      this.repeatOrderValue = "";
      this.repeatNamePhoneValue = "";
      this.exportjdValue = "";
      this.minIdInput = "";
      this.maxIdInput = "";
      this.minPriceInput = "";
      this.maxPriceInput = "";
      this.packageAttributesValue = "";
      this.salemanChange();
    },
    // 选择表格尺寸
    handleSizeChange(val) {
      this.pagesize = val;
      this.getList();
    },
    //选择表格当前页数
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getList();
    },
    // 导出excel
    handleDownload() {
      this.downloadLoading = true;
      if (this.multipleSelection.length === 0) {
        this.$message.error("未选择任何数据");
        this.downloadLoading = false;
        return;
      }

      let ids = [];
      this.multipleSelection.forEach(selectItem => {
        ids.push(selectItem.id);
      });
      let idsStr = ids.join(",");
      exportToutiaoExcel(this.category, {
        ids: idsStr,
        logistics: "yd"
      }).then(res => {
        const blob = new Blob([res], {
          type: "application/vnd.mx-excel;charset=utf-8"
        });
        let myDate = new Date();
        let year = myDate.getFullYear();
        let month = myDate.getMonth() + 1;
        let day = myDate.getDate();
        var downloadElement = document.createElement("a");
        var href = window.URL.createObjectURL(blob); //创建下载的链接
        downloadElement.href = href;
        downloadElement.download = `订单 ${year}-${month}-${day}.xls`; //下载后文件名
        document.body.appendChild(downloadElement);
        downloadElement.click(); //点击下载
        document.body.removeChild(downloadElement); //下载完成移除元素
        window.URL.revokeObjectURL(href); //释放掉blob对象
      });
      this.downloadLoading = false;
    },
    // 业务员选择器宽度自适应
    salemanChange() {
      const inputWidth = 178; //选择器原始宽度 178px
      let optionWidth = this.salemanValue.length * 65 + 97; //一个标签宽度65px 右边预留97px
      this.salemanWidth =
        optionWidth > inputWidth
          ? "width:" + optionWidth + "px"
          : "width:" + inputWidth + "px";
      this.getProductList();
      if (this.category == "tt") {
        this.getPageInfo();
      }
    },
    // 选择发生改变
    handleSelectChange({ selection, checked, row, column }, event) {
      this.multipleSelection = selection;
    },
    // 全选
    handleSelectAll({ selection, checked }, event) {
      this.multipleSelection = selection;
    },
    // 导出德邦
    handleExportDB() {
      this.downloadLoading = true;
      if (this.multipleSelection.length === 0) {
        this.$message.error("未选择任何数据");
        this.downloadLoading = false;
        return;
      }

      let ids = [];
      this.multipleSelection.forEach(selectItem => {
        ids.push(selectItem.id);
      });
      let idsStr = ids.join(",");
      exportToutiaoExcel(this.category, {
        ids: idsStr,
        logistics: "deppon"
      }).then(res => {
        const blob = new Blob([res], {
          type: "application/vnd.mx-excel;charset=utf-8"
        });
        let myDate = new Date();
        let year = myDate.getFullYear();
        let month = myDate.getMonth() + 1;
        let day = myDate.getDate();
        var downloadElement = document.createElement("a");
        var href = window.URL.createObjectURL(blob); //创建下载的链接
        downloadElement.href = href;
        downloadElement.download = `订单 ${year}-${month}-${day}.xls`; //下载后文件名
        document.body.appendChild(downloadElement);
        downloadElement.click(); //点击下载
        document.body.removeChild(downloadElement); //下载完成移除元素
        window.URL.revokeObjectURL(href); //释放掉blob对象
      });
      this.downloadLoading = false;
    },
    // 批量导入京东
    handleBatchImportIntoJD() {
      if (this.multipleSelection.length === 0) {
        this.$message.error("未选择任何数据");
      } else {
        this.jdSelect = this.multipleSelection;
        this.importTypeDialogVisible = true;
      }
    },
    // 确认导入京东
    handleExportJd() {
      let ids = [];
      this.jdSelect.forEach(item => {
        ids.push(item.id);
      });
      let idsStr = ids.join(",");
      importJD(this.category, {
        ids: idsStr,
        trans: this.transport,
        type: this.exportType,
        text: this.category
      }).then(res => {
        if (res.status === 200) {
          this.$alert(res.msg, "导入京东结果", {
            dangerouslyUseHTMLString: true
          });
        }
      });
      this.importTypeDialogVisible = false;
    },
    // 合计
    footerMethod({ columns, data }) {
      return [
        columns.map((column, columnIndex) => {
          if (columnIndex === 1) {
            return "合计";
          }
          if (["num", "totalCost"].includes(column.property)) {
            return XEUtils.sum(data, column.property);
          }
          return "-";
        })
      ];
    },
    // 选择日期
    handleChooseDate() {
      this.getProductList();
      if (this.category == "tt") {
        this.getPageInfo();
      }
    },
    // 获取产品
    getProductList() {
      this.productOptions = [];
      let paramsObj = { channel: this.category };
      if (this.timeSelectValue == null) {
        this.timeSelectValue = ["", ""];
      } else {
        this.timeSelectValue == "" ? this.timeSelectValue : ["", ""];
      }
      this.timeSelectValue[0]
        ? (paramsObj.createTime = this.timeSelectValue[0])
        : "";
      this.timeSelectValue[1]
        ? (paramsObj.createTimeEnd = this.timeSelectValue[1])
        : "";
      this.packageAttributesValue
        ? (paramsObj.packageAttributes = this.packageAttributesValue)
        : "";
      this.minIdInput ? (paramsObj.id = this.minIdInput) : "";
      this.maxIdInput ? (paramsObj.idEnd = this.maxIdInput) : "";
      this.repeatOrderValue ? (paramsObj.isRepeat = this.repeatOrderValue) : "";
      this.usefulValue ? (paramsObj.mode = this.usefulValue) : "";
      this.nameInput ? (paramsObj.name = this.nameInput) : "";
      this.productValue ? (paramsObj.productId = this.productValue) : "";
      this.phoneNumberInput
        ? (paramsObj.telephone = this.phoneNumberInput)
        : "";
      this.minPriceInput ? (paramsObj.totalCost = this.minPriceInput) : "";
      this.maxPriceInput ? (paramsObj.totalCostEnd = this.maxPriceInput) : "";
      if (this.salemanValue.length > 0) {
        paramsObj.uids = this.salemanValue.join(",");
      }
      getProductSelectList(paramsObj, this.category).then(res => {
        const tableList = res.data;
        let productList = [];
        tableList.forEach(tableItem => {
          const { name, id } = tableItem;
          const productItem = { label: name, value: id };
          productList.push(productItem);
        });
        this.productOptions = productList;
      });
    },
    // 获取套餐属性
    getPageInfo() {
      this.pageInfoOptions = [];
      let paramsObj = {};
      if (this.timeSelectValue == null) {
        this.timeSelectValue = ["", ""];
      } else {
        this.timeSelectValue == "" ? this.timeSelectValue : ["", ""];
      }
      this.timeSelectValue[0]
        ? (paramsObj.createTime = this.timeSelectValue[0])
        : "";
      this.timeSelectValue[1]
        ? (paramsObj.createTimeEnd = this.timeSelectValue[1])
        : "";
      this.packageAttributesValue
        ? (paramsObj.packageAttributes = this.packageAttributesValue)
        : "";
      this.minIdInput ? (paramsObj.id = this.minIdInput) : "";
      this.maxIdInput ? (paramsObj.idEnd = this.maxIdInput) : "";
      this.repeatOrderValue ? (paramsObj.isRepeat = this.repeatOrderValue) : "";
      this.usefulValue ? (paramsObj.mode = this.usefulValue) : "";
      this.nameInput ? (paramsObj.name = this.nameInput) : "";
      this.productValue ? (paramsObj.productId = this.productValue) : "";
      this.phoneNumberInput
        ? (paramsObj.telephone = this.phoneNumberInput)
        : "";
      this.minPriceInput ? (paramsObj.totalCost = this.minPriceInput) : "";
      this.maxPriceInput ? (paramsObj.totalCostEnd = this.maxPriceInput) : "";
      if (this.salemanValue.length > 0) {
        paramsObj.uids = this.salemanValue.join(",");
      }
      getPageInfoList(paramsObj).then(res => {
        const tableList = res.data;
        let pageInfoList = [];
        tableList.forEach(tableItem => {
          const { pageInfo } = tableItem;
          const pageInfoItem = { label: pageInfo, value: pageInfo };
          pageInfoList.push(pageInfoItem);
        });
        this.pageInfoOptions = pageInfoList;
      });
    },
    // 刷新
    handleRefresh() {
      this.getList();
    },
    // 替换重复项目
    handleReplaceDuplicates() {
      this.dialogFormVisible = true;
    },
    // 确认替换
    handeleConfirmRepalce() {
      if (this.replaceForm.productType == "") {
        this.$message.error("请选择新产品型号!");
        return;
      }
      if (this.replaceForm.pageInfo == "") {
        this.$message.error("请填写新套餐属性!");
        return;
      }
      if (this.timeSelectValue == null) {
        this.timeSelectValue = ["", ""];
      } else {
        this.timeSelectValue == "" ? this.timeSelectValue : ["", ""];
      }
      let paramsObj = {};
      this.timeSelectValue[0]
        ? (paramsObj.createTime = this.timeSelectValue[0])
        : "";
      this.timeSelectValue[1]
        ? (paramsObj.createTimeEnd = this.timeSelectValue[1])
        : "";
      this.repeatOrderValue
        ? (paramsObj.isIpRepeat = this.repeatOrderValue)
        : (paramsObj.isIpRepeat = 0);
      this.usefulValue
        ? (paramsObj.isNameRepeat = this.usefulValue)
        : (paramsObj.isNameRepeat = 0);
      this.productValue ? (paramsObj.productId = this.productValue) : "";
      this.packageAttributesValue
        ? (paramsObj.pageInfo = this.packageAttributesValue)
        : "";
      if (this.salemanValue.length > 0) {
        paramsObj.uids = this.salemanValue.join(",");
      }
      paramsObj.newPageInfo = this.replaceForm.pageInfo;
      paramsObj.newProductId = this.replaceForm.productType;
      replaceDuplicates(this.category, paramsObj).then(res => {
        if (res.status == 200) {
          this.$message({
            type: "success",
            message: "替换成功"
          });
        }
        this.getList();
        this.dialogFormVisible = false;
      });
    },
    // 排序
    handleSort(
      {
        triggerResizable,
        triggerSort,
        triggerFilter,
        $rowIndex,
        column,
        columnIndex,
        $columnIndex,
        cell
      },
      event
    ) {
      if (column.title == "产品名称") {
        if (this.orderType == "") {
          this.orderType = "asc";
        } else if (this.orderType == "asc") {
          this.orderType = "desc";
        } else {
          this.orderType = "";
        }
        this.orderName = column.property;
        this.getList();
      }
    },

    /* 移动端事件 */

    // 获取数据
    getMobileList() {
      this.listLoading = true;
      let uids = [];

      let paramsObj = {
        contains: this.contains,
        rows: 50,
        page: this.mobileCurrentPage
      };

      this.timePickerStartValue == "请选择"
        ? ""
        : (paramsObj.createTime = this.timePickerStartValue.replace(
            /\//g,
            "-"
          ));
      this.timePickerEndValue == "请选择"
        ? ""
        : (paramsObj.createTimeEnd = this.timePickerEndValue.replace(
            /\//g,
            "-"
          ));
      if (this.productMobileValue != "请选择") {
        this.productOptions.forEach(productItem => {
          if (productItem.label == this.productMobileValue) {
            paramsObj.productId = productItem.value;
          }
        });
      }

      if (this.salesmanMobileValue != "请选择") {
        let salesmanArr;
        if (this.salesmanMobileValue.length > 1) {
          salesmanArr = this.salesmanMobileValue.split(",");
          salesmanArr.forEach(salesmanItem => {
            this.salemanOptions.forEach(optionItem => {
              if (salesmanItem == optionItem.label) {
                uids.push(optionItem.value);
              }
            });
          });
        } else {
          this.salemanOptions.forEach(optionItem => {
            if (optionItem.label == this.salesmanMobileValue) {
              uids.push(optionItem.value);
            }
          });
        }
      }

      if (this.repeatOrderMobileValue != "请选择") {
        this.repeatOrderMobileValue == "重单"
          ? (paramsObj.isRepeat = 1)
          : (paramsObj.isRepeat = 0);
      }

      if (this.usefulMobileValue != "请选择") {
        this.usefulMobileValue == "有效单"
          ? (paramsObj.mode = 1)
          : (paramsObj.mode = 0);
      }
      if (this.exportJDMobileValue != "请选择") {
        this.exportJDMobileValue == "已导入"
          ? (paramsObj.isImport = 1)
          : (paramsObj.isImport = 0);
      }

      if (this.repeatNamePhoneMobileValue != "请选择") {
        this.repeatNamePhoneMobileValue == "重复"
          ? (paramsObj.isNameRepeat = 1)
          : (paramsObj.isNameRepeat = 0);
      }

      this.minIdMobileValue ? (paramsObj.id = this.minIdMobileValue) : "";
      this.maxIdMobileValue ? (paramsObj.idEnd = this.maxIdMobileValue) : "";
      this.nameMobileValue ? (paramsObj.name = this.nameMobileValue) : "";
      this.phoneMobileValue
        ? (paramsObj.telephone = this.phoneMobileValue)
        : "";
      this.minPriceMobileValue
        ? (paramsObj.totalCost = this.minPriceMobileValue)
        : "";
      this.maxPriceMobileValue
        ? (paramsObj.totalCostEnd = this.maxPriceMobileValue)
        : "";
      if (this.category == "tt") {
        this.pageInfoMobileValue != "请选择"
          ? (paramsObj.pageInfo = this.pageInfoMobileValue)
          : "";
      } else {
        this.pageInfoMobileValue
          ? (paramsObj.pageInfo = this.pageInfoMobileValue)
          : "";
      }
      this.accountMobileValue != "请选择" ? (paramsObj.text = this.accountMobileValue) : "";
      if (uids.length > 0) {
        paramsObj.uids = uids.join(",");
      }
      getToutiaoOrderList(this.category, paramsObj)
        .then(res => {
          this.listTotal = res.data.total;
          this.list = res.data.rows;
          this.listLoading = false;
          this.$refs.orderTable.bodyWrapper.scrollTop = 0;
        })
        .catch(error => {
          this.listLoading = false;
          this.$message.error("获取数据时出错");
        });
    },
    // 合计
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "合计";
          return;
        }
        const values = data.map(item => Number(item[column.property]));
        if (this.category == "tt") {
          if (index === 7 || index === 8) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
          }
        } else {
          if (index === 7 || index === 6) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
          }
        }
      });
      return sums;
    },
    // 更改背景色
    mobileCellClassName({ row, column, rowIndex, columnIndex }) {
      if (column.property === "name") {
        if (row.repeatName == "1") {
          return "col-red";
        }
      }
      if (column.property === "telephone") {
        if (row.repeatTelephone == "1") {
          return "col-red";
        }
      }
    },
    // 分页器
    handlePageChange() {
      this.getMobileList();
    },
    // 点击搜索
    handleSearchMobile() {
      if (!this.mobileSearchShow) {
        this.mobileSearchShow = true;
      }
    },
    // 取消搜索
    handleSearchMobileCancel() {
      if (this.mobileSearchShow) {
        this.mobileSearchShow = false;
      }
    },
    // 清空所选
    handleSearchMobileClearAll() {
      this.timePickerStartValue == "请选择"
        ? ""
        : (this.timePickerStartValue = "请选择"),
        this.timePickerEndValue == "请选择"
          ? ""
          : (this.timePickerEndValue = "请选择"),
        this.salesmanMobileValue == "请选择"
          ? ""
          : (this.salesmanMobileValue = "请选择"),
        this.channelMobileValue == "请选择"
          ? ""
          : (this.accountMobileValue = "请选择"),
        this.accountMobileValue == "请选择"
          ? ""
          : (this.productMobileValue = "请选择"),
        this.usefulMobileValue == "请选择"
          ? ""
          : (this.usefulMobileValue = "请选择"),
        this.repeatOrderMobileValue == "请选择"
          ? ""
          : (this.repeatOrderMobileValue = "请选择"),
        this.repeatNamePhoneMobileValue == "请选择"
          ? ""
          : (this.repeatNamePhoneMobileValue = "请选择"),
        this.exportJDMobileValue == "请选择"
          ? ""
          : (this.exportJDMobileValue = "请选择"),
        this.nameMobileValue == "" ? "" : (this.nameMobileValue = ""),
        this.pageInfoMobileValue == "" ? "" : (this.pageInfoMobileValue = ""),
        this.phoneMobileValue == "" ? "" : (this.phoneMobileValue = ""),
        this.maxIdMobileValue == "" ? "" : (this.maxIdMobileValue = ""),
        this.minIdMobileValue == "" ? "" : (this.minIdMobileValue = ""),
        this.maxPriceMobileValue == "" ? "" : (this.maxPriceMobileValue = ""),
        this.minPriceMobileValue == "" ? "" : (this.minPriceMobileValue = "");
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
    datetimePickerChange(e) {},
    // 确认选择日期
    datetimePickerConfirm(res) {
      if (this.mobileDatePickerShow) {
        if (this.datetimePickerType == "start") {
          this.timePickerStartValue = res.toLocaleDateString();
        } else {
          this.timePickerEndValue = res.toLocaleDateString();
        }
        this.getProductListMobile();
        if (this.category == "tt") {
          this.getPageInfoListMobile();
        }
        this.mobileDatePickerShow = !this.mobileDatePickerShow;
      }
    },
    // 取消选择日期
    datetimePickerCancel() {
      this.mobileDatePickerShow = !this.mobileDatePickerShow;
    },
    // 选择业务员
    handleChooseSalesman() {
      if (!this.mobileSalesmanPickerShow) {
        this.mobileSalesmanPickerShow = !this.mobileSalesmanPickerShow;
      }
    },
    getProductListMobile() {
      let timeStartValue = "";
      let timeEndValue = "";
      let productId = "";
      let uids = [];
      let repeatOrder = "";
      let usefulOrder = "";

      this.timePickerStartValue == "请选择"
        ? (timeStartValue = "")
        : (timeStartValue = this.timePickerStartValue.replace(/\//g, "-"));
      this.timePickerEndValue == "请选择"
        ? (timeEndValue = "")
        : (timeEndValue = this.timePickerEndValue.replace(/\//g, "-"));
      if (this.productMobileValue != "请选择") {
        this.productOptions.forEach(productItem => {
          if (productItem.label == this.productMobileValue) {
            productId = productItem.value;
          }
        });
      } else {
        productId = "";
      }

      if (this.salesmanMobileValue != "请选择") {
        let salesmanArr;
        if (this.salesmanMobileValue.length > 1) {
          salesmanArr = this.salesmanMobileValue.split(",");
          salesmanArr.forEach(salesmanItem => {
            this.salemanOptions.forEach(optionItem => {
              if (salesmanItem == optionItem.label) {
                uids.push(optionItem.value);
              }
            });
          });
        } else {
          this.salemanOptions.forEach(optionItem => {
            if (optionItem.label == this.salesmanMobileValue) {
              uids.push(optionItem.value);
            }
          });
        }
      }

      if (this.repeatOrderMobileValue != "请选择") {
        this.repeatOrderMobileValue == "重单"
          ? (repeatOrder = 1)
          : (repeatOrder = 0);
      } else {
        repeatOrder = "";
      }

      if (this.usefulMobileValue != "请选择") {
        this.usefulMobileValue == "有效单"
          ? (usefulOrder = 1)
          : (usefulOrder = 0);
      } else {
        usefulOrder = "";
      }

      let searchList = [];
      let paramsObj = {
        channel: this.category
      };
      timeStartValue ? (paramsObj.createTime = timeStartValue) : "";
      timeEndValue ? (paramsObj.createTimeEnd = timeEndValue) : "";
      this.channelValue ? (paramsObj.cid = this.channelValue) : "";
      this.minIdMobileValue ? (paramsObj.id = this.minIdMobileValue) : "";
      this.maxIdMobileValue ? (paramsObj.idEnd = this.maxIdMobileValue) : "";
      repeatOrder ? (paramsObj.isRepeat = repeatOrder) : "";
      usefulOrder ? (paramsObj.mode = usefulOrder) : "";
      this.nameMobileValue ? (paramsObj.name = this.nameMobileValue) : "";
      productId ? paramsObj.productId : "";
      this.phoneMobileValue
        ? (paramsObj.telephone = this.phoneMobileValue)
        : "";
      this.minPriceMobileValue
        ? (paramsObj.totalCost = this.minPriceMobileValue)
        : "";
      this.maxPriceMobileValue
        ? (paramsObj.totalCostEnd = this.maxPriceMobileValue)
        : "";
      this.pageInfoMobileValue
        ? (paramsObj.pageInfo = this.pageInfoMobileValue)
        : "";
      if (uids.length > 0) {
        paramsObj.uids = uids.join(",");
      }
      getProductSelectList(paramsObj, this.category).then(res => {
        const tableList = res.data;
        let productList = [];
        let optionList = [];
        tableList.forEach(tableItem => {
          const { id, name } = tableItem;
          productList.push(name);
          optionList.push({ label: name, value: id });
        });
        this.productColumns = productList;
        this.productOptions = optionList;
      });
    },
    // 选择产品
    handleChooseProduct() {
      this.mobileProductPickerShow = !this.mobileProductPickerShow;
    },
    getPageInfoListMobile() {
      let timeStartValue = "";
      let timeEndValue = "";
      let productId = "";
      let uids = [];
      let repeatOrder = "";
      let usefulOrder = "";

      this.timePickerStartValue == "请选择"
        ? (timeStartValue = "")
        : (timeStartValue = this.timePickerStartValue.replace(/\//g, "-"));
      this.timePickerEndValue == "请选择"
        ? (timeEndValue = "")
        : (timeEndValue = this.timePickerEndValue.replace(/\//g, "-"));
      if (this.productMobileValue != "请选择") {
        this.productOptions.forEach(productItem => {
          if (productItem.label == this.productMobileValue) {
            productId = productItem.value;
          }
        });
      } else {
        productId = "";
      }

      if (this.salesmanMobileValue != "请选择") {
        let salesmanArr;
        if (this.salesmanMobileValue.length > 1) {
          salesmanArr = this.salesmanMobileValue.split(",");
          salesmanArr.forEach(salesmanItem => {
            this.salemanOptions.forEach(optionItem => {
              if (salesmanItem == optionItem.label) {
                uids.push(optionItem.value);
              }
            });
          });
        } else {
          this.salemanOptions.forEach(optionItem => {
            if (optionItem.label == this.salesmanMobileValue) {
              uids.push(optionItem.value);
            }
          });
        }
      }

      if (this.repeatOrderMobileValue != "请选择") {
        this.repeatOrderMobileValue == "重单"
          ? (repeatOrder = 1)
          : (repeatOrder = 0);
      } else {
        repeatOrder = "";
      }

      if (this.usefulMobileValue != "请选择") {
        this.usefulMobileValue == "有效单"
          ? (usefulOrder = 1)
          : (usefulOrder = 0);
      } else {
        usefulOrder = "";
      }

      let searchList = [];
      let paramsObj = {};
      timeStartValue ? (paramsObj.createTime = timeStartValue) : "";
      timeEndValue ? (paramsObj.createTimeEnd = timeEndValue) : "";
      this.channelValue ? (paramsObj.cid = this.channelValue) : "";
      this.minIdMobileValue ? (paramsObj.id = this.minIdMobileValue) : "";
      this.maxIdMobileValue ? (paramsObj.idEnd = this.maxIdMobileValue) : "";
      repeatOrder ? (paramsObj.isRepeat = repeatOrder) : "";
      usefulOrder ? (paramsObj.mode = usefulOrder) : "";
      this.nameMobileValue ? (paramsObj.name = this.nameMobileValue) : "";
      productId ? paramsObj.productId : "";
      this.phoneMobileValue
        ? (paramsObj.telephone = this.phoneMobileValue)
        : "";
      this.minPriceMobileValue
        ? (paramsObj.totalCost = this.minPriceMobileValue)
        : "";
      this.maxPriceMobileValue
        ? (paramsObj.totalCostEnd = this.maxPriceMobileValue)
        : "";
      this.pageInfoMobileValue
        ? (paramsObj.pageInfo = this.pageInfoMobileValue)
        : "";
      if (uids.length > 0) {
        paramsObj.uids = uids.join(",");
      }
      getPageInfoList(paramsObj).then(res => {
        console.log(res);
        const tableList = res.data;
        let pageInfoList = [];
        let optionList = [];
        tableList.forEach(tableItem => {
          const { pageInfo } = tableItem;
          pageInfoList.push(pageInfo);
          optionList.push({ label: pageInfo, value: pageInfo });
        });
        this.pageInfoColumns = pageInfoList;
        this.pageInfoOptions = optionList;
      });
    },
    // 选择套餐属性
    handleChoosePageInfo() {
      this.mobilePageInfoPickerShow = !this.mobilePageInfoPickerShow;
    },
    // 选择账户
    handleChooseAccount() {
      if (!this.mobileAccountPickerShow) {
        this.mobileAccountPickerShow = !this.mobileAccountPickerShow;
      }
    },
    // 选择是否有效
    handleChooseIsUseful() {
      if (!this.mobileUsefulPickerShow) {
        this.mobileUsefulPickerShow = !this.mobileUsefulPickerShow;
      }
    },
    // 选择是否重单
    handleChooseIsRepeatOrder() {
      if (!this.mobileRepeatOrderPickerShow) {
        this.mobileRepeatOrderPickerShow = !this.mobileRepeatOrderPickerShow;
      }
    },
    // 选择是否重复电话姓名
    handleChooseIsRepeatPhoneName() {
      if (!this.mobileRepeatNamePhonePickerShow) {
        this.mobileRepeatNamePhonePickerShow = !this
          .mobileRepeatNamePhonePickerShow;
      }
    },
    // 选择是否导入京东
    handleChooseExportJD() {
      if (!this.mobileExportJDPickerShow) {
        this.mobileExportJDPickerShow = !this.mobileExportJDPickerShow;
      }
    },
    // 确认选择业务员
    salesmanPickerConfirm(res) {
      if (this.mobileSalesmanPickerShow) {
        if (this.salesmanMobileValue == "请选择") {
          this.salesmanMobileValue = res;
        } else {
          if (this.salesmanMobileValue.indexOf(",") != -1) {
            let salesmanArr = new Array();
            salesmanArr = this.salesmanMobileValue.split(",");
            if (salesmanArr.indexOf(res) == -1) {
              this.salesmanMobileValue = this.salesmanMobileValue + "," + res;
            } else {
              Toast("请勿重复选择");
            }
          } else {
            if (this.salesmanMobileValue != res) {
              this.salesmanMobileValue = this.salesmanMobileValue + "," + res;
            } else {
              Toast("请勿重复选择");
            }
          }
        }
        this.getProductListMobile();
        if (this.category == "tt") {
          this.getPageInfoListMobile();
        }
        this.mobileSalesmanPickerShow = !this.mobileSalesmanPickerShow;
      }
    },
    // 确认选择账户
    accountPickerConfirm(res) {
      if (this.mobileAccountPickerShow) {
        this.accountMobileValue = res;
        this.mobileAccountPickerShow = !this.mobileAccountPickerShow;
      }
    },
    // 确认选择产品
    productPickerConfirm(res) {
      if (this.mobileProductPickerShow) {
        this.productMobileValue = res;
        this.mobileProductPickerShow = !this.mobileProductPickerShow;
      }
    },
    // 确认选择套餐属性
    pageInfoPickerConfirm(res) {
      if (this.mobilePageInfoPickerShow) {
        this.pageInfoMobileValue = res;
        this.mobilePageInfoPickerShow = !this.mobilePageInfoPickerShow;
      }
    },
    // 确认选择是否有效
    usefulPickerConfirm(res) {
      if (this.mobileUsefulPickerShow) {
        this.usefulMobileValue = res;
        this.mobileUsefulPickerShow = !this.mobileUsefulPickerShow;
      }
    },
    // 确认选择是否重单
    repeatOrderPickerConfirm(res) {
      if (this.mobileRepeatOrderPickerShow) {
        this.repeatOrderMobileValue = res;
        this.mobileRepeatOrderPickerShow = !this.mobileRepeatOrderPickerShow;
      }
    },
    // 确认选择是否重复电话姓名
    repeatNamePhonePickerConfirm(res) {
      if (this.mobileRepeatNamePhonePickerShow) {
        this.repeatNamePhoneMobileValue = res;
        this.mobileRepeatNamePhonePickerShow = !this
          .mobileRepeatNamePhonePickerShow;
      }
    },
    // 确认选择是否导入京东
    exportJDPickerConfirm(res) {
      if (this.mobileExportJDPickerShow) {
        this.exportJDMobileValue = res;
        this.mobileExportJDPickerShow = !this.mobileExportJDPickerShow;
      }
    },
    // 导入京东方式
    mobileExportJDSelect(item) {
      this.mobileExportJDDialogShow = false;
      Toast.success(item.name + "成功");
    },
    // 取消导入京东
    mobileExportJDCancel() {},
    // 业务员快捷搜索
    handleSearchSalesmanItem() {
      this.salesPickerCurrentSelect = this.salesmanColumns.indexOf(
        this.salesmanSearchValue
      );
    },
    // 账户快捷搜索
    handleSearchAccountItem() {
      this.accountPickerCurrentSelect = this.accountColumns.indexOf(
        this.accountSearchValue
      );
    },
    // 产品快捷搜索
    handleSearchProductItem() {
      this.productPickerCurrentSelect = this.productColumns.indexOf(
        this.productSearchValue
      );
    },
    // 套餐属性快捷搜索
    handleSearchPageInfoItem() {
      this.pageInfoPickerCurrentSelect = this.pageInfoColumns.indexOf(
        this.pageInfoSearchValue
      );
    },
    // 开始搜索
    handleMobileSearch() {
      this.mobileSearchButtonLoading = true;
      this.getMobileList();
      this.mobileSearchButtonLoading = false;
      this.mobileSearchShow = false;
    },
    // 限制页面跳转输入框只能输入数字
    jumpPageInput() {
      this.pageJumpIndex = this.pageJumpIndex.replace(/[^\d]/g, "");
    },
    // 跳转指定页面
    handleJumpPage() {
      let jumpPage = parseInt(this.pageJumpIndex);
      if (jumpPage == this.mobileCurrentPage) return;
      if (jumpPage > Math.ceil(this.listTotal / 50)) {
        jumpPage = Math.ceil(this.listTotal / 50);
      }
      if (jumpPage < 1) {
        jumpPage = 1;
      }
      this.pageJumpIndex = jumpPage;
      this.mobileCurrentPage = jumpPage;
      this.getMobileList();
    },
    // 刷新
    handleRefreshMobile() {
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
  width: 130px;
  padding: 5px 0;
}
.select-input {
  width: 193px;
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
