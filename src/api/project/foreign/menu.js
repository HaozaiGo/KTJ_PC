import request from "@/config/request.js";

export function getTypeList(params) {
  return request({
    url: "/store/api/store/menu/type/list",
    method: "get",
    params,
  });
}
export function addMenuTypeApi(data) {
  return request({
    url: "/store/api/store/menu/type",
    method: "post",
    data,
  });
}

export function deleteMenuTypeApi(data) {
  return request({
    url: `/store/api/store/menu/type/${data.storeId}/${data.typeIds}`,
    method: "delete",
  });
}
export function editMenuTypeApi(data) {
  return request({
    url: `/store/api/store/menu/type`,
    method: "put",
    data,
  })
}
// 订单详情
export function checkOrderDetail(orderId) {
  return request({
    url: `/store/api/order/store/pay/${orderId}`,
    method: "get",
  });
}
