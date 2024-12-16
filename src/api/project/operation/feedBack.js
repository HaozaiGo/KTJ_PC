import request from "@/config/request.js";

// 粉丝列表
export function getUserFeedBackList(params) {
  return request({
    url: "/api/bill/feedback/box/list",
    method: "get",
    params,
  });
}
//查询用户反馈详细信息（并更新为已阅状态
export function checkFeedBack(feedbackId) {
  return request({
    url: `/api/bill/feedback/box/${feedbackId}`,
    method: "get",
  });
}
export function deleteFeedBack(feedbackId) {
  return request({
    url: `/api/bill/feedback/box/${feedbackId}`,
    method: "delete",
  });
}
