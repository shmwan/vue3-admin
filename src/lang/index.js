import { createI18n } from 'vue-i18n'
import en from './en.js'
import zh from './zh.js'
const language = config().language.indexOf('en') > -1 ? 'en-US' : 'zh-CN'
const i18n = createI18n({
  locale: language,
  messages: {
    'en-US': en,
    'zh-CN': zh
  }
})
export default i18n
