import request from "@/config/request.js";

export function getLists(params) {
  return request({
    url: "/store/api/store/table/list",
    method: "get",
    params,
  });
}
export function getStoreListsApi(params) {
  return request({
    url: "/store/api/store/list",
    method: "get",
    params,
  });
}
export function addDesk(data) {
  return request({
    url: "/store/api/store/table",
    method: "post",
    data,
  });
}
export function editDesk(data) {
  return request({
    url: "/store/api/store/table",
    method: "PUT",
    data,
  });
}

export function deleteDesk(data) {
  return request({
    url: `/store/api/store/table/${data.storeId}/${data.tableIds}`,
    method: "DELETE",
  });
}
export function getTabLists(params) {
  return request({
    url: "/store/api/store/table/type/list",
    method: "get",
    params,
  });
}
export function addTab(data) {
  return request({
    url: "/store/api/store/table/type",
    method: "post",
    data,
  });
}
// 删除桌号管理
export function deleteTab(storeId,typeIds) {
  return request({
    url: `/store/api/store/table/type/${storeId}/${typeIds}`,
    method: "DELETE",
  });
}
// 修改台号类型
export function editTab(data) {
  return request({
    url: `/store/api/store/table/type`,
    method: "put",
    data,
  });
}


// 查询当前台是否已经开单
export function checkHasOrder(params) {
  return request({
    url: "/store/api/store/order/store/pay/query/unPay/order",
    method: "get",
    params,
  });
}

//修改台状态---变为待下单
export function changeTableStatusToWait(data) {
  return request({
    url: "/store/api/store/table/edit/wait/under/status",
    method: "post",
    data,
  });
}

// 清台
export function clearTable(data) {
  return request({
    url: "/store/api/store/table/edit/status/check",
    method: "post",
    data,
  });
}

//退菜
export function refundMenu(data) {
  return request({
    url: "/store/api/store/order/menu/item/return/menu",
    method: "post",
    data,
  });
}

// 桌台类型新增
export function addDeskType(data) {
  return request({
    url: "/store/api/store/table/model",
    method: "post",
    data,
  });
}
//修改桌台类型
export function editDeskType(data) {
  return request({
    url: "/store/api/store/table/model",
    method: "PUT",
    data,
  });
}
//删除

export function deleteDeskType(storeId,typeIds) {
  return request({
    url: `/store/api/store/table/model/${storeId}/${typeIds}`,
    method: "DELETE",
  });
}

// 查询桌台类型列表

export function getDeskTypeListApi(params) {
  return request({
    url: "/store/api/store/table/model/list",
    method: "get",
    params,
  });
}
