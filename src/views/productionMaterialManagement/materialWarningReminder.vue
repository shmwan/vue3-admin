<template>
  <pro-container>
    <pro-form
      ref="queryFormRef"
      v-model="queryForm"
      :fields="fields"
      query
      visible-label
      @on-query="onQuery"
      @on-reset="onReset"
    >
    </pro-form>
    <pro-table
      ref="proTableRef"
      :data="data"
      :columns="columns"
      :total="total"
      v-model:page-no="pageNo"
      v-model:page-size="pageSize"
      @current-change="onCurrentChange"
      @size-change="onSizeChange"
    >
    </pro-table>
  </pro-container>
</template>

<script setup lang="ts">
  import useTable from '@/hooks/useTable'
  import useKeyEnter from '@/hooks/useKeyEnter.ts'
  const { proxy } = getCurrentInstance()

  let queryForm = $ref({
    lineCode: '',
    modelOrProductionCode: '',
    materialNumber: '',
    timeRange: []
  })
  let fields = $ref([
    {
      prop: 'lineCode',
      label: '线体标识',
      component: 'input'
    },
    {
      prop: 'modelOrProductionCode',
      label: '产品机型标识/品号',
      component: 'input'
    },
    {
      prop: 'materialNumber',
      label: '物料编号',
      component: 'input'
    },
    {
      prop: 'timeRange',
      label: '查询日期',
      component: 'date-picker',
      type: 'daterange',
      propsMap: ['startTime', 'endTime'],
      'value-format': 'YYYY-MM-DD HH:mm:ss'
    }
  ])

  let proTableRef = $ref(null)

  let getTableData = async params => {
    params = {
      ...params,
      ...queryForm
    }
    let {
      data: { records: data, total: totalCount }
    } = await proxy.$api.materialWarningReminder.getMaterialWarnList(params)
    return {
      dataList: data || [],
      totalCount: totalCount
    }
  }

  let columns = $ref([
    { label: '线体标识', prop: 'lineCode' },
    { label: '产品机型标识', prop: 'modelCode' },
    { label: '产品品号', prop: 'productionNo' },
    // { label: '班次', prop: 'workClass' },
    { label: '日期', prop: 'createTime' },
    { label: '物料编号', prop: 'materialNumber' },
    { label: '紧急程度', prop: 'urgentLevelName' },
    { label: '可用物料余量', prop: 'availableMargin' },
    {
      label: '操作',
      prop: 'option',
      buttons: [
        {
          label: '已处理',
          disabled: ({ row }) => {
            return row.status === 1
          },
          click: ({ row }) => {
            onDeal(row)
          }
        }
      ]
    }
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
    onSizeChange,
    refresh
  } = useTable({
    getTableData
  })
  useKeyEnter(refresh)
  let onDeal = row => {
    ElMessageBox.confirm('是否确认，已处理？', '提示', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(async () => {
        let data = await proxy.$api.materialWarningReminder.dealMaterialWarn(
          row
        )
        ElMessage({
          type: 'success',
          message: data.message
        })
        refresh()
      })
      .catch(() => {})
  }
</script>

<style scoped></style>
