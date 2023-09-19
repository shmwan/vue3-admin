import http from "../../http/index.js";

const api = {
  async request(url, params, type = "get") {
    let res = await http.request(url, params, type);
    return res;
  },
  // 生产计划
  async getProductionPage(params) {
    return await this.request("/mgt/production/plan/page", params,'post');
  },
  
};

export default api;
