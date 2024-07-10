import request from "@/config/request.js";

export function getLists(params) {
  return request({
    url: "/api/bill/apply/order/list",
    method: "get",
    params,
  });
}
// 审核通过
export function passCheck(data) {
  return request({
    url: "/api/bill/apply/order",
    method: "post",
    data,
  });
}
// 删除
export function deleteRow(applyIds) {
  return request({
    url: `/api/bill/apply/order/${applyIds}`,
    method: "delete",
  });
}
// 获取审核信息
export function checkInfo(applyId) {
  return request({
    url: `/api/bill/apply/order/${applyId}`,
    method: "get",
  });
}
// 特约进件
export function comeInApi(params) {
  return request({
    url: `/api/bill/apply/order/applyment`,
    method: "get",
    params
  });
}

//进件状态
export function checkComeStatus(params) {
  return request({
    url: `/api/bill/apply/order/applyment/${params.applyId}/${params.applymentId}`,
    method: "get",
  });
}

