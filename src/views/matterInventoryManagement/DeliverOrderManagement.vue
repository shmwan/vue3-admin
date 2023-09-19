<template>
  <div class="page-management deliver-order">
    <div class="search-form">
      <el-form inline :model="searchForm" ref="searchFormRef">
        <el-form-item prop="deliveryNo">
          <el-input
            v-model="searchForm.deliveryNo"
            placeholder="输入送货单号"
            clearable
          />
        </el-form-item>
        <el-form-item prop="supplierName">
          <el-input
            v-model="searchForm.supplierName"
            placeholder="输入供应商名称"
            clearable
          />
        </el-form-item>
        <el-form-item prop="status">
          <el-select
            v-model="searchForm.status"
            placeholder="请选择状态"
            clearable
          >
            <el-option label="待签收" value="1" />
            <el-option label="签收中" value="2" />
            <el-option label="已完成" value="3" />
          </el-select>
        </el-form-item>
        <el-form-item prop="weighStatus">
          <el-select
            v-model="searchForm.weighStatus"
            placeholder="请选择清点状态"
            clearable
          >
            <el-option label="待清点" value="0" />
            <el-option label="清点中" value="1" />
            <el-option label="已到货" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item prop="updateTime">
          <el-date-picker
            v-model="searchForm.updateTime"
            type="daterange"
            start-placeholder="送货单更新开始时间"
            end-placeholder="送货单更新结束时间"
            value-format="YYYY-MM-DD"
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSearch" :icon="Search">
            查询
          </el-button>
          <el-button @click="onReset" :icon="Refresh">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="search-table">
      <el-table :data="data" border>
        <!-- <el-table-column type="index" width="50" /> -->
        <el-table-column prop="deliveryNo" label="送货单号"> </el-table-column>
        <el-table-column
          prop="supplierName"
          label="供应商"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column prop="deliveryTypeStr" label="送货类型">
        </el-table-column>
        <el-table-column prop="strongHold" label="营业据点"> </el-table-column>
        <el-table-column prop="statusStr" label="状态"> </el-table-column>
        <el-table-column prop="weighStatusStr" label="清点状态">
        </el-table-column>
        <el-table-column prop="lastOperateTime" label="送货单更新时间">
        </el-table-column>
        <el-table-column prop="generateArrivalTime" label="到货单生成时间">
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="100">
          <template #default="scope">
            <el-button @click="onDetail(scope.row)" type="text">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <table-page
      :pageSize="pagination.pageSize"
      :pageTotal="pagination.total"
      @pageFunc="handleTableChange"
    >
    </table-page>
    <el-dialog
      v-model="dialogFormVisible"
      title="包裹列表"
      width="60%"
      draggable
      class="dialog-form"
      @closed="onCancelDialogForm"
    >
      <el-tabs v-model="activeName" @tab-change="onTabChange">
        <el-tab-pane v-for="item in tabList" :key="item.name" :name="item.name">
          <template #label>
            <el-tooltip :content="item.label" placement="top">
              {{ item.label }}
            </el-tooltip>
          </template>

          <el-descriptions>
            <el-descriptions-item label="料号">
              {{ item.matter.matterCode }}
            </el-descriptions-item>
            <el-descriptions-item label="物料名称">
              <el-tooltip :content="item.matter.matterName" placement="top">
                {{ item.matter.matterName }}
              </el-tooltip>
            </el-descriptions-item>
            <el-descriptions-item label="包裹数量">
              <span>外箱：{{ item.matter.outerCount }} ；</span>
              <span>大包：{{ item.matter.bigCount }} ； </span>
              <span>小包：{{ item.matter.smallCount }} </span>
            </el-descriptions-item>
          </el-descriptions>
        </el-tab-pane>
      </el-tabs>

      <el-form inline ref="searchFormDialogRef" :model="searchFormDialog">
        <el-form-item prop="barCode">
          <el-input
            v-model="searchFormDialog.barCode"
            placeholder="输入barcode"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSearchDialog"> 查询 </el-button>
          <el-button @click="onResetDialog">重置</el-button>
        </el-form-item>
      </el-form>
      <el-scrollbar max-height="400px">
        <el-table :data="dataDialog" border>
          <el-table-column type="index" width="50" />
          <el-table-column prop="smallBarcode" label="小包barcode">
          </el-table-column>
          <el-table-column prop="bigBarcode" label="大包barcode">
          </el-table-column>
          <el-table-column prop="outerBarcode" label="外箱barcode">
          </el-table-column>
          <el-table-column prop="includeQty" label="小包包含数量">
          </el-table-column>
          <el-table-column prop="weighStatusStr" label="清点状态">
          </el-table-column>
        </el-table>
      </el-scrollbar>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="onCancelDialogForm">关闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
  import { Search, Refresh } from '@element-plus/icons-vue'
  import TablePage from '@/components/common/ElementPage.vue'
  import useKeyEnter from '@/hooks/useKeyEnter.ts'
  const { proxy } = getCurrentInstance()
  let searchForm = $ref({
    deliveryNo: '',
    supplierName: '',
    status: '',
    weighStatus: '',
    updateTime: [],
    startTime: '',
    endTime: ''
  })
  let pagination = $ref({
    pageNo: 1,
    pageSize: 10,
    total: 0
  })
  let searchFormRef = $ref(null)
  let data = $ref([])

  let getDeliveryStockList = () => {
    let { updateTime, ...reset } = searchForm
    let params = {
      ...reset,
      startTime: (searchForm.updateTime && searchForm.updateTime[0]) || '',
      endTime: (searchForm.updateTime && searchForm.updateTime[1]) || '',
      pageNo: pagination.pageNo,
      pageSize: pagination.pageSize
    }
    proxy.$api.deliverOrder.getDeliveryStockList(params).then((res: any) => {
      data = res.data.records
      pagination.total = res.data.total
    })
  }
  let onSearch = () => {
    getDeliveryStockList()
  }
  let onReset = () => {
    pagination.pageNo = 1
    pagination.pageSize = 10
    searchFormRef.resetFields()
    getDeliveryStockList()
  }
  let handleTableChange = ({ pageNo, pageSize }) => {
    pagination.pageNo = pageNo
    pagination.pageSize = pageSize
    onSearch()
  }
  onMounted(() => {
    onSearch()
  })
  useKeyEnter(onSearch)
  let dialogForm = $ref({})
  let dialogFormVisible = $ref(false)
  let tabList = $ref([])
  let activeName = $ref('')
  let currentItem = $ref('')

  let searchFormDialogRef = $ref()
  let searchFormDialog = $ref({
    deliveryNo: '',
    barCode: '',
    matterCode: ''
  })
  let dataDialog = $ref([])
  let onDetail = row => {
    currentItem = row
    dialogFormVisible = true
    proxy.$api.deliverOrder
      .getBarcodeDetail({ deliveryNo: row.deliveryNo })
      .then((res: any) => {
        dialogForm = res.data.map(item => {
          return {
            ...item,
            matterName: item.matterName || ' '
          }
        })
        activeName = (dialogForm[0] && dialogForm[0].matterCode) || ''
        tabList = dialogForm.map(item => {
          return {
            label: item.matterName,
            name: item.matterCode,
            matter: { ...item }
          }
        })
      })
  }
  let onTabChange = () => {
    if (!activeName) return
    getBarcodeList()
  }
  let getBarcodeList = () => {
    let params = {
      ...searchFormDialog,
      deliveryNo: currentItem.deliveryNo,
      matterCode: activeName
    }
    proxy.$api.deliverOrder.getBarcodeList(params).then((res: any) => {
      dataDialog = res.data
    })
  }
  let onSearchDialog = () => {
    getBarcodeList()
  }
  let onResetDialog = () => {
    searchFormDialogRef.resetFields()
    dataDialog = []
  }

  let onCancelDialogForm = () => {
    dialogFormVisible = false
    tabList = []
    activeName = ''
    currentItem = ''
    dataDialog = []
  }
</script>

<style lang="less" scoped>
  .deliver-order {
    :deep(.el-tooltip__trigger) {
      display: block;
      max-width: 320px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
</style>
