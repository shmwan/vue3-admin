import http from "@/http/index.js";
const api = {
  async request(url, params, type = "get") {
    let res = await http.request('/mgt'+url, params, type);
    return res;
  },
  // 字典列表---分页查询字典信息
  async getList(params) {
    return await this.request("/dictionary/getAll", params);
  },
  // 字典列表---字典类型code列表
  async searchCode(params) {
    return await this.request("/dictionary/getDictInfo", params);
  },
  // 字典管理---新增字典
  async add(params) {
    return await this.request("/dictionary/create", params, 'post');
  },
   // 字典管理---修改字典
  async update(params) {
    return await this.request("/dictionary/update", params, 'post');
  },
   // 字典管理---删除字典
   async delete(params) {
    return await this.request("/dictionary/delete", params, 'post');
  },
   // 字典管理---删除字典
   async selectBy(params) {
    return await this.request("/dictionary/selectBy", params);
  },
 // 字典管理---查询字典类型
 async dictionDataValueInfo(params) {
  return await this.request("/dictionary/getForMeta", params);
},
 // 字典列表---分页查询字典信息
 async getDictList(params) {
  return await this.request("/dictionary/getAll", params);
},
  
};

export default api;
