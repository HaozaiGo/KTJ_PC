import request from "@/config/request.js";

export function getLists(params) {
  return request({
    url: "/api/bill/order/store/pay/list",
    method: "get",
    params,
  });
}

// 订单详情
export function checkOrderDetail(orderId) {
  return request({
    url: `/api/bill/order/store/pay/${orderId}`,
    method: "get",
  });
}
// 获取订单更新状态
export function checkInfo(orderId) {
  return request({
    url: `/api/bill/order/store/pay/${orderId}`,
    method: "post",
  });
}

