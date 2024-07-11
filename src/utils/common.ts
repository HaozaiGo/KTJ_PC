/*
 * @Author: xiaoHao
 */
import request from "@/config/request.js";

const commonMethod = {
  baseUrl: window.origin,
  //baseUrl:"http://124.223.101.232",

  // socketUrl:"192.168.1.59:8081",
  socketUrl: 'bdncn.cn/api',
  // 字典
  getDict(dictType: string) {
    return request({
      url: `/api/system/dict/type/type?dictTypes=` + dictType,
      method: "get",
    });
  },
  getStoreDict(dictType: string) {
    return request({
      url: `/store/api/system/dict/type/type?dictTypes=` + dictType,
      method: "get",
    });
  },

  debounce(fn: any, val: any) {
    let timer;
    clearTimeout(timer);
    timer = setTimeout(fn, 1000);
  },

  once: function (fn: any) {
    let caller = true;
    return function () {
      if (caller) {
        caller = false
        fn.apply(this, arguments)
      }
    }

  },
  tableHeight() {
    return window.innerHeight - 260;
  },

}
export default commonMethod