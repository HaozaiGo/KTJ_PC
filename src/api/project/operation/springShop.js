import request from "@/config/request.js";

// 粉丝列表
export function getShopInfo(params) {
  return request({
    url: "/api/bill/small/store",
    method: "get",
    params,
  });
}

export function editInfo(data) {
  return request({
    url: "/api/bill/small/store",
    method: "post",
    data,
  });
}

// s查询平台自营商品分类列表
export function productTypeList(params) {
  return request({
    url: "/api/bill/small/store/goods/type/list",
    method: "get",
    params,
  });
}
export function editProductTypeList(data) {
  return request({
    url: "/api/bill/small/store/goods/type",
    method: "post",
    data,
  });
}

// 查询商品列表

export function productList(params) {
  return request({
    url: "/api/bill/small/store/goods/list",
    method: "get",
    params,
  });
}

//addGoodsApi

export function addGoodsApi(data) {
  return request({
    url: "/api/bill/small/store/goods",
    method: "post",
    data,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

// showBack
export function showBackGood(goodsId) {
  return request({
    url: `/api/bill/small/store/goods/${goodsId}`,
    method: "get",
  });
}

//eidt
export function editGoodApi(data) {
  return request({
    url: `/api/bill/small/store/goods`,
    method: "PUT",
    data,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}
//DElete

export function delGood(goodsId) {
  return request({
    url: `/api/bill/small/store/goods/${goodsId}`,
    method: "DELETE",
  });
}