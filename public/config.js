'use strict'
const config = function () {
  const configEnv = {
    language: 'zh-CN',
    playerTimer: 1000 * 60 * 5, //视频sdk多长时间 销毁加载一次流  毫秒单位
    aiBigLineTimer: 1000 * 60, //产线轮播时间设置
    isUseApi: false, //AI 大屏是走接口 true 还是走配置  false
    ifUseMock: true, //当没数据时  左右图表是否使用假数据
    aiData: [
      {
        cameraChannelId: '', //安防相机channelId
        lineCode: 'QXD1A01', //线体标识
        longLineCode: 'XCQX100201L01', // 产线（长编码）
        modelCode: 'IPC039_B01', //机种型号
        partNo: '', //成品料号
        productionImage: '', //产品图片地址
        putInStationCountId: 'COUNTER01', //投入工站计数器id  线头id
        putInStationVideoAngle: '0', //投入工站视频旋转角度   线头 sdk 旋转角度
        putInStationVideoUrl: 'ws://192.169.6.230:8765', //投入工站视频流地址 线头sdk 视频地址
        putOutStationCountId: 'COUNTER04', //产出工站计数器id 线尾id
        putOutStationVideoAngle: '180', //产出工站视频旋转角度 线尾角度
        putOutStationVideoUrl: 'ws://192.169.6.74:8765', //产出工站视频流地址
        workClass: '' // 班次
      }
    ],
    // 之前Ai 大屏免登 的token  现在不需要了
    baseScoket: 'http://192.168.36.68:30035/msg-ws',
    AgvbaseScoket: 'http://172.18.8.245:8164/ws-agv',
    // 物料视频溯源
    materialVideoTraceability: {
      maxSelectedOneTime: 30 * 60 * 1000, // 每个视频最大选择时间 (毫秒)
      maxPlayTime: 1000 * 60, // 最大播放时长 (毫秒)
      maxSelected: 50, // 最大选择数量
      maxConnectTime: 1000 * 60 * 60, // 拼接最大时长(毫秒)
      compatibilityTime: 10 // 兼容时长,支持正负数(秒)
    },
    systemCode: 'XCQX_MATTER',
    bucketName: 'test',
    imgBaseUrl: 'http://192.168.36.68:30880/test/',
    topN: 10,
    AgvPickTime: 5000,
    defaultChannel: {
      id: '9392c199-2479-40b6-bf98-67ca332115cc',
      name: '相机'
    }
  }
  return configEnv
}
