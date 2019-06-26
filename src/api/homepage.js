import request from '@/utils/request'

// 超时订单
export function getOrderStatus() {
  return request({
    url: '/main/common/order/operating/time',
    method: 'post'
  })
}

// 订单
export function getOrderCount() {
  return request({
    url: '/main/common/order/count',
    method: 'post'
  })
}

// 曲线图
export function getEchartData() {
  return request({
    url: '/main/common/today',
    method: 'post'
  })
}
