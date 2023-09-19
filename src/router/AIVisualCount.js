export const AIVisualCount = [
  {
    path: '/',
    name: 'AI视觉站点管理',
    component: () => import('../components/common/home.vue'),
    meta: { title: 'AI视觉站点管理' },
    children: [
      {
        path: '/AIVisualCountSite',
        name: 'AI视觉计数站点',
        component: () =>
          import(
            '../views/AIVisualCount/aiVisualCountSite/aiVisualCountSite.vue'
          ),
        meta: { title: 'AI视觉计数站点' }
      },
      {
        path: '/AIVisualCountHistory',
        name: 'AI计数历史',
        component: () =>
          import(
            '../views/AIVisualCount/aiVisualCountHistory/aiVisualCountHistory.vue'
          ),
        meta: { title: 'AI计数历史' }
      }
    ]
  },
  {
    path: '/',
    name: '图表统计',
    redirect: '/matterAiCharts',
    component: () => import('../components/common/home.vue'),
    meta: { title: '图表统计' },
    children: [
      {
        path: '/matterAiCharts',
        name: 'AI看板',
        component: () => import('@/views/AiCharts/AiCharts.vue'),
        meta: {
          title: 'AI看板'
        }
      }
    ]
  }
]
export default AIVisualCount
