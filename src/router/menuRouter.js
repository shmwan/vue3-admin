import i18n from '@/lang/index.js'
const $t = i18n.global.t
export const menuRouter = [
  {
    path: '/',
    redirect: '/home',
    name1: '系统管理',
    name: $t('lang.router.system'),
    component: () => import('../components/common/home.vue'),
    children: [
      {
        path: '/home',
        name1: '首页',
        name: $t('lang.router.home'),
        component: () => import('../views/system/home/home.vue')
      },
      {
        path: '/diction',
        name1: '字典管理',
        name: $t('lang.router.diction'),
        component: () => import('../views/system/diction/diction.vue')
      },
      {
        path: '/log',
        name1: '日志管理',
        name: $t('lang.router.log'),
        component: () => import('../views/log/log.vue')
      },
      {
        path: '/role',
        name1: '角色管理',
        name: $t('lang.router.role'),
        component: () => import('../views/system/role/role.vue')
      },
      {
        path: '/organ',
        name1: '组织管理',
        name: $t('lang.router.organ'),
        component: () => import('../views/system/organ/organ.vue')
      },
      {
        path: '/user',
        name1: '用户管理',
        name: $t('lang.router.user'),
        component: () => import('../views/system/user/index.vue')
      },
      {
        path: '/menu',
        name1: '菜单管理',
        name: $t('lang.router.menu'),
        component: () => import('../views/system/menu/index.vue')
      }
    ]
  }
]
export default menuRouter
