import request from "@/config/request.js";

//查询销售等级绩效金额汇总
export function getSaleAmount(params) {
  return request({
    url: "/api/bill/inner/order/performance/amount",
    method: "get",
    params,
  });
}

// 查询销售绩效记录列表
export function getSaleList(params) {
  return request({
    url: "/api/bill/inner/order/performance/list",
    method: "get",
    params,
  });
}
//查询销售等级绩效记录
export function getSaleScore(params) {
  return request({
    url: "/api/bill/inner/order/performance/score",
    method: "get",
    params,
  });
}

//出纳查询销售数据
export function cashierSaleData(params) {
  return request({
    url: "/api/bill/inner/order/performance/settlementData",
    method: "get",
    params,
  });
}

//入账

export function innerAccountApi(data) {
  return request({
    url: "/api/bill/inner/order/performance/inAccount",
    method: "post",
    data,
  });
}
//导出推荐人---会计
export function exportExcelAccountant(data) {
  return request({
    url: "/api/bill/inner/order/performance/exportInfo",
    method: "post",
    responseType: "blob",
    data,
  });
}


//导出推荐人---出纳
export function exportExcel(data) {
  return request({
    url: "/api/bill/inner/order/performance/export",
    method: "post",
    responseType: "blob",
    data,
  });
}
//结算
export function settleApi(data) {
  return request({
    url: "/api/bill/inner/order/performance/settle",
    method: "post",
    data,
  });
}

// 特殊处理
export function specialHandler(data) {
  return request({
    url: "/api/bill/inner/order/performance/special",
    method: "post",
    data,
  });
}