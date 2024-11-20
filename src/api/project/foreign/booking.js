import request from "@/config/request.js";

export function getShopInfo(storeId) {
  return request({
    url: `/store/api/store/${storeId}`,
    method: "get",
  });
}