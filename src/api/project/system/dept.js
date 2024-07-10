import request from "@/config/request.js";

export function getDeptList(params) {
  return request({
    url: "/api/system/dept/tree/list",
    method: "get",
    params,
  });
}

// 新增部门
export function addDept(data) {
  return request({
    url: "/api/system/dept",
    method: "post",
    data,
  });
}
// 删除
export function deleteDept(deptId) {
  return request({
    url: `/api/system/dept/${deptId}`,
    method: "delete",
  });
}
// 修改菜单
export function editDept(data) {
  return request({
    url: "/api/system/dept",
    method: "put",
    data,
  });
}
