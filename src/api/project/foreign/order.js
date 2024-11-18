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

// 打单时 线下打单 右下角 后付款
export function offlineCheckOrder(data) {
  return request({
    url: "/store/api/store/order/store/pay/only/print",
    method: "post",
    data,
  });
}
// 先付款  先付款 打单
export function beforePayCheckOrder(data) {
  return request({
    url: "/store/api/store/order/store/pay/print",
    method: "post",
    data,
  });
}

// 自定义打单
export function customPrint(data) {
  return request({
    url: `/store/api/store/order/store/pay/custom/print`,
    method: "post",
    data,
  });
}
export function getSysPrinterLists(params) {
  return request({
    url: "/store/api/store/printer/list",
    method: "get",
    params,
  });
}
// 获取二维码支付 文件流图片

export function getQrCodePayImg(params) {
  return request({
    url: "/store/api/store/order/store/pay/qrcode/mini/server",
    method: "get",
    params,
  });
}

// 删除扫码点餐后付款的订单
export function deleteOrderApi(params) {
  return request({
    url: `/store/api/store/order/store/pay/del/after/${params.storeId}/${params.orderIds}`,
    method: "DELETE",
  });
}

//添加订单菜品
export function AddOrderInsideMenu(data) {
  return request({
    url: `/store/api/store/order/menu/item`,
    method: "post",
    data,
  });
}

// 修改订单菜品
export function updateOrderInsideMenu(data) {
  return request({
    url: `/store/api/store/order/menu/item`,
    method: "put",
    data,
  });
}

// 删除订单中的菜品
export function deleteOrderInsideMenu(data) {
  return request({
    url: `/store/api/store/order/menu/item`,
    method: "DELETE",
    data,
  });
}

// 扫码点餐下单（后付，只下单）（body）
export function underOrderAfterPay(data) {
  return request({
    url: `/store/api/store/order/store/pay/under/order`,
    method: "post",
    data,
  });
}

// 后付修改订单菜品
export function afterPayChangeOrder(data) {
  return request({
    url: `/store/api/store/order/store/pay/edit/menu`,
    method: "post",
    data,
  });
}

// 查询商家茶位信息
export function getTeaInfo(storeId) {
  return request({
    url: `/store/api/store/menu/position/${storeId}`,
    method: "get",
  });
}

// 补打制作单 除去前台
export function printAgain(data) {
  return request({
    url: `/store/api/store/order/store/pay/make/print`,
    method: "post",
    data,
  });
}

// 团购打单
export function teamBuyOrder(data){
  return request({
    url: `/store/api/store/order/meal/print`,
    method: "post",
    data,
  });
}
// 团购打单
export function platForm95BuyOrder(data){
  return request({
    url: `/store/api/store/order/menu/print`,
    method: "post",
    data,
  });
}

export function cancelGroupBuyOrder(data){
  return request({
    url: `/store/api/store/wx/refund/meal`,
    method: "post",
    data,
  });
}


