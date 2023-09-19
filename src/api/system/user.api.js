import http from "@/http/index.js";
const api = {
  async request(url, params, type = "get") {
    let res = await http.request('/auth'+url, params, type);
    return res;
  },
   //退出登录
   async loginOut(params){
    return await http.post("/users/userLoginOut",params,'post');
  },
  // 用户列表---分页查询用户信息
  async getUserList(params) {
    return await this.request("/sysUser/list", params);
  },
  // 中心用户列表---分页查询用户信息
  async getCenterUserList(params) {
    return await this.request("/sysUser/center/userList", params);
  },
  // 用户管理---新增用户
  async addUser(params) {
    return await this.request("/sysUser/create", params, 'post');
  },
  async addUserChannelRelate(params) {
    return await this.request("/sysUser/addUserChannelRelate", params, 'post');
  },
  async update(params) {
    return await this.request("/sysUser/update", params, 'post');
  },
  async deleteUser(params) {
    return await this.request("/sysUser/delete", params, 'del');
  },
  async getDetail(params) {
    return await this.request("/sysUser/detail", params,);
  },
  async changePassword(params) {
    return await this.request("/sysUser/updatePassword", params,'post');
  },
 // 根据角色code获取权限菜单
  async getPrivilegeByRoleCode(params) {
    return await this.request("/role/getPrivilegeByRoleCode", params);
  },
  //密码重置
  async reset(params) {
    return await this.request("/auth/reset", params);
  },
// 查看绑定的第三方数据
async bindOutside(params) {
  return await this.request("/sysApp/tied/list", params);
},
//  解除绑定


async unBindOutside(params) {
  return await this.request("/sysApp/unbind", params);
},

// 根据配置文件获取中心还是边缘
async getFactoryType(params) {
  return await this.request("/auth/center", params);
},

// 根据配置文件获取中心还是边缘
async enable(params) {
  return await this.request("/sysUser/enable", params,'post');
},

// 根据公司编码获取用户列表
async UsersByOrganNo(params) {
  return await this.request("/sysUser/list/plus/external", params);
},
// 修改用户角色权限
async changeRole(params) {
  return await this.request("/sysUser/change/role", params,'post');
},



};

export default api;
