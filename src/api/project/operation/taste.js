import request from "@/config/request.js";

// +口味
export function addTasteApi(data) {
  return request({
    url: "/api/bill/store/taste/type",
    method: "post",
    data,
  });
}
// edit口味
export function editTasteApi(data) {
  return request({
    url: "/api/bill/store/taste/type",
    method: "PUT",
    data,
  });
}
export function getTasteList(params) {
  return request({
    url: "/api/bill/store/taste/type/list",
    method: "get",
  });
}
// delete
export function deleteTasteApi(typeIds) {
  return request({
    url: `/api/bill/store/taste/type/${typeIds}`,
    method: "DELETE",
  });
}

// 新增二级口味信息
export function addTasteInfo(data) {
  return request({
    url: "/api/bill/store/taste",
    method: "post",
    data,
  });
}
// 二级口味信息
export function getTasteInfoList(params) {
  return request({
    url: "/api/bill/store/taste/list",
    method: "get",
    params
  });
}
// delete二级口味信息
export function deleteTasteInfo(tasteIds) {
  return request({
    url: `/api/bill/store/taste/${tasteIds}`,
    method: "Delete",
    
  });
}