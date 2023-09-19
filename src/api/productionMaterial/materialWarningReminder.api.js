import http from '../../http/index.js'

const api = {
  async request(url, params, type = 'get') {
    let res = await http.request('/mgt' + url, params, type)
    return res
  },
  // 用料预警记录分页列表
  async getMaterialWarnList(params) {
    return await this.request('/material/warn/page', params)
  },
  // 用料预警记录分操作
  async dealMaterialWarn(params) {
    return await this.request('/material/warn/handle/' + params.id)
  }
}

export default api
