import request from "@/config/request.js";

export function getLists(params) {
  return request({
    url: "/store/api/store/order/store/pay/list",
    method: "get",
    params,
  });
}
export function getStoreLists(params) {
  return request({
    url: "/store/api/store/list",
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

//根据兑换码查询待核销的订单

export function confirmOrderNo(params) {
  return request({
    url: `/store/api/store/order/store/pay/confirm/${params.storeId}/${params.pickupNo}`,
    method: "get",
  });
}

//查询商家收款订单详细信息
export function checkNoDetail(orderId) {
  return request({
    url: `/store/api/store/order/store/pay/${orderId}`,
    method: "get",
  });
}

//获取台号列表
export function getDeskList(params) {
  return request({
    url: "/store/api/store/table/list",
    method: "get",
    params,
  });
}

// 核销待兑换的订单
export function waitToChekOrder(data) {
  return request({
    url: "/store/api/store/order/store/pay/confirm",
    method: "post",
    data,
  });
}
// 打单时更新订单（准备好可以分账）状态 普通打单
export function normalCheckOrder(data) {
  return request({
    url: "/store/api/store/order/store/pay/print",
    method: "post",
    data,
  });
}
