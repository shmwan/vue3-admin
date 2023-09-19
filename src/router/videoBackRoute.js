export const VideoBackRoute = [
  {
    path: '/',
    name: '物料视频回源',
    component: () => import('../components/common/home.vue'),
    meta: { title: '物料视频回源' },
    children: [
      {
        path: '/materialFlowLog',
        name: '物料流转日志',
        component: () => import('../views/videoBack/materialFlowLog.vue'),
        meta: { title: '物料流转日志' }
      },
      {
        path: '/materialVideoTraceability',
        name: '物料视频溯源',
        component: () =>
          import('../views/videoBack/materialVideoTraceability.vue'),
        meta: { title: '物料视频溯源' }
      },
      {
        path: '/machineRefueling',
        name: '机台换料查询',
        component: () => import('../views/videoBack/machineRefueling.vue'),
        meta: { title: '机台换料查询' }
      },
      {
        path: '/materialDownload',
        name: '下载中心',
        component: () => import('../views/videoBack/download.vue'),
        meta: { title: '下载中心' }
      }
    ]
  }
]
export default VideoBackRoute
