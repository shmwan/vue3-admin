import http from "../../http/index.js";

const api = {
  async request(url, params, type = "get") {
    let res = await http.request('/mgt'+url, params, type);
    return res;
  },
  // 物料表分页
  async getList(params) {
    return await this.request("/matter/page", params,"post");
  },
  //新增
  async addMatter(params) {
    return await this.request("/matter/add", params,"post");
  },
  //查询详情
  async MatterInfo(params) {
    return await this.request("/matter/info/"+params.id,'',"get");
  },
  //物料同步
  async MatterAynchronization(params) {
    return await this.request("/matter/synchronization", params,"get");
  },
  //物料修改
  async addUpdate(params) {
    return await this.request("/matter/update", params,"post");
  },
};

export default api;
