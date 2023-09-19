import http from "../../http/index.js";

const api = {
    async request(url, params, type = "get") {
        let res = await http.request('/mgt' + url, params, type);
        return res;
    },
    // 工厂分页列表
    async getList(params) {
        return await this.request("/line/info/page", params, "get");
    },
    //新增
    async addData(params) {
        return await this.request("/line/info/add", params, "post");
    },
    //查询详情
    async CheckInfo(params) {
        return await this.request("/line/info/info/" + params.id, '', "get");
    },
    //删除(单个条目)
    async DeleteData(params) {
        return await this.request("/line/info/remove/" + params, '', "get");
    },
    //物料修改
    async UpdateData(params) {
        return await this.request("/line/info/update", params, "post");
    },
};

export default api;
