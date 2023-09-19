import http from "../../http/index.js";

const api = {
  async request(url, params, type = "get") {
    let res = await http.request(url, params, type);
    return res;
  },
  // 日志管理---日志列表
  async getLogList(params) {
    return await this.request("/mgt/sysLog/page", params);
  },
  
 
};

export default api;
