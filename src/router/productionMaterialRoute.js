const productionMaterialRoute = [
  {
    path: '/',
    name: '生产用料管理',
    component: () => import('../components/common/home.vue'),
    meta: { title: '生产用料管理' },
    children: [
      {
        path: '/usedMaterialRecord',
        name: '叫/领料记录',
        component: () =>
          import(
            '../views/productionMaterialManagement/usedMaterialRecord.vue'
          ),
        meta: { title: '叫/领料记录' }
      },
      {
        path: '/materialInventoryQuery',
        name: '物料库存查询',
        component: () =>
          import(
            '../views/productionMaterialManagement/materialInventoryQuery.vue'
          ),
        meta: { title: '物料库存查询' }
      },
      {
        path: '/materialWarningReminder',
        name: '用料预警提醒',
        component: () =>
          import(
            '../views/productionMaterialManagement/materialWarningReminder.vue'
          ),
        meta: { title: '用料预警提醒' }
      }
    ]
  }
]
export default productionMaterialRoute
