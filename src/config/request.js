/*
 * @Author: xiaoHao
 */
import axios from "axios";
import settings from "@/config/settings";
import { tansParams } from "@/utils/ruoyi";
import { ElMessage } from "element-plus";
import { refreshlogin } from "@/api/common/user";
import { getToken, removeToken } from "@/utils/auth";
import common from "@/utils/common";
// import qs from "qs";
import router from "@/router";
axios.defaults.headers["Content-Type"] = "application/x-www-form-urlencoded";
const service = axios.create({
  // baseURL: process.env.VUE_APP_BASE_API,
  timeout: settings.requestTimeout,
  headers: {
    "Content-Type": settings.contentType,
  },
  // responseType: 'arraybuffer'
});
let loadingInstance;

// request拦截器
service.interceptors.request.use(
  (config) => {
    // console.log(config);
    if (getToken() && config?.noToken !== true) {
      config.headers["Authorization"] =
        "Bearer " + window.localStorage.getItem("token");
    }
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

const waringMsg = (message) => {
  return ElMessage({
    message: message,
    type: "warning",
    duration: settings.messageDuration,
  });
};

service.interceptors.response.use(
  (response) => {
    if (loadingInstance) {
      loadingInstance.close();
    }
    const { status, data, config } = response;
    const { code, msg, access_token, error } = data;
    if (code === 0 && msg != null && msg != "null") {
      // 关于操作 成功的
      ElMessage({
        message: msg,
        type: "success",
        duration: settings.messageDuration,
      });
      return data;
    }
    if (code === 500) {
      ElMessage({
        message: msg,
        type: "error",
        duration: settings.messageDuration,
      });
      return data;
    }
    if (error == "invalid_token") {
      removeToken();
      if (common.role === "merchant") {
        router.replace("/signup");
      } else {
        router.replace("/login");
      }
    }
    // 状态码 不等于succ 0  没有token
    if (code !== settings.successCode && access_token == undefined) {
      switch (code) {
        case settings.invalidCode:
          // 登录失效
          removeToken();
          if (common.role === "merchant") {
            router.replace("/signup");
          } else {
            router.replace("/login");
          }
          break;
        case settings.noPermissionCode:
          // 无权限 token失效
          removeToken();
          if (common.role === "merchant") {
            router.replace("/signup");
          } else {
            router.replace("/login");
          }
          break;
        default:
          break;
      }
      return data;
    } else {
      return data;
    }
  },
  (error) => {
    if (loadingInstance) {
      loadingInstance.close();
    }
    /*网络连接过程异常处理*/
    let { message } = error;
    if (message == "Network Error") {
      message = "后端接口连接异常";
      waringMsg(message || "后端接口未知异常");
    }
    if (message.includes("timeout")) {
      message = "后端接口请求超时";
      waringMsg(message || "后端接口未知异常");
    }
    if (message.includes("Request failed with status code")) {
      return;
    }
    return Promise.reject(error);
  }
);

// 通用下载方法
export function download(url, params, filename) {
  return service
    .post(url + "?" + tansParams(params), params, {
      transformRequest: [
        (params) => {
          return tansParams(params);
        },
      ],
      responseType: "blob",
    })
    .then((data) => {
      const content = data;
      const blob = new Blob([content]);
      if ("download" in document.createElement("a")) {
        const elink = document.createElement("a");
        elink.download = filename;
        elink.style.display = "none";
        elink.href = URL.createObjectURL(blob);
        document.body.appendChild(elink);
        elink.click();
        URL.revokeObjectURL(elink.href);
        document.body.removeChild(elink);
      } else {
        navigator.msSaveBlob(blob, filename);
      }
    })
    .catch((r) => {
      console.error(r);
    });
}

// 通用下载方法
export function download2(url, data, filename) {
  return service
    .post(url, data, {
      responseType: "blob",
    })
    .then((data) => {
      const content = data;
      const blob = new Blob([content]);
      if ("download" in document.createElement("a")) {
        const elink = document.createElement("a");
        elink.download = filename;
        elink.style.display = "none";
        elink.href = URL.createObjectURL(blob);
        document.body.appendChild(elink);
        elink.click();
        URL.revokeObjectURL(elink.href);
        document.body.removeChild(elink);
      } else {
        navigator.msSaveBlob(blob, filename);
      }
    })
    .catch((r) => {
      console.error(r);
    });
}
// 通用下载方法
export function download3(url, data, filename) {
  return service
    .post(url, data.body, {
      responseType: "blob",
    })
    .then((data) => {
      const content = data;
      const blob = new Blob([content]);
      if ("download" in document.createElement("a")) {
        const elink = document.createElement("a");
        elink.download = filename;
        elink.style.display = "none";
        elink.href = URL.createObjectURL(blob);
        document.body.appendChild(elink);
        elink.click();
        URL.revokeObjectURL(elink.href);
        document.body.removeChild(elink);
      } else {
        navigator.msSaveBlob(blob, filename);
      }
    })
    .catch((r) => {
      console.error(r);
    });
}

// 通用下载图片方法
export function downloadImg(url) {
  return service
    .get(url, {
      responseType: "arraybuffer",
    })
    .then((data) => {
      return btoa(
        new Uint8Array(data).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ""
        )
      );
    })
    .catch((r) => {
      console.error(r);
    });
}

export default service;
