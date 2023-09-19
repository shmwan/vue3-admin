import i18n from "@/lang/index.js"
const $t = i18n.global.t;
export const baseDataRoute = [
  {
    path: "/",
    name: $t('lang.router.baseData'),
    component: () => import("../components/common/home.vue"),
    meta: { title: $t('lang.router.baseData') },
    children: [
      {
        path: "/MaterialInfo",
        name: $t('lang.router.wlBaseInfo'),
        component: () => import("../views/BasicData/MaterialInfo/MaterialInfo.vue"),
        meta: { title: $t('lang.router.wlBaseInfo') },
      },
      {
        path: "/SupplierInfo",
        name: $t('lang.router.supplierInfo'),
        component: () => import("../views/BasicData/SupplierInfo/SupplierInfo.vue"),
        meta: { title: $t('lang.router.supplierInfo') },
      },
      {
        path: "/DeviationRules",
        name: $t('lang.router.deviation'),
        component: () => import("../views/BasicData/DeviationRules/DeviationRules.vue"),
        meta: { title: $t('lang.router.deviation') },
      },
      {
        path: "/Productionline",
        name: $t('lang.router.ProductionLine'),
        component: () => import("../views/AIBasicData/Productionline/Productionline.vue"),
        meta: { title: $t('lang.router.ProductionLine') },
      },
      {
        path: "/ProductModel",
        name: $t('lang.router.ProductModel'),
        component: () =>
          import("../views/AIBasicData/ProductModel/ProductModel.vue"),
        meta: { title: $t('lang.router.ProductModel') }
      },
      {
        path: "/BOMList",
        name: $t('lang.router.BOMlist'),
        component: () => import("../views/AIBasicData/BOMList/BOMList.vue"),
        meta: { title: $t('lang.router.BOMlist') },
      },
      {
        path: "/FactoryManage",
        name: $t('lang.router.FactoryManage'),
        component: () => import("../views/AIBasicData/FactoryManage/FactoryManage.vue"),
        meta: { title: $t('lang.router.FactoryManage') },
      },
    ],
  },
  {
    path: "/",
    name: $t('lang.router.WLcheck'),
    component: () => import("../components/common/home.vue"),
    meta: { title: $t('lang.router.WLcheck') },
    children: [
      {
        path: "/matter",
        name: $t('lang.router.WLweight'),
        component: () => import("../views/matter/matter.vue"),
        meta: { title: $t('lang.router.WLweight') },
      }
    ],
  },
]
export default baseDataRoute;