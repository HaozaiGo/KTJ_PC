import request from "@/config/request.js";

export function getTypeList(params) {
  return request({
    url: "/store/api/store/menu/type/list",
    method: "get",
    params,
  });
}
export function addMenuTypeApi(data) {
  return request({
    url: "/store/api/store/menu/type",
    method: "post",
    data,
  });
}
export function deleteMenuTypeApi(data) {
  return request({
    url: `/store/api/store/menu/type/${data.storeId}/${data.typeIds}`,
    method: "delete",
  });
}
export function editMenuTypeApi(data) {
  return request({
    url: `/store/api/store/menu/type`,
    method: "put",
    data,
  });
}
// 菜式详细
export function getMenusDetail(params) {
  return request({
    url: `/store/api/store/menu/${params.storeId}/${params.menuId}`,
    method: "get",
  });
}

// 订单详情
export function checkOrderDetail(orderId) {
  return request({
    url: `/store/api/order/store/pay/${orderId}`,
    method: "get",
  });
}
// 菜单list
export function getMenusList(params) {
  return request({
    url: `/store/api/store/menu/list`,
    method: "get",
    params,
  });
}

// 新增菜式
export function addMenuApi(data) {
  return request({
    url: "/store/api/store/menu",
    method: "post",
    data,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}
// 删除菜式
export function deleteMenuApi(data) {
  return request({
    url: `/store/api/store/menu/${data.storeId}/${data.menuIds}`,
    method: "delete",
  });
}
// 编辑
export function editMenuApi(data) {
  return request({
    url: "/store/api/store/menu",
    method: "put",
    data,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

// 获取口味列表

export function getTasteList(params) {
  return request({
    url: `/store/api/store/taste/select`,
    method: "get",
    params,
  });
}

// 茶位
export function addTeaPosition(data) {
  return request({
    url: `/store/api/store/menu/tea/position`,
    method: "post",
    data,
  });
}
