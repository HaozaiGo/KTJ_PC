import request from "@/config/request.js";

export function getLists(params) {
  return request({
    url: "/store/api/store/list",
    method: "get",
    params,
  });
}
export function getFacilityList(params) {
  return request({
    url: "/store/api/store/facility/select",
    method: "get",
    params,
  });
}
// 修改店铺信息
export function editShopInfo(data) {
  return request({
    url: `/store/api/store`,
    method: "post",
    headers: {
      "Content-Type": "multipart/form-data", //修改请求头
    },
    data,
  });
}
// 修改状态
export function setStatus(data) {
  return request({
    url: `/store/api/store/status?onlineStatus=${data.status}&storeId=${data.storeId}`,
    method: "post",
  });
}
export function getShopDetail(storeId) {
  return request({
    url: `/store/api/store/${storeId}`,
    method: "get",
  });
}

// 查看商家相册列表
export function getShopAlbums(params) {
  return request({
    url: `/store/api/store/images/list`,
    method: "get",
    params
  });
}


// 删除商家相册
export function deleteShopAlbums(imageIds) {
  return request({
    url: `/store/api/store/images/${imageIds}`,
    method: "delete"
  });
}
