import axios from "axios";
import axios2 from "/src/http/axios.js";
import { useProgress } from '@/stores/file';
//  import http from "/src/http/index.js";
import { getFileName } from "./common.js"
import { ElMessage } from 'element-plus'

const store = useProgress();
export function exportExcel(apiUrl, params, title, loding) {

  const host = window.location.origin;
  return new Promise((resolve, reject) => {
    // request拦截器
    let user = sessionStorage.getItem("token")
    axios
      .get(host + apiUrl, {
        headers: {
          'Authorization': user
        },
        params: params,
        responseType: "blob" // 1.首先设置responseType对象格式为 blob:
      })
      .then(
        res => {
          //resolve(res)
          if (res.status == 205) {
            ElMessage({
              type: "error",
              message: "导出失败，数据为空！"
            })
            loding.close();
            return;
          }
          if (res.status == 206) {
            ElMessage({
              type: "error",
              message: "表格汇总下载只支持xls或xlsx格式的文件"
            })
            loding.close();
            return;
          }
          if (res.status != 200) {
            ElMessage({
              type: "error",
              message: "报表导出异常！"
            })
            loding.close();
            return;
          }
          if (title) {
            title = title
          } else {
            title = getFileName(res)
          }
          let blob = new Blob([res.data], {
            type: "application/vnd.ms-excel"
          }); // 2.获取请求返回的response对象中的blob 设置文件类型，这里以excel为例
          let url = window.URL.createObjectURL(blob); // 3.创建一个临时的url指向blob对象
          // 4.创建url之后可以模拟对此文件对象的一系列操作，例如：预览、下载
          let a = document.createElement("a");
          a.href = url;
          a.download = title;
          a.click();
          // 5.释放这个临时的对象url
          window.URL.revokeObjectURL(url);
          loding.close();

        },
        err => {
          resolve(err.response);
        }
      )
      .catch(error => {
        reject(error);
      });
  });


}


export function exportExcelPOST(apiUrl, params, title, loding) {

  const host = window.location.origin;
  return new Promise((resolve, reject) => {
    // request拦截器
    let user = sessionStorage.getItem("token")
    axios
      .post(host + apiUrl, params, {
        headers: {
          'Authorization': user,
        },
        responseType: "blob" // 1.首先设置responseType对象格式为 blob:
      })
      .then(
        res => {
          //resolve(res)
          if (res.status == 205) {
            ElMessage({
              type: "error",
              message: "导出失败，数据为空！"
            })
            loding.close();
            return;
          }
          if (res.status == 206) {
            ElMessage({
              type: "error",
              message: "表格汇总下载只支持xls或xlsx格式的文件"
            })
            loding.close();
            return;
          }
          if (res.status != 200) {
            ElMessage({
              type: "error",
              message: "报表导出异常！"
            })
            loding.close();
            return;
          }
          if (title) {
            title = title
          } else {
            title = getFileName(res)
          }
          // console.log('返回表格流', res)
          let blob = new Blob([res.data], {
            type: "application/vnd.ms-excel"
          }); // 2.获取请求返回的response对象中的blob 设置文件类型，这里以excel为例
          let url = window.URL.createObjectURL(blob); // 3.创建一个临时的url指向blob对象
          // 4.创建url之后可以模拟对此文件对象的一系列操作，例如：预览、下载
          let a = document.createElement("a");
          a.href = url;
          a.download = title;
          a.click();
          // 5.释放这个临时的对象url
          window.URL.revokeObjectURL(url);
          loding.close();

        },
        err => {
          resolve(err.response);
        }
      )
      .catch(error => {
        reject(error);
      });
  });


}

// export function (apiUrl, params, title, loding) {


export function exportMp4(apiUrl, params, title, id,size) {
  return new Promise((resolve, reject) => {
    // request拦截器
    let user = sessionStorage.getItem("token")
    axios
      .get(apiUrl, {
        headers: {
          'Authorization': user,

        },
        params: params,
        responseType: "blob", // 1.首先设置responseType对象格式为 blob:
        onDownloadProgress(progress) {
          let downProgress = Math.round(100 * progress.loaded / size) // progress对象中的loaded表示已经下载的数量，total表示总数量，这里计算出百分比
          // store.SET_PROGRESS({
          //     id: id,
          //     progress: downProgress,
          // }) // 将此次下载的文件名和下载进度组成对象再用vuex状态管理
          store.SET_PROGRESS({
                id: id,
                progress: downProgress,
            })
        }
      })
      .then(
        res => {
          if (title) {
            title = title
          } else {
            title = getFileName(res)
          }
          console.log('返回流', res)
          let blob = new Blob([res.data], {
            // type: "image/jpeg"
            type: "video/mp4"
          }); // 2.获取请求返回的response对象中的blob 设置文件类型，这里以excel为例
          let url = window.URL.createObjectURL(blob); // 3.创建一个临时的url指向blob对象
          // 4.创建url之后可以模拟对此文件对象的一系列操作，例如：预览、下载
          let a = document.createElement("a");
          a.href = url;
          a.download = title;
          a.click();
          // 5.释放这个临时的对象url
          window.URL.revokeObjectURL(url);
        },
        err => {
          resolve(err.response);
        }
      )
      .catch(error => {
        reject(error);
      });
  });


}