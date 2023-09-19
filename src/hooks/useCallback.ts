
import {ElMessage} from "element-plus"

export function useCallback(res:any,text:string = "删除成功！") {
    if (res.code == 200) {
        ElMessage({
          message: text,
          type: "success",
        });
        return true;
    } else {
      ElMessage({
        message: res.message ,
        type: "error",
      });
      return false;
    }
}