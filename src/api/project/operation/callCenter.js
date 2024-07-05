import request from "@/config/request.js";

export function getUserList(params) {
  return request({
    url: "/api/api/bill/customer/room/list",
    method: "get",
    params,
  });
}
// 获取聊天室内容
export function getChatRoomContent(params) {
  return request({
    url: `/api/api/system/message/list/${params.roomId}`,
    method: "get",
    params
  })
}
// 更新已读状态
export function updateReadStatus(roomId) {
  return request({
    url: `/api/api/bill/customer/room/${roomId}`,
    method: "post",
  })
}