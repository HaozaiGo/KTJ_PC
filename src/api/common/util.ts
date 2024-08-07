import request from "@/config/request.js";

// 获取天气
export function getWeather(data: string) {
  return request({
    url: `http://wthrcdn.etouch.cn/weather_mini?city=${data}`,
    method: "get",
  });
}
// test测试上传接口
export function uploadFile(data: any) {
  return request({
    url: `/store/api/store/images`,
    method: "post",
    data,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}