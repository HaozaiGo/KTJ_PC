import request from "@/config/request.js";

export function getCategoryList(params) {
  return request({
    url: "/api/bill/store/type/tree",
    method: "get",
    params,
  });
}
// 下拉树
export function getSelectTree(params) {
  return request({
    url: "/api/bill/store/type/select/tree",
    method: "get",
    params,
  });
}

// 新增
export function addtype(data) {
  return request({
    url: "/api/bill/store/type",
    method: "post",
    data,
  });
}
// 删除
export function deleteType(typeIds) {
  return request({
    url: `/api/bill/store/type/${typeIds}`,
    method: "delete",
  });
}
// 修改菜单
export function editType(data) {
  return request({
    url: "/api/bill/store/type",
    method: "put",
    data,
  });
}
