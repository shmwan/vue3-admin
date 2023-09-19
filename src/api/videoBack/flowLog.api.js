import http from "@/http/index.js";

const api = {
    async request(url, params, type = "get") {
        let res = await http.request('/mgt' + url, params, type);
        return res;
    },
    // 组织列表---分页查询信息
    async flowLogList(params) {
        if (!params) {
            params = {
                pageSize: 99999,
                pageNo: 1
            };
        }
        return await this.request("/matter/log/page", params, "post");
    },
    //   导出
    async flowLogExport(params) {
        return await this.request("/matter/log/page/export", params, "post");
    },
};

export default api;