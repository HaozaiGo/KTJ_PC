import request from "@/config/request.js";

//查询所有关联的菜系
export function getStoreAllMenuLists(params) {
  return request({
    url: "/store/api/store/menu/all/list",
    method: "get",
    params,
  })
}


export function getLists(params) {
  return request({
    url: "/store/api/store/printer/list",
    method: "get",
    params,
  });
}

export function addPrinterApi(data) {
  return request({
    url: "/store/api/store/printer",
    method: "post",
    data,
  });
}