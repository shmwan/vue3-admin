let baseScoket = config().baseScoket
let useSocket = (rmqServer = baseScoket) => {
  let headers = {
    Authorization: sessionStorage.getItem('token')
  }
  let timer = null
  let stompClient = null
  let failNum = $ref(0)
  const init = () => {
    connection()
    timer = setInterval(() => {
      try {
        stompClient.send('test')
      } catch (err) {
        failNum++
        if (failNum > 5) {
          console.error('重连失败')
          return
        }
        connection()
      }
    }, 5000)
  }
  const connection = () => {
    let socketBaseUrl = rmqServer
    if (!socketBaseUrl) {
      console.error('通讯地址未配置')
      return
    }
    let socket = new SockJS(socketBaseUrl)
    // 获取STOMP子协议的客户端对象
    stompClient = Stomp.over(socket)
    // 定义客户端的认证信息,按需求配置
  }
  const disconnect = () => {
    if (stompClient) {
      stompClient.disconnect()
    }
    if (timer) {
      clearInterval(timer)
    }
  }
  init()
  return {
    stompClient
  }
}
export default useSocket
