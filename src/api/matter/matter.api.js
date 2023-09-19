import http from "../../http/index.js";

const api = {
  async request(url, params, type = "get") {
    let res = await http.request('/mgt' + url, params, type);
    return res;
  },
  async request1(url, params, type = "get") {
    let res = await http.request('/data' + url, params, type);
    return res;
  },
  async request2(url, params, type = "get") {
    let res = await http.request('/deviceApi' + url, params, type);
    return res;
  },
  async request3(url, params, type = "post") {
    let res = await http.request('/channelApi' + url, params, type);
    return res;
  },
  async request4(url, params, type = 'get') {
    let res = await http.request(url, params, type)
    return res
  },
   // 获取称重设备
   async getDeviceList(params) {
    return await this.request2("/equipmentmgt/type", params);
  },
  // 获取通道Id
  async getChannelList(params) {
    return await this.request3("/busiInterface/getChannelIds", params);
  },
  // 获取直播地址
  async getVideoUrl({ channelId}) {
    return await this.request4(
      `/XCQXApi/device/vpm/liveStreamV2/${channelId}?streamFrame=high`
    )
  },
  // 称重分页列表
  async getWeighList(params) {
    return await this.request("/weigh/page", params);
  },
  // 今日称重统计
  async getWeighToday(params) {
    return await this.request("/weigh/stat-today", params);
  },
  // 称重设备状态查询详情
  async getDeviceStatus(params) {
    return await this.request("/weigh-device-status/info/" + params);
  },
  // 称重设备状态修改
  async updateDeviceStatus(params) {
    return await this.request("/weigh-device-status/update-status", params, "post");
  },
  // 物料复核
  async matterCheck(params) {
    return await this.request("/weigh/matter-check", params, "post");
  },
  // 员工信息查询详情
  async empinfo(params) {
    return await this.request("/empinfo/info", params);
  },
  // 获取当前检验程度
  async getCheckLevel(params) {
    return await this.request1("/qms/getCheckLevel", params);
  },
  // 多件称重
  async multipleWeigh(params) {
    return await this.request("/weigh/multiple-weigh", params, "post");
  },
  //称重查询详情
  async weightInfo(params) {
    return await this.request("/weigh/info/" + params, '', "get");
  },
  //称重日志列表
  async weightLogList(params) {
    return await this.request("/weigh-log/list", params, "get");
  },
  //获取当前时间
  async currentTime(params) {
    return await this.request("/weigh/current-time", params, "get");
  },
};

export default api;
