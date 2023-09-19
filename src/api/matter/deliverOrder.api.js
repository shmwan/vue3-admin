import http from '../../http/index.js'

const api = {
  async request(url, params, type = 'get') {
    let res = await http.request('/mgt' + url, params, type)
    return res
  },
  // 送货单分页列表
  async getDeliveryStockList(params) {
    return await this.request('/delivery-stock/page', params)
  },
  // 送货单号条码统计
  async getBarcodeDetail(params) {
    return await this.request('/barcode-info/stat-byDeliveryNo', params)
  },
  // 条码明细列表
  async getBarcodeList(params) {
    return await this.request('/barcode-info/list', params)
  }
}

export default api
