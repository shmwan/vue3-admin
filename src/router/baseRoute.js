export const LAYOUT = () => import('@/components/common/home.vue')
export const ErrorRoute = {
  path: '/:catchAll(.*)',
  name: 'ErrorPage',
  component: () => import('@/views/system/404.vue'),
  meta: {
    title: 'ErrorPage'
  }
}
export const LoginRoute = {
  path: '/login',
  name: 'Login',
  component: () => import('@/views/login/login.vue'),
  meta: {
    title: '登录'
  }
}
export const bigScreenRoute = {
  path: '/bigScreen',
  name: 'BigScreen',
  component: () => import('@/views/bigScreen/bigScreenNew.vue'),
  meta: {
    title: '大屏'
  }
}
export const AGVLogin = {
  path: '/AGVlogin',
  name: 'AGVlogin',
  component: () => import('@/views/AGV/login.vue'),
  meta: {
    title: '登录'
  }
}
export const baseLoginRoute = {
  path: '/',
  redirect: '/login'
}
export const baseErrorRoute = {
  path: '/',
  redirect: '/404'
}

export const prorTable = {
  path: '/prorTable',
  name: 'prorTable',
  component: () => import('@/components/home1.vue'),
  meta: {
    title: '大屏'
  }
}
export default [
  LoginRoute,
  ErrorRoute,
  baseLoginRoute,
  bigScreenRoute,
  prorTable,
  AGVLogin
]
