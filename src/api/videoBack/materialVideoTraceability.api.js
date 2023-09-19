import http from '../../http/index.js'

const api = {
  async request(url, params, type = 'get') {
    let res = await http.request(url, params, type)
    return res
  },
  // 物料视频溯源（产线）
  async getTraceabilityStockList(params) {
    return await this.request(
      '/mgt/matter/log/page/traceability',
      params,
      'post'
    )
  },
  // 物料视频溯源（产线）
  async getTraceabilityStockLineCodeList(params) {
    return await this.request(
      '/mgt/matter/log/page/getLineCode',
      params,
      'post'
    )
  },
  // 物料视频溯源（承运商）
  async getTraceabilityStockSupplierList(params) {
    return await this.request(
      '/mgt/matter/log/page/getSupplier',
      params,
      'post'
    )
  },
  // 产线列表
  async getLineCodeList(params) {
    return await this.request('/mgt/big/screen/get/lineInfo')
  },

  // 关联视频列表
  async getAssociatedVideoList(params) {
    return await this.request(
      '/mgt/matter/log/list-relative-video',
      params,
      'post'
    )
  },
  // 获取视频回放时间段
  async getTimeRange({ channelId, startTime, endTime }) {
    return await this.request(
      `/XCQXApi/device/vpm/vodInfo/${channelId}/${startTime}/${endTime}`
    )
  },
  // 获取视频回放地址
  async getVideoUrl({ channelId, nStart, nEnd }) {
    return await this.request(
      `/XCQXApi/device/vpm/vodPlayUrl/${channelId}/${nStart}/${nEnd}/hls/0/4`
    )
  },
  // 拼接视频
  async connectSelectedVideo(params) {
    return await this.request('/mgt/matter-history-video/merge', params, 'post')
  },
  // 自动拼接视频
  async automaticConnectSelectedVideo(params) {
    return await this.request(
      '/mgt/matter-history-video/automatic',
      params,
      'post'
    )
  },
  // 机台换料查询
  async getMachineRefuelingList(params) {
    return await this.request(
      '/XCQXApi/data/newMes/data-sync/station/change',
      params,
      'post'
    )
  }
}

export default api
