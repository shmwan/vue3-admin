// import SockJS from 'sockjs-client/dist/sockjs.min.js';
// import Stomp from "stompjs";
import { useScoketData } from '@/stores/scoket'
const stores = useScoketData()
class SocketStomp {
  /**
   * @constructor
   * @param rmqServer : String
   * @param {
   *   subscribe :String
   * }
   * @param reContentNum {String}
   */
  constructor(rmqServer, subscribe, reContentNum = 5) {
    this.rmqServer = rmqServer
    this.subscribe = subscribe
    this.reContentNum = reContentNum
    this.stompClient = null
    this.failNum = null //计算重连次数
  }
  // 调用初始化
  init(str) {
    return new Promise((resolve, reject) => {
      const _this = this
      let data = _this.connection(str)
      // console.log("结果", data);
      resolve(data)
      this.timer = setInterval(() => {
        try {
          _this.stompClient.send('test')
        } catch (err) {
          this.failNum++
          if (this.failNum > 5) {
            console.error('重连失败')
            return
          }
          let data = _this.connection(str)
          resolve(data)
        }
      }, 5000)
    })
  }
  // 建立连接对象
  connection(str) {
    return new Promise(resolve => {
      let socketBaseUrl = this.rmqServer
      if (!socketBaseUrl) {
        console.error('通讯地址未配置')
        return
      }
      let socket = new SockJS(socketBaseUrl)
      // 获取STOMP子协议的客户端对象
      this.stompClient = Stomp.over(socket)
      // 定义客户端的认证信息,按需求配置
      let headers = {
        Authorization: sessionStorage.getItem('token')
      }
      this.stompClient.connect(
        headers,
        () => {
          this.stompClient.subscribe(
            this.subscribe,
            msg => {
              console.log('推送', msg.body)
              // 订阅服务端提供的某个topic
              if (str == 'AIBig') {
                let data = msg.body
                resolve(data)

                stores.setMatterCount(data)
              } else {
                let data = msg.body
                resolve(data)
                stores.setScoketData(data)
              }
            },
            headers
          )
        },
        err => {
          // 连接发生错误时的处理函数
          console.log(err, '错误')
        }
      )
    })
  }
  disconnect() {
    if (this.stompClient) {
      this.stompClient.disconnect()
    }
    if (this.timer) {
      clearInterval(this.timer)
    }
  }
}

export default SocketStomp
