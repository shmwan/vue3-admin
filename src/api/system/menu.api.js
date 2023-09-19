import http from '../../http/index.js'
const { systemCode } = config()
const api = {
  async request(url, params, type = 'get', isData = true) {
    let res = await http.request('/auth' + url, params, type)
    if (res) {
      if (isData) {
        return res.data
      } else {
        return res
      }
    }
  },
  // 菜单管理---分页查询用户信息
  async getMenuList(params) {
    return await this.request('/sysMenu/list', params)
  },
  // 用户管理---新增用户
  async addMenu(params) {
    return await this.request('/sysMenu/create', params, 'post', false)
  },
  // 用户管理---新增用户
  async update(params) {
    return await this.request('/sysMenu/update', params, 'post', false)
  },

  async addUserChannelRelate(params) {
    return await this.request('/sysMenu/addUserChannelRelate', params, 'post')
  },
  async delete(params) {
    return await this.request('/sysMenu/delete', params, 'del', false)
  },

  // 根据角色code获取权限菜单
  async getMenuTree(params) {
    params = {
      ...params,
      systemCode
    }
    let url = '/sysMenu/getMenuTree'
    return await this.request(url, params)
  },
  // 根据类型获取菜单目录
  async getMenuByType(params) {
    return await this.request('/sysMenu/getMenuByType', params)
  },

  //  快捷菜单配置
  async setConvenientMenu(params) {
    return await this.request('/convenient/menu/config', params, 'post', false)
  },
  //  快捷菜单查询
  async getConvenientMenu(params) {
    return await this.request('/convenient/menu/list', params, 'get', false)
  }
}

export default api
