import request from "@/config/request.js";

export function getLists(params) {
  return request({
    url: "/store/api/store/order/store/pay/list",
    method: "get",
    params,
  });
}

// 订单详情
export function checkOrderDetail(orderId) {
  return request({
    url: `/store/api/store/order/store/pay/${orderId}`,
    method: "get",
  });
}

