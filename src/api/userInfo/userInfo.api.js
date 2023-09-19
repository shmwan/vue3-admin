import http from "../../http/index.js";
const api = {
  async request(url, params, type = "get") {
    let res = await http.request('/uc' + url, params, type);
    return res;
  },
  /**
   * 
   * @param {请求参数} params 
   * @returns 用户列表
   */
  async getList(params, pageNo, pageSize,) {
    return await this.request(`/ucUser/findPage?pageSize=${pageSize}&currentPage=${pageNo}`, params, 'post');
  },
  async getTree() {
    return await this.request('/corp/getTree');
  },
  async getBaseInfo(params, pageNo, pageSize,) {
    return await this.request(`/ucUser/findPage?pageSize=${pageSize}&currentPage=${pageNo}`, params, 'post');
  },
  async getUsersDevice(params, pageNo, pageSize,id) {
    return await this.request(`/ucUser/getDeviceRelated?pageSize=${pageSize}&currentPage=${pageNo}&userId=${id}`, params, 'post');
  },
  
};

export default api;
