export const productionDataRoute = [
  {
      path: "/",
      name: "生产数据统计",
      component: () => import("../components/common/home.vue"),
      meta: { title: "生产数据统计" },
      children: [
          {
              path: "/productionDataQuery",
              name: "生产数据查询",
              component: () => import("../views/productionData/productionDataQuery.vue"),
              meta: { title: "生产数据查询" },
          },
          {
              path: "/productionMateriaStatistics",
              name: "生产用料统计",
              component: () =>
                  import("../views/productionData/productionMateriaStatistics.vue"),
              meta: { title: "生产用料统计" }
          },
      ],
  },

]
export default productionDataRoute;