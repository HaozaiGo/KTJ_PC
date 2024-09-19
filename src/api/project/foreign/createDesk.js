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
export function addDesk(data){
  return request({
    url: "/store/api/store/table",
    method: "post",
    data,
  })
}
export function editDesk(data){
  return request({
    url: "/store/api/store/table",
    method: "PUT",
    data,
  })
}

export function deleteDesk(data){
  return request({
    url: `/store/api/store/table/${data.storeId}/${data.tableIds}`,
    method: "DELETE",
   
  })
}
export function getTabLists(params){
  return request({
    url: "/store/api/store/table/type/list",
    method: "get",
    params,
  });
}
export function addTab(data){
  return request({
    url: "/store/api/store/table/type",
    method: "post",
    data,
  })
}