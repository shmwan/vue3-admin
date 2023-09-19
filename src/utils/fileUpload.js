import axios from "axios";
export function fileUpload(data, store) {
  return new Promise((resolve, reject) => {
    // request拦截器
    let user = sessionStorage.getItem("token");
    const host = window.location.origin;
    axios
      .post(host + '/api/file/minio/upload/file', data, {
        headers: {
          'Authorization': user
        },
        // onUploadProgress(progress) {
        //   console.log(progress)
        //   let uploadProgress = (progress.loaded / progress.total * 100).toFixed(2) + '%';
        // }
      }).then((res) => {
        resolve(res.data)
      })
      .catch(error => {
        reject(error);
      });
  });

}
export function fileUpload1(data, url, store) {
  return new Promise((resolve, reject) => {
    // request拦截器
    console.log(999, url)
    let user = JSON.parse(sessionStorage.getItem("userInfo"));
    const host = window.location.origin;
    axios
      // /api/mgt/fire-control-check/get-file-hidden-danger
      .post(host + url, data, {
        headers: {
          'Authorization': user
        },
        onUploadProgress(progress) {
          //  console.log(progress)
          //  let uploadProgress = Math.round(progress.loaded / progress.total * 100) + '%';
          //  store.commit('file/SET_UPLOAD_PROGRESS',uploadProgress)
        }
      }).then((res) => {
        resolve(res.data)
      })
      .catch(error => {
        reject(error);
      });
  });

}