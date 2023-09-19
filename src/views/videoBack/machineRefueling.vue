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
      index
      :toolbars="toolbars"
      :data="data.slice(start, end)"
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
  import * as XLSX from 'xlsx'
  import DateUtils from '@/utils/dateUtils.js'
  const { proxy } = getCurrentInstance()

  let startTime = new Date(new Date(new Date().toLocaleDateString()).getTime())
  let endTime = new Date(
    new Date(new Date().toLocaleDateString()).getTime() +
      24 * 60 * 60 * 1000 -
      1
  )
  let queryForm = $ref({
    kp_NO: '',
    line: '',
    station: '',
    wo: '',
    timeRange: [
      DateUtils.format(startTime, 'yyyy-MM-dd hh:mm:ss'),
      DateUtils.format(endTime, 'yyyy-MM-dd hh:mm:ss')
    ]
  })
  let fields = $ref([
    {
      prop: 'kp_NO',
      label: '料号',
      component: 'input'
    },
    {
      prop: 'line',
      label: '线别名称',
      component: 'input'
    },
    {
      prop: 'station',
      label: '机台代码',
      component: 'input'
    },
    {
      prop: 'wo',
      label: '工单号码',
      component: 'input'
    },
    {
      prop: 'timeRange',
      label: '时间范围',
      component: 'date-picker',
      type: 'daterange',
      propsMap: ['startTime', 'endTime'],
      'value-format': 'YYYY-MM-DD HH:mm:ss'
    }
  ])
  let proTableRef = $ref(null)
  let toolbars = [
    {
      label: '换料记录导出',
      type: 'primary',
      click: () => {
        onExportExcel()
      }
    }
  ]
  let start = $computed(() => (pageNo.value - 1) * pageSize.value)
  let end = $computed(() => pageNo.value * pageSize.value)

  let getTableData = async () => {
    let params = {
      ...queryForm,
      endTime: queryForm.endTime.replace('00:00:00', '23:59:59')
    }
    let { data } =
      await proxy.$api.materialVideoTraceability.getMachineRefuelingList(params)

    return {
      dataList: data || [],
      totalCount: data.length
    }
  }

  let columns = $ref([
    {
      label: '机台名称',
      prop: 'STATION',
      width: 120
    },
    {
      label: '料号',
      prop: 'KP_NO',
      width: 200
    },
    {
      label: '工单号码',
      prop: 'WO',
      width: 200
    },
    {
      label: '料盘号码',
      prop: 'TR_SN',
      width: 280
    },
    {
      label: '制造商料号',
      prop: 'MFR_KP_NO',
      width: 200
    },
    {
      label: 'D/C',
      prop: 'DATE_CODE',
      width: 120
    },
    {
      label: 'L/C',
      prop: 'LOT_CODE',
      width: 120
    },
    {
      label: 'ADD_QTY',
      prop: 'ADD_QTY',
      width: 100
    },
    {
      label: '料盘数量',
      prop: 'EXT_QTY',
      width: 100
    },
    {
      label: '开始时间',
      prop: 'START_TIME',
      width: 200
    },
    {
      label: '结束时间',
      prop: 'END_TIME',
      width: 200
    },
    {
      label: '制造商',
      prop: 'MFR_NAME',
      width: 200
    },
    {
      label: 'EMP',
      prop: 'EMP',
      width: 200
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
    // onCurrentChange,
    // onSizeChange,
    refresh
  } = useTable({
    getTableData
  })
  useKeyEnter(refresh)
  let onCurrentChange = val => {
    pageNo.value = val
  }
  let onSizeChange = val => {
    pageNo.value = 1
    pageSize.value = val
  }
  let onExportExcel = () => {
    let field = [
      'STATION',
      'KP_NO',
      'WO',
      'TR_SN',
      'MFR_KP_NO',
      'DATE_CODE',
      'LOT_CODE',
      'ADD_QTY',
      'EXT_QTY',
      'START_TIME',
      'END_TIME',
      'MFR_NAME',
      'EMP'
    ]
    let label = {
      STATION: '机台名称',
      KP_NO: '料号',
      WO: '工单号码',
      TR_SN: '料盘号码',
      MFR_KP_NO: '制造商料号',
      DATE_CODE: 'D/C',
      LOT_CODE: 'L/C',
      ADD_QTY: 'ADD_QTY',
      EXT_QTY: '料盘数量',
      START_TIME: '开始时间',
      END_TIME: '结束时间',
      MFR_NAME: '制造商',
      EMP: 'EMP'
    }
    let lastCol = XLSX.utils.encode_col(field.length - 1)
    let lastRow = XLSX.utils.encode_row(data.value.length)
    let ws = XLSX.utils.json_to_sheet(data.value, {
      header: field
    })
    let range = XLSX.utils.decode_range(ws['!ref'])
    ws['!ref'] = `A1:${lastCol}${lastRow}`

    for (let c = range.s.c; c <= range.e.c; c++) {
      let header = XLSX.utils.encode_col(c) + '1'
      ws[header].v = label[ws[header].v]
    }
    let wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')
    XLSX.writeFile(wb, '换料记录.xlsx')
  }
</script>
