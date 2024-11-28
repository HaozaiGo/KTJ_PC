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
    data
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
    data
  });
}