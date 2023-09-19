import http from "../../http/index.js";

const api = {
    async request(url, params, type = "get") {
        let res = await http.request('/mgt' + url, params, type);
        return res;
    },
    // 表分页
    async getList(params) {
        return await this.request("/site/page", params, "post");
    },
    //新增
    async addSite(params) {
        return await this.request("/site/add", params, "post");
    },
    //查询详情
    async siteInfo(params) {
        return await this.request("/site/info/" + params.id, '', "get");
    },

    //修改
    async addUpdate(params) {
        return await this.request("/site/update", params, "post");
    },
    //删除
    async siteRemoves(params) {
        return await this.request("/site/removes", params, "post");
    },
};

export default api;
