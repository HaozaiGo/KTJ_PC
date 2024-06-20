import request from "@/config/request.js";

export function getLists(params) {
  return request({
    url: "/api/api/store/staff/list",
    method: "get",
    params,
  });
}
export function addEmployee(data) {
  return request({
    url: `/api/api/store/staff`,
    method: "post",
    data,
  });
}
export function deleteEmployee(params) {
  return request({
    url: `/api/api/store/staff/${params.staffIds}`,
    method: "delete",
    params,
  });
}
export function editEmployee(data) {
  return request({
    url: `/api/api/store/staff`,
    method: "put",
    data,
  });
}
export function EmployeePassword(params) {
  return request({
    url: `/api/api/store/staff/password`,
    method: "put",
    params,
  });
}
// 查询商店信息下拉列表
export function gerShopOption(params) {
  return request({
    url: `/api/api/store/select`,
    method: "get",
    params,
  });
}
// 修改状态
export function setStatus(params) {
  return request({
    url: `/api/api/store/staff/status`,
    method: "PUT",
    params,
  });
}
