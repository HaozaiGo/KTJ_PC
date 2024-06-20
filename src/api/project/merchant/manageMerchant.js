import request from "@/config/request.js";

export function getLists(params) {
  return request({
    url: "/api/api/bill/store/list",
    method: "get",
    params,
  });
}
export function getFacilityList(params) {
  return request({
    url: "/api/api/bill/facility/select",
    method: "get",
    params,
  });
}
// 新增店铺信息
export function addStop(data) {
  return request({
    url: `/api/api/bill/store`,
    method: "post",
    headers: {
      "Content-Type": "multipart/form-data", //修改请求头
    },
    data,
  });
}
// export function editShopInfo(data) {
//   return request({
//     url: `/api/api/store`,
//     method: "post",
//     headers: {
//       "Content-Type": "multipart/form-data", //修改请求头
//     },
//     data,
//   });
// }

// 删除商铺
export function deleteStop(storeIds) {
  return request({
    url: `/api/api/bill/store/${storeIds}`,
    method: "delete",
  });
}

// 修改状态
export function setStatus(data) {
  return request({
    url: `/api/api/store/status?onlineStatus=${data.status}&storeId=${data.storeId}`,
    method: "post",
  });
}

// 修改商家上线状态
export function setShopOnlineStatus(data) {
  return request({
    url: `/api/api/bill/store/online/status?ptOnlineStatus=${data.ptOnlineStatus}&storeId=${data.storeId}`,
    method: "post",
  });
}

// 修改商家启用状态
export function setShopStatus(data) {
  return request({
    url: `/api/api/bill/store/status?ptStatus=${data.ptStatus}&storeId=${data.storeId}`,
    method: "post",
  });
}

export function getShopDetail(storeId) {
  return request({
    url: `/api/api/bill/store/${storeId}`,
    method: "get",
  });
}
// 导出
export function exportShop(data) {
  return request({
    url: `/api/api/bill/store/export`,
    method: "post",
    data,
  });
}

// 商家店铺类型
export function getTypeOptions(params) {
  return request({
    url: `/api/api/bill/store/type/select/tree`,
    method: "get",
    params,
  });
}

//查询商家配置详细信息
export function getShopConfig(storeId) {
  return request({
    url: `/api/api/bill/store/config/${storeId}`,
    method: "get",
  });
}
// 修改商家配置
export function shopConfigSetting(data) {
  return request({
    url: `/api/api/bill/store/config`,
    method: "put",
    data,
  });
}
// 查看商家资料
export function checkMerchantData(storeId) {
  return request({
    url: `/api/api/bill/store/material/${storeId}`,
    method: "get",
  });
}

// 修改商家资料
export function changeMerchantData(data) {
  return request({
    url: `/api/api/bill/store/material`,
    method: "post",
    data,
  });
}

// 查看相册
export function checkAlbums(params) {
  return request({
    url: `/api/api/bill/store/images/list`,
    method: "get",
    params,
  });
}
