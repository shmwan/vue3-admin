import http from "../../http/index.js";

const api = {
    async request(url, params, type = "get") {
        let res = await http.request('/mgt' + url, params, type);
        return res;
    },
    // 工厂分页列表
    async getList(params) {
        return await this.request("/factory/info/page", params, "get");
    },
    //新增
    async addFactory(params) {
        return await this.request("/factory/info/add", params, "post");
    },
    //查询详情
    async FactoryInfo(params) {
        return await this.request("/factory/info/info/" + params.id, '', "get");
    },
    //删除(单个条目)
    async FactoryDel(params) {
        return await this.request("/factory/info/remove/" + params, '', "get");
    },
    //物料修改
    async FactoryUpdate(params) {
        return await this.request("/factory/info/update", params, "post");
    },
};

export default api;
