<template>
  <pro-container>
    <pro-form
      ref="queryFormRef"
      v-model="queryForm"
      :fields="fields"
      :rules="rules"
      query
      visible-label
      @on-query="onQuery"
      @on-reset="onReset"
    >
    </pro-form>
    <el-row>
      <el-col :span="4">
        <el-descriptions>
          <el-descriptions-item label="库存总量">
            <b class="inventory-total">{{ inventoryTotal }}</b> 台/套/pcs/kg
          </el-descriptions-item>
        </el-descriptions>
      </el-col>
    </el-row>
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
  </pro-container>
</template>

<script setup lang="ts">
  import useTable from '@/hooks/useTable'
  import useKeyEnter from '@/hooks/useKeyEnter.ts'
  const { proxy } = getCurrentInstance()

  // let queryFormRef = $ref(null)
  let queryForm = $ref({
    materialCode: '',
    supplierText: ''
  })
  let fields = $ref([
    {
      prop: 'materialCode',
      label: '物料编号',
      component: 'input'
    },
    {
      prop: 'supplierText',
      label: '供应商',
      component: 'input'
    }
  ])
  let rules = {
    materialCode: [
      {
        required: true,
        message: '请输入名称',
        trigger: 'blur'
      }
    ]
  }
  let inventoryTotal = $ref(0)
  let proTableRef = $ref(null)
  let toolbars = [
    // {
    //   label: '采购申请',
    //   type: 'primary',
    //   disabled: true,
    //   click: () => {
    //     onPurchaseApply()
    //   }
    // }
  ]
  let getTableData = async params => {
    params = {
      ...params,
      ...queryForm
    }
    let {
      data: {
        matterInventoryPages: { records: data, total: totalCount },
        totalNum
      }
    } = await proxy.$api.materialInventoryQuery.getMatterInventoryList(params)
    inventoryTotal = totalNum
    return {
      dataList: data || [],
      totalCount: totalCount
    }
  }

  let columns = $ref([
    { label: '物料编号', prop: 'materialCode' },
    { label: '物料名称', prop: 'materialName' },
    { label: '物料类别', prop: 'materialType' },
    { label: '供应商', prop: 'supplierName' },
    { label: '库存余量', prop: 'allowance' },
    { label: '单位', prop: 'unit' },
    { label: '库存更新时间', prop: 'updateTime' }
  ])
  let inQuery = async () => {
    await queryFormRef.value.validate()
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
    onSizeChange,
    refresh
  } = useTable({
    getTableData,
    inQuery,
    immediate: false
  })
  useKeyEnter(refresh)
</script>

<style scoped>
  .inventory-total {
    font-size: 16px;
  }
</style>
