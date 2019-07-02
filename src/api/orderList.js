import request from '@/utils/request'

/* 外链订单 */

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

/* 公共部分 */

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

/* 腾讯订单 */

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

/* 头条 趣头条 */

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
    data
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

/* 综合 */

// 百度页面管理
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

