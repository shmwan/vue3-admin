import http from "../../http/index.js";

const api = {
  async request(url, params, type = "get") {
    let res = await http.request('/mgt'+url, params, type);
    return res;
  },
  //列表
  async getList(params) {
    return await this.request("/rule/page", params,'post');
  },

  async AddRule(params) {
    return await this.request("/rule/add", params,'post');
  },

  async getInfo(params) {
    return await this.request("/rule/info/"+params.id,"","get");
  },

  async UpdateInfo(params) {
    return await this.request("/rule/update",params,"post");
  },

  //删除
  async detDel(params) {
    return await this.request("/rule/removes",params,"post");
  },
};

export default api;
