import http from '../../http/index.js'

const api = {
  async request(url, params, type = 'get') {
    let res = await http.request('/mgt' + url, params, type)
    return res
  },
  // 叫-领料记录分页列表
  async getUsedMaterialRecordList(params) {
    return await this.request('/material/transfer/record/page', params)
  },
  async getUsedMaterialRecordDetail(params) {
    return await this.request('/material/transfer/record/info/' + params.id)
  }
}

export default api
