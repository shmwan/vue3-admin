import http from "../../http/index.js";

const api = {
  async request(url, params, type = "get") {
    let res = await http.request('/mgt'+url, params, type);
    return res;
  },
  // 日志管理---日志列表
  async getList(params) {
    return await this.request("/supplier/page", params,'post');
  },

  async AddSupplier(params) {
    return await this.request("/supplier/add", params,'post');
  },

  async getDetail(params) {
    return await this.request("/supplier/info/"+params.id,"","get");
  },

  async UpdateInfo(params) {
    return await this.request("/supplier/update",params,"post");
  },

  //供应商同步
  async synchronization(params) {
    return await this.request("/supplier/synchronization",params,"get");
  },
};

export default api;
