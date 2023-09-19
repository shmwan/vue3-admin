import http from "@/http/index.js";

const api = {
  async request(url, params, type = "get") {
    let res = await http.request('/auth'+url, params, type);
    return res;
  },
 // 角色管理---分页查询用户信息
 async getRoleList(params) {
    return await this.request("/sysRole/list", params);
  },
  // 用户管理---新增用户
  async addRole(params) {
    return await this.request("/sysRole/create", params, 'post');
  },
   // 用户管理---新增用户
   async update(params) {
    return await this.request("/sysRole/update", params, 'post');
  },
  // 用户角色---删除角色
  async deleteRole(params) {
    return await this.request("/sysRole/delete", params, 'del');
  },
  async getMenuName(params) {
    return await this.request("/sysRole/findMenuName", params);
  },
  // 获取拥有的角色列表
  async includeRoleList(params) {
    return await this.request("/sysRole/include/roleList", params);
  },
  // 获取目标和自身的角色列表
async getRoleListAndtarget(params) {
  return await this.request("/sysRole/right/list", params,'get');
},
 
};

export default api;
