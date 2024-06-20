import request from "@/config/request.js";

export function getLists(params) {
  return request({
    url: "/api/api/monitor/job/list",
    method: "get",
    params,
  });
}

// 新增字典
export function addTimeOut(data) {
  return request({
    url: "/api/api/monitor/job",
    method: "post",
    data,
  });
}
// 删除
export function deleteTimeOut(jobIds) {
  return request({
    url: `/api/api/monitor/job/${jobIds}`,
    method: "delete",
  });
}
// 修改
export function editTimeOut(data) {
  return request({
    url: "/api/api/monitor/job",
    method: "put",
    data,
  });
}

// 状态
export function setStatus(data) {
  return request({
    url: "/api/api/monitor/job/changeStatus",
    method: "put",
    data,
  });
}

// 执行一次
export function runOnceApi(data) {
  return request({
    url: "/api/api/monitor/job/run",
    method: "put",
    data,
  });
}

//获取字典数据List
export function getLogList(params) {
  return request({
    url: `/api/api/monitor/jobLog/list`,
    method: "get",
    params,
  });
}

export function clearAllLogs() {
  return request({
    url: "/api/api/monitor/jobLog/clean",
    method: "delete",
  });
}

// 删除
export function deleteLogs(jobLogIds) {
  return request({
    url: `/api/api/monitor/jobLog/${jobLogIds}`,
    method: "delete",
  });
}
