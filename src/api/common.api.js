import login from './login.api'
import system from './system/system.api'
import log from './log/log.api'
import matter from './matter/index.api'
import bigScreen from './bigScreen/bigScreen.api'
import BasicData from './BasicData/index.api'
import videoBack from './videoBack/index.api'
import aiVisualCount from './aiVisualCount/aiVisualCount.api'
import aiBasicData from './AIBasicData/index.api'
import productPlan from './productPlan/index.api'
import processFlow from './processFlow/index.api'
import productDataStatistics from './productDataStatistics/index.api'
import productionMaterial from './productionMaterial/index.api'
import AGV from './AGV/AGV.api'
export default {
  login,
  log,
  bigScreen,
  aiVisualCount,
  ...matter,
  ...BasicData,
  ...system,
  ...videoBack,
  ...aiBasicData,
  productPlan,
  processFlow,
  AGV,
  ...productDataStatistics,
  ...productionMaterial
}
