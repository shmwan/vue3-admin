export const matterRoute = [
  {
    path: '/',
    name: '物料清点管理',
    component: () => import('../components/common/home.vue'),
    meta: { title: '物料清点管理' },
    children: [
      {
        path: '/matter',
        name: '物料称重',
        component: () => import('../views/matter/matter.vue'),
        meta: { title: '物料称重' }
      },
      {
        path: '/inventory',
        name: '物料清点',
        component: () => import('../views/matter/inventory.vue'),
        meta: { title: '物料清点' }
      },
      {
        path: '/InventoryLog',
        name: '清点日志',
        component: () => import('../views/InventoryLog/InventoryLog.vue'),
        meta: { title: '清点日志' }
      },
      {
        path: '/deliverOrderManagement',
        name: '送货单查询',
        component: () =>
          import(
            '../views/matterInventoryManagement/DeliverOrderManagement.vue'
          ),
        meta: { title: '送货单查询' }
      }
    ]
  }
]
export default matterRoute
