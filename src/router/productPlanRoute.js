import i18n from "@/lang/index.js"
const $t = i18n.global.t;

export const ProductPlanRoute = [
    {
        path: "/",
        name: "生产计划管理",
        component: () => import("../components/common/home.vue"),
        meta: { title: "生产计划管理" },
        children: [
            {
                path: "/productPlan",
                name: "生产计划",
                component: () => import("@/views/productPlanManager/productPlan/index.vue"),
                meta: { title: "生产计划" },
            },
            {
                path: "/planHistory",
                name: "生产计划导入历史",
                component: () => import("@/views/productPlanManager/productPlanHistory/index.vue"),
                meta: { title: "生产计划导入历史" },
            },
        ],
    },
    {
        path: "/",
        name: "工艺流程",
        component: () => import("../components/common/home.vue"),
        meta: { title: "工艺流程" },
        children: [
            {
                path: "/processFlow",
                name: "工艺流程管理",
                component: () => import("@/views/processFlow/index.vue"),
                meta: { title: "工艺流程管理" },
            },
        ],
    },
]
export default ProductPlanRoute;