import { treeToList } from '@/utils/common.js'
import { useMenuList } from '@/stores/menu'
export function _has(value) {
  if (value == 'default') {
    return true
  }
  const menuStore = useMenuList()
  let menu = menuStore.getMenuList
  let menuList = treeToList(menu)
  let isExist = false
  if (value == 'default') {
    return true
  }
  const privilegeCodes = menuList
  const permissions = privilegeCodes.filter(ele => ele.type === 2)
  const permissionsArr = []
  permissions.forEach(i => {
    permissionsArr.push(i.requestUrl)
  })
  if (permissionsArr == undefined || !value) {
    return false
  }
  if (value.indexOf('&&') > -1) {
    let roles = value.split('&&')
    roles.some(role => {
      isExist = permissionsArr.includes(role)
    })
  } else {
    permissionsArr.forEach(element => {
      if (element == value) {
        isExist = true
      }
    })
  }
  return isExist
}
