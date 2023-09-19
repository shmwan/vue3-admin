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
      :toolbars="toolbars"
      :data="data"
      :columns="columns"
      :total="total"
      v-model:page-no="pageNo"
      v-model:page-size="pageSize"
      @current-change="onCurrentChange"
      @size-change="onSizeChange"
    >
    </pro-table>
    <pro-dialog
      width="40%"
      title="叫/领料详情"
      v-model="dialogFormVisible"
      @on-cancel="onCancel"
      @closed="onCancel"
      :show-submit-button="false"
    >
      <pro-form
        ref="dialogFormRef"
        v-model="dialogForm"
        :fields="dialogFormfields"
        :wrap-span="12"
        disabled
      >
      </pro-form>
    </pro-dialog>
  </pro-container>
</template>

<script setup lang="ts">
  import useTable from '@/hooks/useTable'
  import useDialog from '@/hooks/useDialog'
  import useKeyEnter from '@/hooks/useKeyEnter.ts'
  const { proxy } = getCurrentInstance()

  let queryForm = $ref({
    billCode: '',
    lineCode: '',
    workOrderNo: '',
    operator: '',
    modelOrItemCode: '',
    timeRange: []
  })
  let fields = $ref([
    {
      prop: 'billCode',
      label: '叫/领料单号',
      component: 'input'
    },
    {
      prop: 'lineCode',
      label: '线体标识',
      component: 'input'
    },
    {
      prop: 'workOrderNo',
      label: '生产工单',
      component: 'input'
    },
    {
      prop: 'operator',
      label: '操作人员',
      component: 'input'
    },
    {
      prop: 'modelOrItemCode',
      label: '产品机型标识/品号',
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
  let toolbars = [
    // {
    //   label: '叫料申请',
    //   type: 'primary',
    //   // disabled: true,
    //   click: () => {
    //     onUsedMaterialApply()
    //   }
    // }
  ]
  let getTableData = async params => {
    params = {
      ...params,
      ...queryForm
    }
    let {
      data: { records: data, total: totalCount }
    } = await proxy.$api.usedMaterialRecord.getUsedMaterialRecordList(params)
    return {
      dataList: data || [],
      totalCount: totalCount
    }
  }

  let columns = $ref([
    { label: '叫/领料单号', prop: 'billCode' },
    { label: '线体标识', prop: 'lineCode' },
    { label: '叫/领料时间', prop: 'happenTime' },
    { label: '产品机型标识', prop: 'modelCode' },
    { label: '产品品号', prop: 'itemNumber' },
    { label: '生产工单', prop: 'workOrderNo' },
    { label: '计划产量', prop: 'planQty' },
    { label: '物料编号', prop: 'materialCode' },
    {
      label: '操作类别',
      prop: 'operateMode',
      formatter: row => (row.operateMode === '1' ? '人工叫料' : '生产预发料')
    },
    { label: '申请数量', prop: 'applyNum' },
    { label: '已领取数量', prop: 'receiveNum' },
    { label: '可领物料余量', prop: 'receivableNum' },
    { label: '来源', prop: 'source' },
    {
      label: '操作',
      prop: 'option',
      buttons: [
        {
          label: '详情',
          click: ({ row }) => {
            onDetail(row)
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
  let { visible: dialogFormVisible, closeDialog } = useDialog()
  let dialogForm = $ref({
    lineCode: '',
    workClass: '',
    site: '',
    modelCode: '',
    itemNumber: '',
    workOrderNo: '',
    operator: '',
    urgentLevelName: ''
  })
  let dialogFormfields = $ref([
    {
      prop: 'lineCode',
      label: '叫料线体',
      component: 'input'
    },
    {
      prop: 'workClass',
      label: '班次',
      component: 'input'
    },
    {
      prop: 'site',
      label: '叫料站点',
      component: 'input'
    },
    {
      prop: 'modelCode',
      label: '产品机型标识',
      component: 'input'
    },
    {
      prop: 'itemNumber',
      label: '产品品号',
      component: 'input'
    },
    {
      prop: 'workOrderNo',
      label: '生产工单',
      component: 'input'
    },
    {
      prop: 'operator',
      label: '操作人员',
      component: 'input'
    },
    {
      prop: 'urgentLevelName',
      label: '紧急程度',
      component: 'select',
      options: [
        {
          label: '一般',
          value: '1'
        },
        {
          label: '紧急',
          value: '2'
        },
        {
          label: '非常紧急',
          value: '3'
        }
      ]
    }
  ])
  let dialogFormRef = $ref(null)
  let onUsedMaterialApply = () => {
    dialogFormVisible.value = true
  }
  let onDetail = async row => {
    dialogFormVisible.value = true
    let { data } =
      await proxy.$api.usedMaterialRecord.getUsedMaterialRecordDetail(row)
    dialogForm = data
  }
  let onCancel = async () => {
    await dialogFormRef.resetFields()
    dialogFormVisible.value = false
  }
</script>

<style scoped></style>
