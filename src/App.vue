<template>
  <div id="app">
    <transition>
      <router-view class="app-router-view" />
    </transition>
  </div>
</template>

<script>
import "vue-transition.css";
export default {
  name: "App"
};
</script>
<style>
.app .app-router-view {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  overflow: hidden;
  backface-visibility: hidden;
  transform: translate3d(0, 0, 0);
  transform-style: preserve-3d;
  visibility: visible;
}

.mobile-pagejump input {
  border: 1px solid #e5e5e5;
}

.vxe-body--column.col-red {
  background-color: red;
  color: #fff;
}

.el-table__body-wrapper .el-table__body .el-table__row .col-red {
  background-color: red;
  color: #fff;
}
.el-date-editor--daterange.el-input,
.el-date-editor--daterange.el-input__inner,
.el-date-editor--timerange.el-input,
.el-date-editor--timerange.el-input__inner {
  width: 250px !important;
}
.el-date-editor .el-range-separator {
  width: 10% !important;
}
.app-container .el-input__inner {
  border: 1px solid #808080 !important;
}
.app-container input::-webkit-input-placeholder {
  color: #808080 !important;
}
.vxe-checkbox.is--indeterminate > input + .checkbox--icon:before {
  right: 0;
}
.app-container {
  user-select: none;
}
.vxe-table.show--foot.scroll--x .vxe-table--body-wrapper{
  overflow-x:hidden!important;
  margin-bottom: 18px;
}
.vxe-table--body-wrapper, .vxe-table--fixed-left-body-wrapper, .vxe-table--fixed-right-body-wrapper{
  overflow-x: hidden!important;
}
</style>
