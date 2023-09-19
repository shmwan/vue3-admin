import { createRouter, createWebHistory } from 'vue-router'
import baseRoute from './baseRoute'
import menuRouter from './menuRouter'
import baseDataRoute from './baseDataRoute'
import matterRoute from './matterRoute'

import VideoBackRoute from './videoBackRoute'
import AIVisualCount from './AIVisualCount'
import productionDataRoute from './productionDataRoute'
import productPlan from './productPlanRoute'
import productionMaterialRoute from './productionMaterialRoute'
import AGVTrackRouter from './olRouter'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
const allRoutes = [
  ...baseRoute,
  ...menuRouter,
  ...baseDataRoute,
  ...matterRoute,
  ...VideoBackRoute,
  ...AIVisualCount,
  ...productionDataRoute,
  ...productPlan,
  ...productionMaterialRoute,
  ...AGVTrackRouter
]
const router = createRouter({
  history: createWebHistory(),
  routes: allRoutes
})
import { useMenuList } from '@/stores/menu'

router.beforeEach((to, from, next) => {
  // console.log(to)
  let { token, url } = to.query
  if (token) {
    sessionStorage.setItem('token', token)
    sessionStorage.setItem('url', url)
  } else {
    token = sessionStorage.getItem('token')
  }
  const AgvToken = sessionStorage.getItem('AgvToken')
  // debugger
  const menuStore = useMenuList()
  if (to.path === '/bigScreen') {
    sessionStorage.setItem('ifBig', true)
    next()
  } else {
    sessionStorage.setItem('ifBig', false)
  }
  if (to.path === '/AGVLogin' || to.path == "/AGVTrack") {
    sessionStorage.setItem('ifAgv', true)
    next()
  } else {
    sessionStorage.setItem('ifAgv', false)
  }
  if (to.path === '/login' || to.path === '/AGVLogin') {
    next()
  } else {
    let ifAgv = sessionStorage.getItem('ifAgv');
    if (ifAgv && ifAgv == 'true') {
      if (AgvToken == '' || !AgvToken) {
        next('/AGVLogin')
      } else {
        sessionStorage.setItem('ifAgv', true)
        next()
      }
    }
    if (token == '' || !token) {
      next('/login')
    } else {
      if (to.path === '/AGVTrack') {
        next()
      } else {
        sessionStorage.setItem('ifAgv', false)
        const menuList = menuStore.getMenuList
        if (menuList && menuList.length > 0) {
          next()
        } else {
          menuStore.setMenuList().then(res => {
            next()
          })
        }
      }
    }
  }
  if (to.path === '/bigScreen') {
    document.title = 'AI视觉MES监控系统'
  }
  if (to.path === '/AGVTrack' || to.path === '/AGVLogin') {
    document.title = '厂内物料流转监控看板'
  }
  NProgress.start()
})

router.afterEach((to, from) => {
  NProgress.done()
})
export default router
