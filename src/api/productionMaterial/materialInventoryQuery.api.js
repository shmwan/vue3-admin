import http from '../../http/index.js'

const api = {
  async request(url, params, type = 'get') {
    let res = await http.request('/mgt' + url, params, type)
    return res
  },
  // 物料库存信息统计分页列表
  async getMatterInventoryList(params) {
    return await this.request('/matter/inventory/page/count', params)
  }
}

export default api
