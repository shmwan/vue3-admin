import { ElLoading } from 'element-plus'
let useTable = ({ getTableData, inQuery, inReset, immediate = true }) => {
  let queryFormRef = ref(null)
  let queryForm = ref(null)
  let pageNo = ref(1)
  let pageSize = ref(10)
  let data = ref([])
  let total = ref(0)
  let loadingInstance = ref(null)

  let loadingStart = () => {
    loadingInstance = ElLoading.service({
      target: document.querySelector('.pro-table'),
      fullscreen: true
    })
  }
  let loadingClose = () => {
    nextTick(() => {
      loadingInstance.close()
    })
  }
  let getDataList = async () => {
    loadingStart()
    let params = {
      pageNo: pageNo.value,
      pageSize: pageSize.value
    }
    try {
      let { dataList, totalCount } = await getTableData(params)
      data.value = dataList
      total.value = totalCount
    } finally {
      loadingClose()
    }
  }
  function onCurrentChange(val) {
    pageNo.value = val
    getDataList()
  }
  function onSizeChange(val) {
    pageNo.value = 1
    pageSize.value = val
    getDataList()
  }
  let refresh = async () => {
    pageNo.value = 1
    pageSize.value = 10
    await getDataList()
  }
  let onQuery = async () => {
    if (inQuery) {
      await inQuery()
    }
    refresh()
  }
  let onReset = async () => {
    if (inReset) {
      await inReset()
    } else {
      await queryFormRef.value.resetFields()
      refresh()
    }
  }
  onMounted(async () => {
    if (!immediate) return
    await getDataList()
  })

  return {
    queryFormRef,
    queryForm,
    data,
    total,
    onQuery,
    onReset,
    refresh,
    pageNo,
    pageSize,
    onCurrentChange,
    onSizeChange
  }
}
export default useTable
