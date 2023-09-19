import { ElMessageBox } from 'element-plus'

export async function useConfirm(
  callback: Function,
  data: any,
  text = '确定删除该数据'
) {
  await ElMessageBox.confirm(text, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      console.log(111)
      callback(data)
      return false
    })
    .catch(() => {
      return false
    })
}

export async function useConfirmNew(
  callback: Function,
  data: any,
  text = '确定删除该数据'
) {
  await ElMessageBox.confirm(text, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      console.log(111)
      callback(data, true)
      return true
    })
    .catch(() => {
      callback(data, false)
      return false
    })
}
