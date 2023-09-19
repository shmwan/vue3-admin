import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import pinia from '@/stores'
// 引入全局组件
import api from './api/common.api' // 引入全局接口api
import '@/assets/css/common.less'
import { _has } from '@/utils/directive.js'
import '@/fonts/iconfont.css'

import '@/utils/flexible'

//完整引入element-plus
//在main.js中添加引入代码
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import '@/fonts/font.less' // 引入字体样式
import vue3SeamlessScroll from 'vue3-seamless-scroll'

// 国际化
import i18n from '@/lang/index.js'
import * as echarts from 'echarts'

import 'castiron'
import 'echarts-gl'
// 引入全局自定义指令
let app = createApp(App)
app.use(vue3SeamlessScroll)
app.directive('has', {
  mounted(el, binding) {
    if (!_has(binding.value)) {
      el.parentNode && el.parentNode.removeChild(el)
    }
  }
})
app.config.globalProperties.$api = api
app.config.globalProperties.$echarts = echarts
import buttonVue from '@/components/elep/button.vue'
import SvgIcon from './components/common/svgIcon.vue'
app.component('buttonVue', buttonVue)
app.component('svgIcon', SvgIcon)
app.config.globalProperties.$t = i18n.global.t
// const language = config().language.indexOf('en') > -1 ? en : zh;
// app.use(ElementPlus, {
//     locale: language,
// });
import { ElInput } from 'element-plus'
ElInput.componentName = 'oelInput'
ElInput.name = 'oelInput'
app.use(ElInput)
import myInput from '@/components/elep/ElInput.vue'
const component = {
  install: function (Vue) {
    Vue.component('el-input', myInput)
  } //'component-name'这就是后面可以使用的组件的名字，install是默认的一个方法
}
app.use(component)

app.use(router).use(pinia).use(ElementPlus).mount('#BaseApp')
