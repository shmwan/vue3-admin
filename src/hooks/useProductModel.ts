import api from "@/api/AIBasicData/index.api.js"
export const useProductModel = () => {
    const getData = async () => {
        const params = {
            pageNo: 1,
            pageSize: 10000
          }
      const res = await api.ProductModel.getList(params);
      return res.data;
    };
    return {
        getData,
    };
};