<template>
  <div class="pro-container">
    <pro-form
      ref="queryFormRef"
      v-model="queryForm"
      :fields="fields"
      :rules="rules"
      :query="true"
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
      @current-change="onCurrentChange"
      @size-change="onSizeChange"
    >
      <template #name="{ row }">
        <span> slot: {{ row.name }}</span>
      </template>
    </pro-table>
    <pro-dialog
      title="新增"
      v-model="dialogVisible"
      @on-submit="onSubmit"
      @on-cancel="onCancel"
    >
      <pro-form v-model="queryForm" :fields="fields"> </pro-form>
    </pro-dialog>
  </div>
</template>

<script setup lang="ts">
  import ProForm from '@/components/pro-form.vue'
  import ProTable from '@/components/pro-table.vue'
  import ProDialog from '@/components/pro-dialog.vue'
  import useTable from '@/hooks/useTable'
  const { proxy } = getCurrentInstance()

  let queryFormRef = $ref(null)
  let queryForm = $ref({
    // name1111: 2,
    name: '1'
    // sex1: '1',
    // 'sex2-2': ['1', '2'],
    // sex3: '2023-04-12',
    // sex4: ['2023-04-12', '2023-04-15']
    // name: '',
    // sex1: ''
  })
  let fields = $ref([
    {
      prop: 'name1111',
      label: '名称222',
      component: 'input-number',
      // span: 12,
      hidden: true
    },
    {
      prop: 'name',
      label: '名称',
      component: 'input'
      // span: 12,
      // hidden: true,
    },
    {
      prop: 'sex1',
      label: 'select',
      component: 'select',
      onChange: val => {
        console.log(val)
        fields = fields.map(item => {
          if (item.prop === 'sex2') {
            if (val == 2) {
              item.hidden = true
            } else {
              item.hidden = false
            }
          }
          return item
        })
      },
      options: [
        {
          label: '男1',
          value: '1'
        },
        {
          label: '女1',
          value: '2'
        }
      ]
    },
    {
      prop: 'sex2',
      label: 'radio-group',
      component: 'radio-group',
      hidden: false,
      options: [
        {
          label: '男',
          value: '1'
        },
        {
          label: '女',
          value: '2'
        }
      ]
    },
    {
      prop: 'sex2-2',
      label: 'checkbox-group',
      component: 'checkbox-group',
      options: [
        {
          label: '男',
          value: '1'
        },
        {
          label: '女',
          value: '2'
        }
      ]
    },
    {
      prop: 'sex3',
      label: 'date-picker',
      component: 'date-picker',
      'value-format': 'YYYY-MM-DD HH:mm:ss'
    },
    {
      prop: 'sex4',
      label: 'date-picker-daterange',
      component: 'date-picker',
      type: 'daterange',
      propsMap: ['startTime', 'endTime'],
      'value-format': 'YYYY-MM-DD HH:mm:ss'
    }
  ])
  let rules = {
    name: [
      {
        required: true,
        message: '请输入名称',
        trigger: 'blur'
      }
    ]
  }
  let proTableRef = $ref(null)
  let toolbars = [
    {
      label: '新增',
      type: 'primary',
      click: () => {
        console.log('新增')
        onCreate()
      }
    }
  ]
  let getTableData = async params => {
    params = {
      ...params,
      ...queryForm
    }
    let {
      data: { records: data, total: totalCount }
    } = await proxy.$api.deliverOrder.getDeliveryStockList(params)
    return {
      dataList: data || [],
      totalCount: totalCount
    }
  }

  let columns = $ref([
    { label: '送货单号', prop: 'deliveryNo' },
    { label: '供应商', prop: 'supplierName' },
    {
      label: '操作',
      prop: 'option',
      buttons: [
        {
          label: '编辑',
          click: () => {
            onCreate()
          }
        }
      ]
    }
  ])
  let { data, total, onCurrentChange, onSizeChange, refresh } = useTable({
    getTableData
  })

  // let data = ref([
  //   {
  //     date: '2016-05-03',
  //     name: 'Tom',
  //     address: 'No. 189, Grove St, Los Angeles'
  //   },
  //   {
  //     date: '2016-05-02',
  //     name: 'Tom',
  //     address: 'No. 189, Grove St, Los Angeles'
  //   },
  //   {
  //     date: '2016-05-04',
  //     name: 'Tom',
  //     address: 'No. 189, Grove St, Los Angeles'
  //   },
  //   {
  //     date: '2016-05-01',
  //     name: 'Tom',
  //     address: 'No. 189, Grove St, Los Angeles'
  //   }
  // ])
  // let columns = ref([
  //   { label: 'Date', prop: 'date' },
  //   { label: 'Name', prop: 'name', cellSlot: 'name' },
  //   {
  //     label: 'Address',
  //     prop: 'address',
  //     formatter: (row: any) => 'formatter: ' + row.address + '...'
  //   },
  //   {
  //     label: '操作',
  //     width: 120,
  //     buttons: [
  //       {
  //         label: '查看',
  //         click: ({ row }) => {
  //           console.log(row)
  //         }
  //       },
  //       {
  //         label: '编辑',
  //         click: ({ row }) => {
  //           console.log(row)
  //         }
  //       }
  //     ]
  //   }
  // ])

  let onQuery = () => {
    refresh()
  }
  let onReset = async () => {
    await queryFormRef.resetFields()
    // nextTick(() => {
    refresh()
    // })
  }

  let dialogVisible = $ref(false)
  let onCreate = () => {
    dialogVisible = true
  }
  let onSubmit = async () => {
    console.log('onSubmit')
  }
  let onCancel = () => {
    console.log('onCancel')
  }
</script>

<style scoped></style>
