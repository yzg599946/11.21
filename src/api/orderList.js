import request from '@/utils/request'

/* 外链订单 start */

// 获取订单列表
export function getOuterChainOrder(category, data) {
  return request({
    url: `/admin/${category}/order`,
    method: 'post',
    data
  })
}

// 修改订单信息
export function editOuterChainOrder(category, data) {
  return request({
    url: `/admin/${category}/order/update`,
    method: 'post',
    data
  })
}

// 导出excel表格
export function exportOuterChainExcel(category, data) {
  return request({
    url: `/admin/${category}/outExcel`,
    method: 'post',
    data,
    responseType: 'blob'
  })
}

// 导入京东
export function importJD(category, data) {
  return request({
    url: `/admin/${category}/jd/import`,
    method: 'post',
    data
  })
}

// 修改是否可用状态
export function editOuterChainUsefulStatus(category, data) {
  return request({
    url: `/admin/${category}/mode`,
    method: 'post',
    data
  })
}

// 地区统计
export function getOuterChainAreaStatistics(category, data) {
  return request({
    url: `/admin/${category}/region`,
    method: 'post',
    data
  })
}

// 渠道统计
export function getOuterChainChannelStatistics(category, data) {
  return request({
    url: `admin/${category}/channel`,
    method: 'post',
    data
  })
}

// 时段统计
export function getOuterChainTimeslotStatistics(category, data) {
  return request({
    url: `admin/${category}/time`,
    method: 'post',
    data
  })
}

/* 外链订单 end */

/* 公共部分 start */

// 业务员下拉菜单
export function getSalesmanList(data) {
  return request({
    url: '/admin/user/idAndName',
    method: 'post',
    data
  })
}

// 渠道下拉菜单
export function getChannelList(data) {
  return request({
    url: '/admin/composite/channel/parent',
    method: 'post',
    data
  })
}

// 产品下拉菜单
export function getProductList(data) {
  return request({
    url: '/admin/composite/product/list',
    method: 'post',
    data
  })
}

// 规格下拉菜单
export function getColorList(data) {
  return request({
    url: '/admin/composite/color/list',
    method: 'post',
    data
  })
}

/* 公共部分 end */

/* 腾讯订单 start */

// 订单列表
export function getTencentOrderList(data) {
  return request({
    url: '/admin/tencent/order',
    method: 'post',
    data
  })
}

// 导出表格
export function exportTencentExcel(category, data) {
  return request({
    url: `/admin/tencent/${category}/outExcel`,
    method: 'post',
    data
  })
}

// 修改订单信息
export function editTencentOrder(data) {
  return request({
    url: '/admin/tencent/order/update',
    method: 'post',
    data
  })
}

// 修改可用状态
export function editUsefulTencent(data) {
  return request({
    url: '/admin/tencent/mode',
    method: 'post',
    data
  })
}

/* 腾讯订单 end */

/* 头条 趣头条 start */

// 订单列表
export function getToutiaoOrderList(category, data) {
  return request({
    url: `/admin/${category}/order`,
    method: 'post',
    data
  })
}

// 导出表格
export function exportToutiaoExcel(category, data) {
  return request({
    url: `/admin/${category}/outExcel`,
    method: 'post',
    data,
    responseType: 'blob'
  })
}

// 修改是否可用状态
export function editToutiaoUseful(category, data) {
  return request({
    url: `/admin/${category}/mode`,
    method: 'post',
    data
  })
}

// 修改订单
export function editToutiaoOrder(category, data) {
  return request({
    url: `/admin/${category}/order/update`,
    method: 'post',
    data
  })
}

// 地区统计
export function getToutiaoAreaStatistics(data) {
  return request({
    url: '/admin/tt/region',
    method: 'post',
    data
  })
}

// 渠道统计
export function getToutiaoChannelStatistics(data) {
  return request({
    url: '/admin/tt/channel',
    method: 'post',
    data
  })
}

// 时段统计
export function getToutiaoTimeslotStatistics(data) {
  return request({
    url: '/admin/tt/time',
    method: 'post',
    data
  })
}

/* 头条 趣头条 end */

/* 综合管理 start */

// 获取百度页面
export function getBaiduPage(data) {
  return request({
    url: '/admin/composite/bdpage/list',
    method: 'post',
    data
  })
}

// 新增百度页面
export function addBaiduPage(data) {
  return request({
    url: '/admin/composite/bdpage/insert',
    method: 'post',
    data
  })
}

// 获取所有渠道
export function getAllChannelList(data) {
  return request({
    url: '/admin/composite/channel',
    method: 'post',
    data
  })
}

// 新增渠道
export function addChannel(data) {
  return request({
    url: '/admin/composite/channel/insert',
    method: 'post',
    data
  })
}

// 更新渠道
export function updateChannel(data) {
  return request({
    url: '/admin/composite/channel/update',
    method: 'post',
    data
  })
}

// 删除渠道
export function deleteChannel(data) {
  return request({
    url: '/admin/composite/channel/delete',
    method: 'post',
    data
  })
}

// 批量删除渠道
export function deleteSelectChannel(data) {
  return request({
    url: '/admin/composite/channel/deleteBatch',
    method: 'post',
    data
  })
}

// 获取所有颜色
export function getAllColorList(data) {
  return request({
    url: '/admin/composite/color',
    method: 'post',
    data
  })
}

// 新增颜色
export function addColor(data) {
  return request({
    url: '/admin/composite/color/insert',
    method: 'post',
    data
  })
}

// 更新颜色
export function updateColor(data) {
  return request({
    url: '/admin/composite/color/update',
    method: 'post',
    data
  })
}

// 删除颜色
export function deleteColor(data) {
  return request({
    url: '/admin/composite/color/delete',
    method: 'post',
    data
  })
}

// 批量删除颜色
export function deleteSelectColor(data) {
  return request({
    url: '/composite/color/deleteBatch',
    method: 'post',
    data
  })
}

// 获取所有产品
export function getAllProductList(data) {
  return request({
    url: '/admin/composite/product',
    method: 'post',
    data
  })
}

// 新增产品
export function addProduct(data) {
  return request({
    url: '/admin/composite/product/insert',
    method: 'post',
    data
  })
}

// 更新产品
export function updateProduct(data) {
  return request({
    url: '/admin/composite/product/update',
    method: 'post',
    data
  })
}

// 删除产品
export function deleteProduct(data) {
  return request({
    url: '/admin/composite/product/delete',
    method: 'post',
    data
  })
}

// 批量删除产品
export function deleteSelectProduct(data) {
  return request({
    url: '/admin/composite/product/deleteBatch',
    method: 'post',
    data
  })
}

/* 综合管理 end */

/* 订单总管理 start */

// 获取所有订单
export function getAllOrderList(data) {
  return request({
    url: '/admin/order/list',
    method: 'post',
    data
  })
}

// 获取订单渠道
export function getAllOrderChannel(data) {
  return request({
    url: '/admin/order/channel',
    method: 'post',
    data
  })
}

/* 订单总管理 end */

/* 系统管理 start */

// 登陆日记
export function getLoginLog(data) {
  return request({
    url: '/admin/system/user/loginLog',
    method: 'post',
    data
  })
}

// 登陆管理
export function getCheckLoginList(data) {
  return request({
    url: '/admin/checkLoginList',
    method: 'post',
    data
  })
}

// 获取用户列表
export function getUserList(data) {
  return request({
    url: '/admin/system/user',
    method: 'post',
    data
  })
}

// 删除用户
export function deleteUser(data) {
  return request({
    url: '/admin/system/user/delete',
    method: 'post',
    data
  })
}

// 批量删除用户
export function deleteSelectUser(data) {
  return request({
    url: '/admin/system/user/deleteBatch',
    method: 'post',
    data
  })
}

// 新增用户查询
export function addUserInquire() {
  return request({
    url: '/page/admin/system/user/insert',
    method: 'get'
  })
}

// 新增用户
export function addUser(data) {
  return request({
    url: '/admin/system/user/insert',
    method: 'post',
    data
  })
}

// 更新用户查询
export function updateUserInquired(params) {
  return request({
    url: '/page/admin/system/user/update',
    method: 'get',
    params
  })
}

// 更新用户
export function updateUser(data) {
  return request({
    url: '/admin/system/user/update',
    method: 'post',
    data
  })
}

// 获取角色列表
export function getRoleList(data) {
  return request({
    url: '/admin/system/role',
    method: 'post',
    data
  })
}

// 新增角色查询
export function addRoleInquired(params) {
  return request({
    url: '/page/admin/system/role/insert',
    method: 'get',
    params
  })
}

// 新增角色
export function addRole(data) {
  return request({
    url: '/admin/system/role/insert',
    method: 'post',
    data
  })
}

// 更新角色查询
export function updateRoleInquired(params) {
  return request({
    url: '/page/admin/system/role/update',
    method: 'get',
    params
  })
}

// 更新角色
export function updateRole(data) {
  return request({
    url: '/admin/system/role/update',
    method: 'post',
    data
  })
}

// 删除角色
export function deleteRole(data) {
  return request({
    url: '/admin/system/role/delete',
    method: 'post',
    data
  })
}

// 批量删除角色
export function deleteSelectRole(data) {
  return request({
    url: '/admin/system/role/deleteBatch',
    method: 'post',
    data
  })
}

// 获取菜单列表
export function getMenuList(data) {
  return request({
    url: '/admin/system/menu',
    method: 'post',
    data
  })
}

// 更新菜单
export function updateMenu(data) {
  return request({
    url: '/admin/system/menu/edit',
    method: 'post',
    data
  })
}

// 加载所属菜单查询
export function updateMenuInquired() {
  return request({
    url: '/admin/system/menu/parent',
    method: 'post'
  })
}

// 新增菜单
export function addMenu(data) {
  return request({
    url: '/admin/system/menu/insert',
    method: 'post',
    data
  })
}

// 删除菜单
export function deleteMenu(data) {
  return request({
    url: '/admin/system/menu/delete',
    method: 'post',
    data
  })
}

// 批量删除菜单
export function deleteSelectMenu(data) {
  return request({
    url: '/admin/system/menu/deleteBatch',
    method: 'post',
    data
  })
}

// 菜单下移
export function moveDownMenu(params) {
  return request({
    url: '/admin/system/menu/move/down',
    method: 'get',
    params
  })
}

// 菜单上移
export function moveUpMenu(params) {
  return request({
    url: '/admin/system/menu/move/up',
    method: 'get',
    params
  })
}

// 生成新订单类目
export function generateMenu(data) {
  return request({
    url: '/admin/system/menu/generate',
    method: 'post',
    data
  })
}

// 产品列表
export function getMonitorProdutcList(data) {
  return request({
    url: '/admin/monitorProduct/list',
    method: 'post',
    data
  })
}

// 获取权限树状图
export function getMenuTree(data) {
  return request({
    url: '/admin/system/menu/tree',
    method: 'post',
    data
  })
}

// 获取权限菜单
export function getFunctionList(data, id) {
  return request({
    url: `/admin/system/function${id}`,
    method: 'post',
    data
  })
}

// 新增权限
export function addFunction(data) {
  return request({
    url: '/admin/system/function/insert',
    method: 'post',
    data
  })
}

// 更新权限
export function updateFunction(data) {
  return request({
    url: '/admin/system/function/update',
    method: 'post',
    data
  })
}

// 删除权限
export function deleteFunction(params) {
  return request({
    url: '/admin/system/function/delete',
    method: 'get',
    params
  })
}

// 批量删除权限
export function deleteSelectFunction(data) {
  return request({
    url: '/admin/system/function/deleteBatch',
    method: 'post',
    data
  })
}

/* 物流管理 end */

/* 物流管理 start */

// 韵达
export function getYundaLogisticsList(data) {
  return request({
    url: '/admin/logistics/yd',
    method: 'post',
    data
  })
}

// 导入韵达物流
export function importYD(data) {
  return request({
    url: '/admin/logistics/import/yd',
    method: 'post',
    data
  })
}

// 京东
export function getJingdongLogisticsList(data) {
  return request({
    url: '/admin/logistics/jd',
    method: 'post',
    data
  })
}

// 导出头条
export function exportToutiao(data, type) {
  return request({
    url: `/admin/logistics/${type}/tt/export`,
    method: 'post',
    data,
    responseType: 'blob'
  })
}

// 计算签收率
export function logisticsSigned(data) {
  return request({
    url: `/admin/logistics/jd/signed`,
    method: 'post',
    data
  })
}

// 批量查询物流状态

export function logisticslogBatch(data) {
  return request({
    url: `/admin/logistics/jd/logBatch`,
    method: 'post',
    data
  })
}

/* 物流管理 end */

/* 微信管理 start */

// 支付列表
export function getWechatPayList(data) {
  return request({
    url: '/admin/weChatMini/payList',
    method: 'post',
    data
  })
}

// 用户列表
export function getWechatUserList(data) {
  return request({
    url: '/admin/weChatMini/user/list',
    method: 'post',
    data
  })
}

// 发送消息
export function sendWechatMessage(data) {
  return request({
    url: '/page/admin/weChatMini/user/message',
    method: 'post',
    data
  })
}

/* 微信管理 end */
