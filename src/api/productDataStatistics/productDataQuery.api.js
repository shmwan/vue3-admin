import http from "../../http/index.js";

const api = {
  async request(url, params, type = "get") {
    let res = await http.request('/mgt' + url, params, type);
    return res;
  },
  // 生产数据查询分页列表
  async getProductionDataList(params) {
    return await this.request("/data-collect-history/page", params, "post");
  },
    // 生产用料统计
  async getProductionUsedMatterList(params) {
    return await this.request("/data-collect-history/report/page", params, "post");
  },
};

export default api;
