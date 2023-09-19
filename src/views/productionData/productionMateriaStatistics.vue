<template>
  <pro-container>
    <pro-form ref="queryFormRef" v-model="queryForm" :fields="fields" :query="true" :visible-label="true"
      @on-query="onQuery" @on-reset="onReset">
    </pro-form>
    <pro-table ref="proTableRef" :toolbars="toolbars" :data="data" :columns="columns" :total="total"
      v-model:page-no="pageNo" v-model:page-size="pageSize" @current-change="onCurrentChange" @size-change="onSizeChange">
      <template #id="{ row }">
        {{ row.id }}<span v-if="row.siteCode">/</span>{{ row.siteCode }}
      </template>
      <template #modelName="{ row }">
        {{ row.modelName }} <span v-if="row.partNo">/</span> {{ row.partNo }}
      </template>
    </pro-table>
  </pro-container>
</template>

<script setup lang="ts">
import useTable from '@/hooks/useTable'
import useKeyEnter from "@/hooks/useKeyEnter.ts";
const { proxy } = getCurrentInstance() as any
let queryForm = $ref({
  modelName: '', // 产品机型
  endTime: '',
  id: '', // 工站标识
  lineCode: '', // 线体标识
  moNumber: '', //工单
  startTime: '',
  dateRange: []

})
let fields = $ref([
  {
    prop: 'modelName',
    label: '产品机型标识',
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
    prop: 'id',
    label: '站点编号',
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
let toolbars: any = [
  // {
  //   label: '叫料申请',
  //   type: 'primary',
  //   disabled: true,
  //   click: () => {
  //     onUsedMaterialApply()
  //   }
  // }
]
let getTableData = async (params: any) => {
  queryForm.endTime = queryForm.endTime.replace(/-/g, "")
  queryForm.startTime = queryForm.startTime.replace(/-/g, "")
  params = {
    ...params,
    ...queryForm
  }
  let {
    data: { records: data, total: totalCount }
  } = await proxy.$api.productDataQuery.getProductionUsedMatterList(params)
  return {
    dataList: data || [],
    totalCount: totalCount
  }
}

let columns = $ref([
  { label: '线体标识', prop: 'lineCode' },
  {
    label: 'AI站点/工艺站点标识', prop: 'id',
    cellSlot: 'id'
  },
  { label: '日期', prop: 'workDate' },
  {
    label: '产品机型标识/产品品号', prop: 'modelName',
    cellSlot: 'modelName'
  },
  { label: '生产工单', prop: 'moNumber' },
  { label: '计划产量', prop: 'planQty' },
  { label: '班次', prop: 'workClass' },
  { label: '物料编号', prop: 'matterCode' },
  { label: '累积用量', prop: 'accumulate' },
  { label: '已领取数量', prop: 'receive' },
  { label: '可领物料余量', prop: 'allowance' },
])
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
useKeyEnter(getTableData);
</script>

<style scoped></style>
