import request from "@/config/request.js";

export function getLists(params) {
  return request({
    url: "/api/api/bill/facility/list",
    method: "get",
    params,
  });
}
export function addFacility(data) {
  return request({
    url: `/api/api/bill/facility`,
    method: "post",
    data,
  });
}
export function deleteFacility(facilityIds) {
  return request({
    url: `/api/api/bill/facility/${facilityIds}`,
    method: "delete",
  });
}
export function editFacility(data) {
  return request({
    url: `/api/api/bill/facility`,
    method: "put",
    data,
  });
}
// 修改状态
export function setStatus(params) {
  return request({
    url: `/api/api/bill/facility/status`,
    method: "PUT",
    params,
  });
}
