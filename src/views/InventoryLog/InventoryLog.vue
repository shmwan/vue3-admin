<template>
  <div>
    <el-form :model="SearchFrom">
      <el-row :span="20">
        <el-col :span="4" style="margin-right: 20px">
          <el-form-item label="">
            <el-input
              v-model="SearchFrom.pagId"
              :placeholder="$t('lang.InventLog.plzPAG')"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="4" style="margin-right: 20px">
          <el-form-item label="">
            <el-input
              v-model="SearchFrom.matter"
              :placeholder="$t('lang.InventLog.plzLH')"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="4" style="margin-right: 20px">
          <el-form-item label="">
            <el-input
              v-model="SearchFrom.supplierName"
              :placeholder="$t('lang.InventLog.plzGYS')"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="7" style="margin-right: 20px">
          <el-date-picker
            v-model="datas.dataTime"
            type="datetimerange"
            value-format="YYYY-MM-DD HH:mm:ss"
            range-separator="-"
            :start-placeholder="$t('lang.InventLog.StartTime')"
            :end-placeholder="$t('lang.InventLog.EndTime')"
          />
        </el-col>
        <el-col :span="3">
          <el-button
            type="primary"
            :icon="Search"
            @click="searchData"
            :loading="datas.loading"
            >{{ $t('lang.common.search') }}</el-button
          >
          <el-button :icon="Refresh" @click="resetData">{{
            $t('lang.common.reset')
          }}</el-button>
        </el-col>
      </el-row>
    </el-form>
    <el-table
      :data="datas.data"
      border
      stripe
      style="width: 100%; margin-top: 20px"
    >
      <el-table-column
        prop="matterName"
        :label="$t('lang.InventLog.WLname')"
        show-overflow-tooltip
      />
      <el-table-column
        prop="matterCode"
        :label="$t('lang.InventLog.LH')"
        show-overflow-tooltip
      />
      <el-table-column
        prop="pagId"
        :label="$t('lang.InventLog.PAG')"
        show-overflow-tooltip
      />
      <el-table-column
        prop="supplierName"
        :label="$t('lang.InventLog.GYS')"
        show-overflow-tooltip
      />
      <el-table-column
        prop="grossWeight"
        :label="$t('lang.InventLog.MaoWeight')"
        show-overflow-tooltip
      >
        <template #default="scope">
          {{ scope.row.grossWeight / 1000 }}KG
        </template>
      </el-table-column>
      <el-table-column
        prop="actualWeight"
        :label="$t('lang.InventLog.SJweight')"
        show-overflow-tooltip
      >
        <template #default="scope">
          {{ scope.row.actualWeight / 1000 }}KG
        </template>
      </el-table-column>

      <el-table-column
        prop="status"
        :label="$t('lang.InventLog.newState')"
        show-overflow-tooltip
      >
        <template #default="scope">
          <div v-if="scope.row.status == 1">
            {{ $t('lang.InventLog.oneState') }}
          </div>
          <div v-if="scope.row.status == 2" style="color: red">
            {{ $t('lang.InventLog.twoState') }}
          </div>
          <div v-if="scope.row.status == 3">
            {{ $t('lang.InventLog.threeState') }}
          </div>
          <div v-if="scope.row.status == 4">
            {{ $t('lang.InventLog.fourState') }}
          </div>
          <div v-if="scope.row.status == 5">
            {{ $t('lang.InventLog.fiveState') }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="updateTime"
        :label="$t('lang.InventLog.updateTime')"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column :label="$t('lang.common.operate')" show-overflow-tooltip>
        <template #default="scope">
          <el-button type="primary" text @click="editData(scope.row)">{{
            $t('lang.common.details')
          }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <TablePage
      :pageSize="SearchFrom.pageSize"
      :layout="layout"
      :pageTotal="datas.total"
      @pageFunc="pageFunc"
    >
    </TablePage>
  </div>
  <InventoryLogEdit
    v-if="datas.showEdit"
    @close="close"
    :editData="datas.editData"
    @success="searchData"
  ></InventoryLogEdit>
</template>

<script setup lang="ts">
  import {
    defineComponent,
    getCurrentInstance,
    reactive,
    ref,
    toRefs,
    onMounted
  } from 'vue'
  import {
    Delete,
    Edit,
    Search,
    Refresh,
    Share,
    Upload,
    Plus,
    Switch
  } from '@element-plus/icons-vue'
  import useKeyEnter from '@/hooks/useKeyEnter.ts'
  import { translateDataToTree } from '@/utils/common.js'
  import { ElMessage } from 'element-plus'
  import TablePage from '@/components/common/ElementPage.vue'
  import InventoryLogEdit from './InventoryLogEdit.vue'
  import DateUtils from '@/utils/dateUtils.js'
  const { proxy } = getCurrentInstance() as any
  const $t = proxy.$t
  const SearchFrom = reactive({
    pagId: '',
    matter: '',
    supplierName: '',
    weighEndTime: '',
    weighStartTime: '',
    pageNo: 1,
    pageSize: 10
  })
  interface Datas {
    showEdit: boolean
    loading: boolean
    data: Object[]
    editData: any
    total: number
    dataTime: any
  }
  let datas: Datas = reactive({
    showEdit: false,
    loading: false,
    dataTime: [],
    data: [],
    editData: {},
    total: 0
  })
  let layout: string = 'total,sizes, prev, pager, next, jumper, ->, slot' //分页组件会展示的功能项

  const pageFunc = (data: any) => {
    SearchFrom.pageSize = data.pageSize
    SearchFrom.pageNo = data.pageNo
    searchData() // 触发获取数据函数
  }
  const getNowTime = () => {
    let current = new Date()
    // let nowYear = current.getFullYear()
    // let nowMonth = current.getMonth() + 1
    // let nowdates = current.getDate()
    // let nowHour = current.getHours()
    // let nowMinutes = current.getMinutes()
    // let nowSeconds = current.getSeconds()
    let StartTime =
      DateUtils.format(new Date(current), 'yyyy-MM-dd') + ' 00:00:00'
    let EndTime = DateUtils.format(new Date(current), 'yyyy-MM-dd hh:mm:ss')
    datas.dataTime = [StartTime, EndTime]

    // console.log('StartTime', StartTime, 'EndTime', EndTime)
  }
  // 查询数据
  const searchData = () => {
    if (datas.dataTime) {
      SearchFrom.weighStartTime = datas.dataTime[0]
      SearchFrom.weighEndTime = datas.dataTime[1]
    } else {
      SearchFrom.weighStartTime = ''
      SearchFrom.weighEndTime = ''
    }
    datas.loading = true
    let params = {
      ...SearchFrom
    }
    proxy.$api.matter.getWeighList(params).then((res: any) => {
      datas.loading = false
      if (res.code == 200) {
        datas.data = res.data.records
        datas.total = res.data.total
      } else {
        ElMessage({
          message: res.message + '!',
          type: 'error'
        })
      }
    })
  }
  const resetData = () => {
    SearchFrom.pagId = ''
    SearchFrom.matter = ''
    SearchFrom.supplierName = ''
    datas.dataTime = []
    SearchFrom.pageNo = 1
    SearchFrom.pageSize = 10
    searchData()
  }
  const editData = (data: any) => {
    console.log(data)
    if (data) {
      datas.editData = data
    } else {
      datas.editData = {}
    }
    datas.showEdit = true
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
  const close = (data: any) => {
    datas.showEdit = false
  }
  onMounted(() => {
    getNowTime()
    searchData()
  })
  useKeyEnter(searchData)
</script>
<style lang="less" scoped></style>
