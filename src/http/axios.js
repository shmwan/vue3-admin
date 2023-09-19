import axios from 'axios'
import router from '@/router'
import { ElMessage } from 'element-plus'
//引入nprogress 进度条插件
let PREFIX = 'api',
  IP = ''
if (process.env.NODE_ENV === 'development') {
  PREFIX = 'api'
  IP = 'http://localhost:8080'
}
// 创建axios实例
var instance = axios.create({
  timeout: 50000
})
let language = 'zh-CN'
if (config().language) {
  language = config().language.indexOf('zh') > -1 ? 'zh-CN' : 'en_us'
}
const token = config().bigToken
const othApi = [
  '/XCQXApi',
  '/deviceApi',
  '/videoUrlApi',
  '/channelApi',
  '/AgvApi',
  '/AgvAmrApi'
]
// request拦截器
instance.interceptors.request.use(
  config => {
    const pos = config.url.indexOf('/', 1)
    let proxyFlag = config.url.substring(0, pos)
    if (config.url.startsWith('/auth')) {
      config.url = 'uuacApi' + config.url
    } else if (othApi.includes(proxyFlag)) {
      config.url = '' + config.url
      // } else if (config.url.startsWith('/deviceApi')) {
      //   config.url = '' + config.url
      // } else if (config.url.startsWith('/channelApi')) {
      //   config.url = '' + config.url
      // } else if (config.url.startsWith('/videoUrlApi')) {
      //   config.url = '' + config.url
    } else {
      config.url = PREFIX + config.url
    }
    if (config.url.endsWith('json')) {
      config.url = IP + config.url.replace('/api', '')
    } else if (config.url.endsWith('picture/upload')) {
      config.headers['Content-Type'] = 'multipart/form-data'
    } else {
      config.headers['Content-Type'] = 'application/json;charset=UTF-8'
    }
    let user = sessionStorage.getItem('token')
    let userName1 = sessionStorage.getItem('userName1')
    // if ((config.data && config.data.reqType == 'aiBig') || (config.params && config.params.reqType == 'aiBig')) {
    //   config.headers['Authorization'] = token;
    // } else {
    //   config.headers['Authorization'] = user ? `${user}` : '';
    // }
    config.headers['Authorization'] = user ? `${user}` : ''
    config.headers['userName'] = userName1
      ? `${encodeURIComponent(userName1)}`
      : ''
    const AgvToken = sessionStorage.getItem('AgvToken')

    if (config.url.indexOf('/mgt/agv/board/receive/material') > -1) {
      config.headers['Authorization'] = AgvToken ? `${AgvToken}` : ''
    }
    config.headers['Accept-Language'] = language
    return config
  },
  error => {
    console.log(error)
    Promise.reject(error)
  }
)

// respone拦截器

const url = sessionStorage.getItem('url') // 获取当前页面的URL地址;
const str = sessionStorage.getItem('ifBig')
  ? sessionStorage.getItem('ifBig')
  : 'false'

instance.interceptors.response.use(
  response => {
    // NProgress.done()
    if (response.status === 200) {
      // 此处判断登录是否过期
      if (response.data.code === 402 || response.data.code === 403) {
        if (url) {
          window.location.href = url
        } else {
          if (sessionStorage.getItem('ifBig') == 'true') {
            router.push('/bigScreen')
          } else if (sessionStorage.getItem('ifAgv') == 'true') {
            router.push('/AGVLogin')
          } else {
            router.push('/login')
          }
        }
      } else if (response.data.code === 401) {
      } else if (response.data.code === 200 || response.data.result == 0) {
        let data = response.data
        if (typeof data === 'string') {
          data = JSON.parse(data)
          return data
        } else {
          return data
        }
      } else {
        ElMessage({
          message: response.data.message + '!' || response.data.msg + '!',
          type: 'error'
        })
        return Promise.reject(response)
      }
    } else {
      return Promise.reject('error:' + response.status)
    }
  },
  error => {
    console.log('err' + error)
    // NProgress.done()
    return Promise.reject(error)
  }
)

export default instance
