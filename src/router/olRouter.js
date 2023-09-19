const AGVTrackRouter = [
  {
    path: '/AGVTrack',
    name: 'AGVTrack',
    component: () => import('@/views/AGV/AGVTrack.vue'),
    meta: {
      title: 'Agv轨迹服务'
    }
  }
]
export default AGVTrackRouter
