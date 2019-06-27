import request from '@/utils/request'

/* 外链订单 */

// 获取手表订单列表
export function getOuterChainOrderWatch(data) {
  return request({
    url: '/admin/watch/order',
    method: 'post',
    data
  })
}

// 修改手表订单信息
export function editOuterChainOrderWatch(data) {
  return request({
    url: '/admin/watch/order/update',
    method: 'post',
    data
  })
}

// 地区统计
export function getAreaStatisticsWatch(data) {
  return request({
    url: '/admin/watch/region',
    method: 'post',
    data
  })
}

// 渠道统计
export function getChannelStatisticsWatch(data) {
  return request({
    url: 'admin/watch/channel',
    method: 'post',
    data
  })
}

// 渠道时段统计
export function getChannelTimeslotWatch(data) {
  return request({
    url: 'admin/watch/time',
    method: 'post',
    data
  })
}

// 时段统计
export function getTimeslotStatisticsWatch(data) {
  return request({
    url: 'admin/watch/time',
    method: 'post',
    data
  })
}

// 驱蚊器
export function getOuterChainOrderRepellent() {
  return request({
    url: '/admin/repellent/order',
    method: 'post'
  })
}

// 地区统计
export function getAreaStatisticsRepellent() {
  return request({
    url: '/admin/repellent/region',
    method: 'post'
  })
}

// 渠道统计
export function getChannelStatisticsRepellent() {
  return request({
    url: 'admin/repellent/channel',
    method: 'post'
  })
}

// 时段统计
export function getTimeslotStatisticsRepellent() {
  return request({
    url: 'admin/repellent/time',
    method: 'post'
  })
}

// 暖风机
export function getOuterChainOrderHeater() {
  return request({
    url: '/admin/heater/order',
    method: 'post'
  })
}

// 地区统计
export function getAreaStatisticsHeater() {
  return request({
    url: '/admin/heater/region',
    method: 'post'
  })
}

// 渠道统计
export function getChannelStatisticsHeater() {
  return request({
    url: 'admin/heater/channel',
    method: 'post'
  })
}

// 时段统计
export function getTimeslotStatisticsHeater() {
  return request({
    url: 'admin/heater/time',
    method: 'post'
  })
}

// 服饰
export function getOuterChainOrderClothes() {
  return request({
    url: '/admin/clothes/order',
    method: 'post'
  })
}

// 地区统计
export function getAreaStatisticsClothes() {
  return request({
    url: '/admin/clothes/region',
    method: 'post'
  })
}

// 渠道统计
export function getChannelStatisticsClothes() {
  return request({
    url: 'admin/clothes/channel',
    method: 'post'
  })
}

// 时段统计
export function getTimeslotStatisticsClothes() {
  return request({
    url: 'admin/clothes/time',
    method: 'post'
  })
}

// 茶叶
export function getOuterChainOrderTea() {
  return request({
    url: '/admin/tea/order',
    method: 'post'
  })
}

// 地区统计
export function getAreaStatisticsTea() {
  return request({
    url: '/admin/tea/region',
    method: 'post'
  })
}

// 渠道统计
export function getChannelStatisticsTea() {
  return request({
    url: 'admin/tea/channel',
    method: 'post'
  })
}

// 时段统计
export function getTimeslotStatisticsTea() {
  return request({
    url: 'admin/tea/time',
    method: 'post'
  })
}

// 望远镜
export function getOuterChainOrderTelescope() {
  return request({
    url: '/admin/telescope/order',
    method: 'post'
  })
}

// 地区统计
export function getAreaStatisticsTelescope() {
  return request({
    url: '/admin/telescope/region',
    method: 'post'
  })
}

// 渠道统计
export function getChannelStatisticsTelescope() {
  return request({
    url: 'admin/telescope/channel',
    method: 'post'
  })
}

// 时段统计
export function getTimeslotStatisticsTelescope() {
  return request({
    url: 'admin/telescope/time',
    method: 'post'
  })
}

// 剃须刀
export function getOuterChainOrderShaver() {
  return request({
    url: '/admin/shaver/order',
    method: 'post'
  })
}

// 地区统计
export function getAreaStatisticsShaver() {
  return request({
    url: '/admin/shaver/region',
    method: 'post'
  })
}

// 渠道统计
export function getChannelStatisticsShaver() {
  return request({
    url: 'admin/shaver/channel',
    method: 'post'
  })
}

// 时段统计
export function getTimeslotStatisticsShaver() {
  return request({
    url: 'admin/shaver/time',
    method: 'post'
  })
}

// 手环
export function getOuterChainOrderIgbracelet() {
  return request({
    url: '/admin/igbracelet/order',
    method: 'post'
  })
}

// 地区统计
export function getAreaStatisticsIgbracelet() {
  return request({
    url: '/admin/igbracelet/region',
    method: 'post'
  })
}

// 渠道统计
export function getChannelStatisticsIgbracelet() {
  return request({
    url: 'admin/igbracelet/channel',
    method: 'post'
  })
}

// 时段统计
export function getTimeslotStatisticsIgbracelet() {
  return request({
    url: 'admin/igbracelet/time',
    method: 'post'
  })
}

// 化妆品
export function getOuterChainOrderCosmetic() {
  return request({
    url: '/admin/cosmetic/order',
    method: 'post'
  })
}

// 地区统计
export function getAreaStatisticsCosmetic() {
  return request({
    url: '/admin/cosmetic/region',
    method: 'post'
  })
}

// 渠道统计
export function getChannelStatisticsCosmetic() {
  return request({
    url: 'admin/cosmetic/channel',
    method: 'post'
  })
}

// 时段统计
export function getTimeslotStatisticsCosmetic() {
  return request({
    url: 'admin/cosmetic/time',
    method: 'post'
  })
}

// 临时
export function getOuterChainOrderTemporary() {
  return request({
    url: '/admin/temporary/order',
    method: 'post'
  })
}

// 地区统计
export function getAreaStatisticsTemporary() {
  return request({
    url: '/admin/temporary/region',
    method: 'post'
  })
}

// 渠道统计
export function getChannelStatisticsTemporary() {
  return request({
    url: 'admin/temporary/channel',
    method: 'post'
  })
}

// 时段统计
export function getTimeslotStatisticsTemporary() {
  return request({
    url: 'admin/temporary/time',
    method: 'post'
  })
}

// 内裤
export function getOuterChainOrderBriefs() {
  return request({
    url: '/admin/briefs/order',
    method: 'post'
  })
}

// 地区统计
export function getAreaStatisticsBriefs() {
  return request({
    url: '/admin/briefs/region',
    method: 'post'
  })
}

// 渠道统计
export function getChannelStatisticsBriefs() {
  return request({
    url: 'admin/briefs/channel',
    method: 'post'
  })
}

// 时段统计
export function getTimeslotStatisticsBriefs() {
  return request({
    url: 'admin/briefs/time',
    method: 'post'
  })
}

// 业务员下拉菜单
export function getSalesmanList() {
  return request({
    url: '/admin/user/idAndName',
    method: 'post'
  })
}

// 渠道下拉菜单
export function getChannelList() {
  return request({
    url: '/admin/composite/channel/parent',
    method: 'post'
  })
}

// 产品下拉菜单
export function getProductList() {
  return request({
    url: '/admin/composite/product/list',
    method: 'post'
  })
}

// 规格下拉菜单
export function getColorList() {
  return request({
    url: '/admin/composite/color/list',
    method: 'post'
  })
}

/* 腾讯订单 */

// 订单列表
export function getTencentOrderList() {
  return request({
    url: '/admin/tencent/order',
    method: 'post'
  })
}

/* 头条订单 */

// 订单列表
export function getToutiaoOrderList() {
  return request({
    url: '/admin/tt/order',
    method: 'post'
  })
}

// 地区统计
export function getToutiaoAreaStatistics() {
  return request({
    url: '/admin/tt/region',
    method: 'post'
  })
}

// 渠道统计
export function getToutiaoChannelStatistics() {
  return request({
    url: '/admin/tt/channel',
    method: 'post'
  })
}

// 时段统计
export function getToutiaoTimeslotStatistics() {
  return request({
    url: '/admin/tt/time',
    method: 'post'
  })
}

/* 趣头条订单 */

// 订单列表
export function getQutoutiaoOrderList() {
  return request({
    url: '/admin/qtt/order',
    method: 'post'
  })
}
