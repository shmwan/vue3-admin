import http from "../http/index.js";
const api = {
  async request(url, params, type = "get") {
    let res = await http.request(url, params, type);
    return res;
  },
  // 登录
  async login(params) {
    return await this.request("/auth/auth/login", params, 'post');
  },

  async loginKeystone(params) {
    let url = "/auth/auth/login";
    return await this.request(url, params, 'post');
  },
  // 获取验证码接口
  async captcha(params) {
    return await this.request("/auth/auth/captcha", params);
  },
  // 检验验证码接口
  async verifyCode(params) {
    return await this.request("/auth/auth/verifyCode", params);
  },
  // 获取视频监控，精细化生产分厂列表
  async find(params) {
    return await this.request("/mgt/externalSystem/find/" + params);
  },
  // 获取三个系统名称以及地址信息
  async show() {
    return await this.request("/mgt/index/show");
  },
  // 获取用户信息
  async getInfo() {
    let url = "/auth/sysUser/userInfo";
    return await this.request(url);
  },
  /**
    * 根据code 查询外部系统详情
    */
  async getSystemDetail(params) {
    return await this.request("/mgt/externalSystem/findByCode", params);
  },
  async getIScToken(params) {
    return await this.request("/auth/auth/isc/authorization", params);
  },

  // 获取用户密码是否过期

  async verifyPwd(params) {
    return await this.request("/auth/sysUser/verify/password", params);
  },

};

export default api;
