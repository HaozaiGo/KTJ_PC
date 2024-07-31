import request from "@/config/request.js";

export function getLists(params) {
  return request({
    url: "/api/bill/store/list",
    method: "get",
    params,
  });
}
export function getFacilityList(params) {
  return request({
    url: "/api/bill/facility/select",
    method: "get",
    params,
  });
}
// 新增店铺信息
export function addStop(data) {
  return request({
    url: `/api/bill/store`,
    method: "post",
    headers: {
      "Content-Type": "multipart/form-data", //修改请求头
    },
    data,
  });
}
// 修改商家信息
export function editShopInfo(data) {
  return request({
    url: `/api/bill/store`,
    method: "PUT",
    headers: {
      "Content-Type": "multipart/form-data", //修改请求头
    },
    data
  });
}

// 删除商铺
export function deleteStop(storeIds) {
  return request({
    url: `/api/bill/store/${storeIds}`,
    method: "delete",
  });
}
// 修改商家平台状态
export function setStoreStatus(data) {
  return request({
    url: `/api/bill/store/status?ptStatus=${data.status}&storeId=${data.storeId}`,
    method: "post",
  });
}

// 修改状态
export function setStatus(data) {
  return request({
    url: `/api/store/status?onlineStatus=${data.status}&storeId=${data.storeId}`,
    method: "post",
  });
}

// 修改商家上线状态
export function setShopOnlineStatus(data) {
  return request({
    url: `/api/bill/store/online/status?ptOnlineStatus=${data.ptOnlineStatus}&storeId=${data.storeId}`,
    method: "post",
  });
}

// 修改商家启用状态
export function setShopStatus(data) {
  return request({
    url: `/api/bill/store/status?ptStatus=${data.ptStatus}&storeId=${data.storeId}`,
    method: "post",
  });
}

export function getShopDetail(storeId) {
  return request({
    url: `/api/bill/store/${storeId}`,
    method: "get",
  });
}
// 导出
export function exportShop(data) {
  return request({
    url: `/api/bill/store/export`,
    method: "post",
    data,
  });
}

// 商家店铺类型
export function getTypeOptions(params) {
  return request({
    url: `/api/bill/store/type/select/tree`,
    method: "get",
    params,
  });
}

//查询商家配置详细信息
export function getShopConfig(storeId) {
  return request({
    url: `/api/bill/store/config/${storeId}`,
    method: "get",
  });
}
// 修改商家配置
export function shopConfigSetting(data) {
  return request({
    url: `/api/bill/store/config`,
    method: "put",
    data,
  });
}
// 查看商家资料
export function checkMerchantData(storeId) {
  return request({
    url: `/api/bill/store/material/${storeId}`,
    method: "get",
  });
}

// 修改商家资料
export function changeMerchantData(data) {
  return request({
    url: `/api/bill/store/material`,
    method: "post",
    data,
  });
}

// 查看相册
export function checkAlbums(params) {
  return request({
    url: `/api/bill/store/images/list`,
    method: "get",
    params,
  });
}

// 分账
export function subAccountList(params) {
  return request({
    url: `/api/bill/wx/share/receiver/list`,
    method: "get",
    params,
  });
}
// 新增分账接受方
export function addAccountList(data) {
  return request({
    url: `/api/bill/wx/share/receiver`,
    method: "post",
    data,
  });
}
// 删除
export function deleteAccount(receiverId) {
  return request({
    url: `/api/bill/wx/share/receiver/${receiverId}`,
    method: "delete"
  });
}
// 修改商家折扣
export function discountAPI(data) {
  return request({
    url: `/api/bill/store/edit/discount`,
    method: "post",
    data,
  });
}