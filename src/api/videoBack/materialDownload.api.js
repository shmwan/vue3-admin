import http from "@/http/index.js";

const api = {
    async request(url, params, type = "get") {
        let res = await http.request('/mgt' + url, params, type);
        return res;
    },
      //物料历史视频分页列表
  async getHistoryList(params) {
    return await this.request("/matter-history-video/page", params, "get");
  },
      //视频下载
  async download(params) {
    return await this.request("/matter-history-video/download/" + params, '',"get");
  },
    //重新合成视频
    async remergeVideo(params) {
    return await this.request("/matter-history-video/remerge/" + params, '',"get");
  },
};

export default api;