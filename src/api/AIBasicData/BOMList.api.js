import http from "../../http/index.js";

const api = {
    async request(url, params, type = "get") {
        let res = await http.request('/mgt' + url, params, type);
        return res;
    },
    // bom分页列表
    async getList(params) {
        return await this.request("/bom/list/page", params, "get");
    },
};

export default api;
