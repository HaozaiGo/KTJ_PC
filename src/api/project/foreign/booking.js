import request from "@/config/request.js";

export function getShopInfo(storeId) {
  return request({
    url: `/store/api/store/${storeId}`,
    method: "get",
  });
}

//修改预订配置（body）
export function editBooking(data) {
  return request({
    url: `/store/api/store/book`,
    method: "PUT",
    data,
  });
}

// 查询预订配置详细信息
export function getBookingInfo(storeId) {
  return request({
    url: `/store/api/store/book/${storeId}`,
    method: "get",
  });
}
// 修改预订状态
export function bookingStatus(data) {
  return request({
    url: `/store/api/store/book/edit/open/status`,
    method: "post",
    data,
  });
}

//商家处理接单与否
export function merchantHandler(data) {
  return request({
    url: `/store/api/store/order/book/accept`,
    method: "post",
    data,
  });
}
export function checkDeskEmptyList(params) {
  return request({
    url: `/store/api/store/table/no/page/list`,
    method: "get",
    params
  });
}
//获取手机号
export function getPhoneNumber(orderId){
  return request({
    url: `/store/api/store/order/store/pay/phone/${orderId}`,
    method: "get",
  });
}
// 预定订单退款
export function refundBookOrder(data) {
  return request({
    url: `/store/api/store/wx/refund/book`,
    method: "post",
    data,
  });
}


