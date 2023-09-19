import common from './zh/common.js'
import baseData from './zh/baseData/index.js'
import router from './zh/router.js'
import system from './zh/system/system.js'
import flowLog from './zh/flowLog.js'
import InventoryManage from './zh/InventoryManage/InventoryManage.js'
import aiBigScreen from './zh/aiBigScreen.js'
import matterWeigh from './zh/matterWeigh.js'
import productPlan from './zh/productPlan/index.js'
import productDataStatistics from './zh/productDataStatistics.js'
const lang = {
  common,
  ...baseData,
  router,
  ...system,
  flowLog,
  ...InventoryManage,
  aiBigScreen,
  matterWeigh,
  ...productPlan,
  productDataStatistics
}
export default {
  lang
}
