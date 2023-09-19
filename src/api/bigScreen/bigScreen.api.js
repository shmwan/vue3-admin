import http from '../../http/index.js'

const api = {
  async request(url, params, type = 'get') {
    // params.reqType = 'aiBig'
    let res = await http.request('/mgt' + url, params, type)
    return res
  },
  async request1(url, params, type = 'get') {
    // params.reqType = 'aiBig'
    let res = await http.request('/XCQXApi' + url, params, type)
    return res
  },
  //获取产线的计划产值
  async getPlanned(params) {
    return await this.request(
      '/big/screen/get/planned/production',
      params,
      'get'
    )
  },
  //工站统计完成生产数
  async getQuantity(params) {
    return await this.request('/big/screen/station/quantity', params, 'post')
  },
  //获取系统时间
  async getTime(params) {
    return await this.request('/big/screen/system/time', params, 'post')
  },
  //获取当前看板应展示班次与日期
  async getSystem(params) {
    return await this.request('/big/screen/show/system/time', params, 'get')
  },
  //柱图统计
  async lineStatic(params) {
    return await this.request('/big/screen/station/statistics', params, 'post')
  },
  //计划人力 出勤率
  async getOutputInfo(params) {
    return await this.request1(
      '/report/line-production-schedule/output-info',
      params,
      'get'
    )
  },
  //UPPH
  async getUpph(params) {
    return await this.request1(
      '/report/production/data/upph/trend',
      params,
      'get'
    )
  },
  // 产线基础数据查询
  async getLineData(params) {
    return await this.request('/ai/count/line/baseInfo', params, 'get')
  },
  // 产线切换
  async productChange(params) {
    return await this.request('/ai/count/product/change', params, 'post')
  },
  // 生产计划
  async productPlan(params) {
    return await this.request('/ai/count/product/plan', params, 'get')
  },

  // 产能达成趋势
  async trend(params) {
    return await this.request('/big/screen/capacity/trend', params, 'get')
  },
  // 产能产线排名
  async capacity(params) {
    return await this.request('/big/screen/line/capacity', params, 'get')
  },
  //产线产能达成率分析
  async achievement(params) {
    return await this.request(
      '/big/screen/line/capacity/achievement',
      params,
      'get'
    )
  },
  // 生产用料占比
  async matterStatistics(params) {
    return await this.request('/big/screen/matter/statistics', params, 'get')
  }
}

export default api
