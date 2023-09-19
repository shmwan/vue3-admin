<template>
  <div>
    <el-form :model="SearchFrom">
      <el-row :span="20">
        <el-col :span="4">
          <el-form-item>
            <el-input
              v-model="SearchFrom.keyWords"
              :placeholder="$t('lang.processFlow.keywordPlh')"
            />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item>
            <el-input
              v-model="SearchFrom.technologicalProcessCode"
              :placeholder="$t('lang.processFlow.technologicalProcessCodePlh')"
              :placeholder1="'请输入工艺流程编号'"
            />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-button
            type="primary"
            :icon="Search"
            @click="getTableData"
            :loading="datas.loading"
            >{{ $t('lang.common.search') }}</el-button
          >
          <el-button :icon="Refresh" @click="resetData">{{
            $t('lang.common.reset')
          }}</el-button>
        </el-col>
      </el-row>
    </el-form>
    <div class="btns">
      <el-button type="primary" @click="editData" :icon="Plus">
        {{ $t('lang.processFlow.add') }}
      </el-button>
    </div>
    <pro-table
      ref="proTableRef"
      :toolbars="[]"
      :data="datas.data"
      :columns="columns"
      :total="datas.total"
      v-model:page-no="SearchFrom.pageNo"
      v-model:page-size="SearchFrom.pageSize"
      @current-change="onCurrentChange"
      @size-change="onSizeChange"
    >
      <template #name="{ row }">
        <span> slot: {{ row.name }}</span>
      </template>
    </pro-table>
    <edit
      @close="close"
      @success="success"
      :technologicalProcessCode="datas.technologicalProcessCode"
      :isShow="isShow"
      v-if="editDlog"
    ></edit>
  </div>
</template>

<script setup lang="ts">
  import ProTable from '@/components/pro-table.vue'
  import edit from './edit.vue'
  import {
    defineComponent,
    getCurrentInstance,
    reactive,
    ref,
    toRefs
  } from 'vue'
  import {
    Delete,
    Edit,
    Search,
    Refresh,
    Share,
    Upload,
    Plus,
    Switch,
    DataLine
  } from '@element-plus/icons-vue'
  import { translateDataToTree } from '@/utils/common.js'
  import { ElMessage } from 'element-plus'
  import SupplierEdit from './SupplierEdit.vue'
  import DateUtils from '@/utils/dateUtils.js'
  import useTable from '@/hooks/useTable'

  const { proxy } = getCurrentInstance() as any
  const $t = proxy.$t
  let proTableRef = ref(null)
  let editDlog = ref<boolean>(false)
  let isShow = ref<boolean>(false)
  const SearchFrom = reactive({
    technologicalProcessCode: '',
    keyWords: '',
    pageNo: 1,
    pageSize: 10
  })
  interface Datas {
    showEdit: Boolean
    loading: Boolean
    data: Object[]
    editData: any
    total: Number
    id?: number
    technologicalProcessCode?: string
  }
  const success = () => {
    getTableData({})
    close() // 关闭弹窗 或 重新调用函数获取数据 可以根据实际情况选择
  }
  let getTableData = async params => {
    datas.loading = true
    params = {
      ...params,
      ...SearchFrom
    }
    let res = await proxy.$api.processFlow.getProcessFlow(params)
    datas.loading = false
    datas.data = res.data.records
    datas.total = res.data.total
  }
  let columns = $ref([
    {
      label1: '工艺流程编号',
      label: $t('lang.processFlow.technologicalProcessCode'),
      prop: 'technologicalProcessCode'
    },
    {
      label1: '产品机型标识',
      label: $t('lang.processFlow.produceSiteCode'),
      prop: 'modelName'
    },
    {
      label1: '适用品号',
      label: $t('lang.processFlow.partNo'),
      prop: 'partNo'
    },
    {
      label1: '工序类别',
      label: $t('lang.processFlow.processCategoryTypeStr'),
      prop: 'processCategoryTypeStr'
    },
    {
      label1: '工站数量',
      label: $t('lang.processFlow.siteCount'),
      prop: 'siteCount'
    },
    {
      label1: '更新人',
      label: $t('lang.processFlow.updateUserName'),
      prop: 'updateUserName'
    },
    {
      label1: '更新时间',
      label: $t('lang.processFlow.updateTime'),
      prop: 'updateTime'
    },
    {
      label1: '操作',
      label: $t('lang.common.operate'),
      prop: 'option',
      buttons: [
        {
          label1: '编辑',
          label: $t('lang.common.edit'),
          permission: 'edit',
          click: (data: any) => {
            editData(data)
          }
        },
        {
          label1: '删除',
          label: $t('lang.common.del'),
          type: 'danger',
          permission: 'del',
          click: (data: any) => {
            onDel(data)
          }
        },
        {
          label1: '详情',
          label: $t('lang.common.details'),
          permission: 'del',
          type: 'warning',
          click: (data: any) => {
            onDetail(data)
          }
        }
      ]
    }
  ])

  let datas: Datas = reactive({
    showEdit: false,
    loading: false,
    data: [],
    editData: {},
    total: 0,
    technologicalProcessCode: ''
  })
  let disabledDate = (time: Date) => {
    return time.getTime() > Date.now()
  }
  const Synchronization = () => {
    proxy.$api.SupplierInfo.synchronization().then((res: any) => {
      if (res.code == 200) {
        ElMessage({
          message: $t('lang.baseData.sucTB'),
          type: 'success'
        })
      } else {
        ElMessage({
          message: res.message + '!',
          type: 'error'
        })
      }
    })
  }
  const onCurrentChange = (val: number) => {
    SearchFrom.pageNo = val
    getTableData({})
  }
  const onSizeChange = (val: number) => {
    SearchFrom.pageSize = val
    getTableData({})
  }

  const onDetail = async (data: any) => {
    editDlog.value = true
    isShow.value = true
    datas.technologicalProcessCode = data.row.technologicalProcessCode
    datas.id = data.row.id
  }
  import { useCallback } from '@/hooks/useCallback'
  import { useConfirm } from '@/hooks/useConfirm'

  // 删除
  const onDel = async (data: any) => {
    let params = data.row
    useConfirm(deleteData, params)
  }

  const deleteData = async (params: any) => {
    const res = await proxy.$api.processFlow.deleteData([
      params.technologicalProcessCode
    ])
    const datas = useCallback(res)
    if (datas) success()
  }
  const editData = (data: any) => {
    if (data.row) {
      datas.technologicalProcessCode = data.row.technologicalProcessCode
    } else {
      datas.technologicalProcessCode = undefined
    }
    editDlog.value = true
    isShow.value = false
  }
  const indexMethod = (index: number) => {
    let indexNo: number = index + 1
    const pageNo: number = SearchFrom.pageNo - 1
    const pageSize = SearchFrom.pageSize
    const count: number = pageNo * pageSize
    let sort: number = indexNo + count
    return sort
  }
  /**
   * 回调子组件的事件
   *
   */
  const close = () => {
    editDlog.value = false
  }
  const resetData = () => {
    SearchFrom.technologicalProcessCode = ''
    SearchFrom.keyWords = ''
    SearchFrom.pageNo = 1
    SearchFrom.pageSize = 10
    getTableData({})
  }
  onMounted(() => {
    getTableData({})
  })
  // searchData()
</script>
<style lang="less" scoped>
  :deep(.el-col) {
    margin-right: 20px;
  }
</style>
