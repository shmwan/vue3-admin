// import { reactive } from "vue";
import api from "@/api/system/diction.api.js";
export const useDictData = (): any => {
  const getDictData = async (groupCode: string) => {
    const res: any = await api.selectBy({ groupCode });
    return res.data;
  };
  return {
    getDictData,
  };
};
