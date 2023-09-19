import http from '../../http/index.js'

const api = {
  async request(url, params, type = 'get') {
    let res = await http.request(url, params, type)
    return res
  },
  // 领料信息查询
  async AGVmaterial(params) {
    return await this.request('/mgt/agv/board/receive/material', params)
  },

  // 站点数据查询
  async getAllPosition(params) {
    return await this.request('/AgvApi/rcs/map/getTopo', params)
  },
  // 站点数据查询
  async getAmr(params) {
    return await this.request('/AgvAmrApi/stat/apiv1/amr_daily_stat', params)
  }
}

export default api
