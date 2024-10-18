import request from "@/config/request.js";

// 新增团购套餐
export function addGroupSetting(data) {
  return request({
    url: "/store/api/store/meal",
    method: "post",
    headers: {
      "Content-Type": "multipart/form-data", //修改请求头
    },
    data,
  });
}

// 修改团购套餐
export function editGroupSetting(data) {
  return request({
    url: "/store/api/store/meal",
    method: "PUT",
    headers: {
      "Content-Type": "multipart/form-data", //修改请求头
    },
    data,
  });
}
// 查询团购套餐详细信息
export function getGroupSettingDetail(params) {
  return request({
    url: `/store/api/store/meal/${params.storeId}/${params.mealId}`,
    method: "get",
  });
}
// 删除团购套餐
export function delGroupSetting(params) {
  return request({
    url: `/store/api/store/meal/${params.storeId}/${params.mealId}`,
    method: "DELETE",
  });
}
// 查询团购套餐列表
export function getGroupSettingList(params) {
  return request({
    url: `/store/api/store/meal/list`,
    method: "get",
    params,
  });
}
// 上下架
export function onlineStatus(data) {
  return request({
    url: "/store/api/store/meal/update/online/status",
    method: "post",
    data,
  });
}
