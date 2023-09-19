import http from '../../http/index.js'

const api = {
  async request(url, params, type = 'get') {
    let res = await http.request(url, params, type)
    return res
  },
  // 查询工艺流程
  async getProcessFlow(params) {
    return await this.request('/mgt/technological-process/page', params, 'post')
  },
  // 查询工艺流程详情
  async getProcessDetail(params) {
    return await this.request('/mgt/technological-process/info', params)
  },
  // 新增工艺流程
  async addprocessFlow(params) {
    return await this.request('/mgt/technological-process/add', params, 'post')
  },
  async update(params) {
    return await this.request(
      '/mgt/technological-process/update',
      params,
      'post'
    )
  },

  // 删除工艺流程
  async deleteData(params) {
    return await this.request(
      '/mgt/technological-process/removes',
      params,
      'post'
    )
  }
}

export default api
