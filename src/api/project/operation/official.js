import request from "@/config/request.js";
export function getOfficialInfo(params) {
  return request({
    url: "/api/bill/company/info",
    method: "get",
    params,
  });
}

// 保存公司（官网）基础信息
export function saveIntrodution(data) {
  return request({
    url: "/api/bill/company/info/save",
    method: "post",
    data,
  });
}
// 上传上传平台APP的APK
export function uploadApk(data) {
  return request({
    url: "/api/bill/company/info/upload/apk",
    method: "post",
    headers: {
      "Content-Type": "multipart/form-data", //修改请求头
    },
    data,
  });
}
// 上传上传商家APP的图片
export function uploadMerchantApk(data) {
  return request({
    url: "/api/bill/company/info/upload/store/apk",
    method: "post",
    headers: {
      "Content-Type": "multipart/form-data", //修改请求头
    },
    data,
  });
}

//上传轮播图文件
export function uploadBannerFile(data) {
  return request({
    url: "/api/bill/company/info/upload/cover",
    method: "post",
    headers: {
      "Content-Type": "multipart/form-data", //修改请求头
    },
    data,
  });
}
//del轮播
export function delBanner(data) {
  return request({
    url: "/api/bill/company/info/upload/cover/delete",
    method: "post",
    data,
  });
}
//新增公司动态
export function addDynamics(data) {
  return request({
    url: "/api/bill/company/dynamics",
    method: "post",
    headers: {
      "Content-Type": "multipart/form-data", //修改请求头
    },
    data,
  });
}
export function eidtDynamics(data) {
  return request({
    url: "/api/bill/company/dynamics",
    method: "PUT",
    headers: {
      "Content-Type": "multipart/form-data", //修改请求头
    },
    data,
  });
}
export function delProductListApi(ids) {
  return request({
    url: `/api/bill/company/dynamics/${ids}`,
    method: "delete",
  });
}

export function getProductListApi(params) {
  return request({
    url: "/api/bill/company/dynamics/list",
    method: "get",
    params,
  });
}
