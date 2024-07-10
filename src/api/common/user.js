/*
 * @Author: xiaoHao
 */
import request from "@/config/request.js";
import { encryptedData } from "@/utils/encrypt.js";
import settings from "@/config/settings.js";
import { getToken } from "@/utils/auth.js";

// 登陆
export async function login(data) {
  if (settings.loginRSA) {
    data = await encryptedData(data);
  }
  return request({
    url: "/api/login",
    method: "post",
    data: {
      username: data.username,
      password: data.password,
      code: data.code,
      uuid: data.uuid,
      client_id: data.client_id,
      client_secret: data.client_secret,
      grant_type: data.grant_type,
      scope: data.scope,
    },
  });
}
// 商家端登陆
export function marchentLogin(data) {
  return request({
    url: "/store/api/store/login",
    method: "post",
    noToken: true,
    data,
  });
}
//商家路由
export function getMarchentRoute(data) {
  return request({
    url: "/store/api/store/getRouters",
    method: "get",
    data,
  });
}

// /api/store/getRouters
// 获取部门
export function getDeptList() {
  return request({
    url: "/api/system/user/deptTree",
    method: "get",
  });
}
// 获取角色
export function getRoles() {
  return request({
    url: "/api/system/user/roles",
    method: "get",
  });
}
// 获取菜单路由
export function getRoute() {
  return request({
    url: "/api/getRouters",
    method: "get",
  });
}

export function refreshlogin(data) {
  return request({
    url: "/mrbsservice/login",
    method: "post",
    data: {
      refresh_token: window.localStorage.getItem("refresh_token"),
      client_id: window.localStorage.getItem("client_id"),
      client_secret: "123456",
      grant_type: "refresh_token",
      scope: "server",
    },
  });
}

export function getPublicKey(data) {
  return request({
    url: "/publicKey",
    method: "post",
  });
}
