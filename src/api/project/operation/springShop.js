import request from "@/config/request.js";

// 粉丝列表
export function getShopInfo(params) {
  return request({
    url: "/api/bill/small/store",
    method: "get",
    params,
  });
}

export function editInfo(data) {
  return request({
    url: "/api/bill/small/store",
    method: "post",
    data,
  });
}

// s查询平台自营商品分类列表
export function productTypeList(params) {
  return request({
    url: "/api/bill/small/store/goods/type/list",
    method: "get",
    params,
  });
}
export function editProductTypeList(data) {
  return request({
    url: "/api/bill/small/store/goods/type",
    method: "post",
    data,
  });
}

// 查询商品列表

export function productList(params) {
  return request({
    url: "/api/bill/small/store/goods/list",
    method: "get",
    params,
  });
}

//addGoodsApi

export function addGoodsApi(data) {
  return request({
    url: "/api/bill/small/store/goods",
    method: "post",
    data,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

// showBack
export function showBackGood(goodsId) {
  return request({
    url: `/api/bill/small/store/goods/${goodsId}`,
    method: "get",
  });
}

//eidt
export function editGoodApi(data) {
  return request({
    url: `/api/bill/small/store/goods`,
    method: "PUT",
    data,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}
//DElete

export function delGood(goodsId) {
  return request({
    url: `/api/bill/small/store/goods/${goodsId}`,
    method: "DELETE",
  });
}

//查询订单列表
export function getOrderList(params) {
  return request({
    url: `/api/bill/small/store/order/list`,
    method: "get",
    params,
  });
}

// 获取订单详情
export function getOrderDetail(orderId) {
  return request({
    url: `/api/bill/small/store/order/${orderId}`,
    method: "get",
  });
}
// 退款
export function backToUser(data) {
  return request({
    url: `/api/bill/small/store/refund`,
    method: "post",
    data,
  });
}
//生成支付宝code
export function getAlipayCode(data) {
  return request({
    url: `/api/bill/small/store/order/random/number`,
    method: "get",
  });
}
