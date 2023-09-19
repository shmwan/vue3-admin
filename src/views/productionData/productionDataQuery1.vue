
<template>
  <pro-container>
    <pro-form ref="queryFormRef" v-if="showSearch" v-model="queryForm" :fields="fields" :query="true"
      :visible-label="true" @on-query="onQuery" @on-reset="onReset">
    </pro-form>
    <pro-table ref="proTableRef" :toolbars="toolbars" :data="data" :columns="columns" :total="total"
      v-model:page-no="pageNo" v-model:page-size="pageSize" @current-change="onCurrentChange" @size-change="onSizeChange">
      <template #technologicalProcessCode="{ row }">
        <el-button type="primary" text @click="onDetail(row)">{{ row.technologicalProcessCode }}</el-button>
      </template>
    </pro-table>
  </pro-container>
  <edit @close="close" :technologicalProcessCode="technologicalProcessCode" :isShow="isShow" v-if="editDlog">
  </edit>
</template>

<script setup lang="ts">
import { getCurrentInstance, reactive, onMounted } from 'vue'
import ProTable from '@/components/pro-table.vue'
import useTable from '@/hooks/useTable'
import edit from '@/views/processFlow/edit.vue'
import { ElMessage } from 'element-plus'
const { proxy } = getCurrentInstance() as any
const $t = proxy.$t
// let queryForm = $ref({
//   endTime: '',
//   id: '', // 工站标识
//   lineCode: '', // 线体标识
//   moNumber: '', //工单
//   startTime: '',
//   dateRange: []
// })
interface Data {
  endTime: String,
  id: String, // 工站标识
  lineCode: String, // 线体标识
  moNumber: String, //工单
  startTime: String,
  dateRange: any
}
let queryForm: Data = reactive({
  endTime: '',
  id: '', // 工站标识
  lineCode: '', // 线体标识
  moNumber: '', //工单
  startTime: '',
  dateRange: []
}
)
let editDlog = ref<boolean>(false)
let showSearch = ref<boolean>(false)

let isShow = ref<boolean>(false)
let technologicalProcessCode = ref<any>('')
let fields = $ref([
  {
    prop: 'id',
    label: '站点编号',
    component: 'input'
  },
  {
    prop: 'lineCode',
    label: '线体标识',
    component: 'input'
  },
  {
    prop: 'moNumber',
    label: '生产工单',
    component: 'input'
  },
  {
    prop: 'dateRange',
    label: '查询日期',
    component: 'date-picker',
    type: 'daterange',
    propsMap: ['startTime', 'endTime'],
    'value-format': 'YYYY-MM-DD',
    span: 6
  }
])

let proTableRef = $ref(null)
let toolbars = [
  // {
  //   label: '叫料申请',
  //   type: 'primary',
  //   disabled: true,
  //   click: () => {
  //     onUsedMaterialApply()
  //   }
  // }
]

let columns = $ref([
  { label: '线体标识', prop: 'lineCode' },
  { label: '站点编号', prop: 'id' },
  { label: '日期', prop: 'workDate' },
  { label: '时刻', prop: 'hour' },
  { label: '产品机型标识', prop: 'modelName' },
  { label: '生产工单编号', prop: 'moNumber' },
  { label: '班次', prop: 'workClass' },
  { label: '通过数量', prop: 'count' },
  { label: '不良数量', prop: 'defectiveCount' },
  { label: '返站通过数量', prop: 'returnCount' },
  { label: '更新时间', prop: 'updateTime' },
  {
    label: '工艺流程',
    prop: 'option',
    cellSlot: 'technologicalProcessCode'
  }
])
let getTableData = async (params: any) => {
  queryForm.endTime = queryForm.endTime.replace(/-/g, "")
  queryForm.startTime = queryForm.startTime.replace(/-/g, "")
  params = {
    ...params,
    ...queryForm
  }
  let {
    data: { records: data, total: totalCount }
  } = await proxy.$api.productDataQuery.getProductionDataList(params)
  return {
    dataList: data || [],
    totalCount: totalCount
  }
}
let {
  queryFormRef,
  data,
  total,
  onQuery,
  onReset,
  pageNo,
  pageSize,
  onCurrentChange,
  onSizeChange
} = useTable({
  getTableData
})
onMounted(() => {
  if (window.location.search.indexOf("?") != -1) {
    showSearch = false
    let routerData = getUrl(window.location.search)
    queryForm.lineCode = routerData.lineCode
    queryForm.startTime = routerData.date
    queryForm.endTime = routerData.date
    queryForm.dateRange = [queryForm.startTime, queryForm.endTime]
    console.log(queryForm)
    getTableData(queryForm)

    showSearch = true
  } else {
    showSearch = true
    getTableData(queryForm)
  }

})
function getUrl(url: any) {
  let returl: any = new Object();
  if (url.indexOf("?") != -1) {
    let queryString = url.substr(1);
    let queryParams = queryString.split("&");
    for (let i = 0; i < queryParams.length; i++) {
      let [key, value] = queryParams[i].split("=");
      returl[key] = decodeURI(value);
    }
  };
  return returl;
}
const onDetail = async (data: any) => {
  if (data.technologicalProcessCode) {
    technologicalProcessCode.value = data.technologicalProcessCode
    editDlog.value = true
    isShow.value = true
  }
}
/**
 * 回调子组件的事件
 *
 */
const close = () => {
  editDlog.value = false
}
</script>

<style scoped></style>

