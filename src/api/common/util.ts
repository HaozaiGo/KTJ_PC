import request from "@/config/request.js";

// 获取天气
export function getWeather(data:string) {
  return request({
    url: `http://wthrcdn.etouch.cn/weather_mini?city=${data}`,
    method: "get",
  });
}