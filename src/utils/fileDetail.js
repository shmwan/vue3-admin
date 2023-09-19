

import http from "@/http/index.js";

export function fileUpload(apiUrl, params) {
    let res = http.request(apiUrl, params, 'post');
    return res;

}

export function viewPicture(params) {
    let imgBaseUrl = config().imgBaseUrl + config().bucketName + "/";
    return imgBaseUrl + params;
}

export function imgBaseUrl() {
    let imgBaseUrl = config().imgBaseUrl + config().bucketName + "/";
    return imgBaseUrl;
}

export function fileCheck(apiUrl, params) {
    let res = http.request(apiUrl, params, 'post');
    return res;
}

export function dataURLtoFile(dataURI, type) {
    let binary = atob(dataURI.split(',')[1]);
    let array = [];
    for (let i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], { type: type });
}

