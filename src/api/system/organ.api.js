import http from "@/http/index.js";

const api = {
  async request(url, params, type = "get") {
    let res = await http.request('/auth' + url, params, type);
    return res;
  },
  // 组织列表---分页查询信息
  async getList(params) {
    if (!params) {
      params = {
        pageSize: 99999,
        pageNo: 1
      };
    }
    return await this.request("/sysOrgan/list", params);
  },
  async getTreeList(params) {
    if (!params) {
      params = {
        pageSize: 99999,
        pageNo: 1
      };
    }
    return await this.request("/sysOrgan/list", params);
  },
  // 组织详情---查询信息
  async getDetail(params) {
    return await this.request("/sysOrgan/detail", params);
  },
  // 组织管理---新增组织
  async add(params) {
    return await this.request("/sysOrgan/create", params, 'post');
  },
  // 组织管理---修改组织
  async update(params) {
    return await this.request("/sysOrgan/update", params, 'post');
  },
  async delete(params) {
    return await this.request("/sysOrgan/delete", params, 'del');
  },
  async getListByParentId(params) {
    return await this.request("/sysOrgan/getOrganListByParentId", params);
  },

  async getOrganList(params) {
    return await this.request("/sysOrgan/right/organList", params);
  },

};

export default api;
