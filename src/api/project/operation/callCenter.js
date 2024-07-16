import request from "@/config/request.js";

// 粉丝列表
export function getUserList(params) {
  return request({
    url: "/api/bill/customer/room/list",
    method: "get",
    params,
  });
}
// 商家用户列表
export function getMerchantList(params) {
  return request({
    url: "/api/bill/store/staff/room/list",
    method: "get",
    params,
  });
}
// 获取聊天室内容
export function getChatRoomContent(params) {
  return request({
    url: `/api/bill/customer/message/list/${params.roomId}`,
    method: "get",
    params,
  });
}
// 平台获取和商家端端聊天记录
export function getChatRoomStoreContent(params) {
  return request({
    url: `/api/bill/store/staff/message/list/${params.roomId}`,
    method: "get",
    params,
  });
}
// 商家端获取之前到客服聊天内容
export function merchantGetBeforeChatContent(params) {
  return request({
    url: `/store/api/store/message/list`,
    method: "get",
    params,
  });
}

// 更新已读状态
export function updateReadStatus(roomId) {
  return request({
    url: `/api/bill/customer/room/${roomId}`,
    method: "post",
  });
}
