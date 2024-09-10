/*
 * @Author: xiaoHao
 */
import request from "@/config/request.js";

const commonMethod = {
  baseUrl: window.origin,
  //baseUrl:"http://124.223.101.232",
  //baseUrl:"http://192.168.1.59",
  //socketUrl:"ws://192.168.1.59",
  socketUrl: 'wss://bdncn.cn',
  role: window.localStorage.getItem("role") || "visitor",
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
  //压缩图片
  compress(fileObj: any, callback: Function) {
    try {
      const image = new Image()
      image.src = URL.createObjectURL(fileObj)
      image.onload = function () {
        const that = this
        // 默认按比例压缩
        let w = that.width
        let h = that.height
        const scale = w / h
        w = fileObj.width || w
        h = fileObj.height || (w / scale)
        let quality = 0.7 // 默认图片质量为0.7
        // 生成canvas
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        // 创建属性节点
        const anw = document.createAttribute('width')
        anw.nodeValue = w
        const anh = document.createAttribute('height')
        anh.nodeValue = h
        canvas.setAttributeNode(anw)
        canvas.setAttributeNode(anh)
        ctx.drawImage(that, 0, 0, w, h)
        // 图像质量
        if (fileObj.quality && fileObj.quality <= 1 && fileObj.quality > 0) {
          quality = fileObj.quality
        }
        // quality值越小，所绘制出的图像越模糊
        const data = canvas.toDataURL('image/jpeg', quality)
        // 压缩完成执行回调


        const bytes = window.atob(data.split(',')[1]) // 去掉url的头，并转换为byte
        // 处理异常,将ascii码小于0的转换为大于0
        const ab = new ArrayBuffer(bytes.length)
        const ia = new Uint8Array(ab)
        for (let i = 0; i < bytes.length; i++) {
          ia[i] = bytes.charCodeAt(i)
        }
        const newFile = new Blob([ab], { type: 'image/png' })
        console.log(newFile);


        callback(newFile)
      }
    } catch (e) {
      console.log('压缩失败!')
    }
  },

  convertBase64UrlToBlob(urlData: any) {
    const bytes = window.atob(urlData.split(',')[1]) // 去掉url的头，并转换为byte
    // 处理异常,将ascii码小于0的转换为大于0
    const ab = new ArrayBuffer(bytes.length)
    const ia = new Uint8Array(ab)
    for (let i = 0; i < bytes.length; i++) {
      ia[i] = bytes.charCodeAt(i)
    }
    return new Blob([ab], { type: 'image/png' })
  },
  retunToday() {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() > 9 ? date.getMonth() + 1: "0" + (date.getMonth() + 1);
    const day = date.getDate() > 9 ? date.getDate() : "0" + date.getDate();
    const hour = date.getHours() > 9 ? date.getHours() : "0" + date.getHours();
    const minute = date.getMinutes() > 9 ? date.getMinutes() : "0" + date.getMinutes();
    const second = date.getSeconds() > 9 ? date.getSeconds() : "0" + date.getSeconds();
    return year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
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