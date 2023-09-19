<template>
  <div>
    <div class="search-form">
      <el-form :inline="true" :model="searchForm" class="demo-form-inline">
        <el-row :gutter="24">
          <el-col :span="4">
            <el-form-item>
              <el-input v-model.trim="searchForm.rawDataKeyword" placeholder="关键字" @keyup.enter="searchData"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model.trim="searchForm.matterKeyword" :placeholder="$t('lang.flowLog.namePlh')"
                @keyup.enter="searchData"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model.trim="searchForm.supplierKeyword" :placeholder="$t('lang.flowLog.gongPlh')"
                @keyup.enter="searchData"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model.trim="searchForm.matterBill" :placeholder="$t('lang.flowLog.billNoPlh')"
                @keyup.enter="searchData"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model.trim="searchForm.lineCode" placeholder="请输入产线编号" @keyup.enter="searchData"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item prop="pagIds">
              <el-input v-model.trim="searchForm.pagIds" placeholder="请输入PAGID" @keyup.enter="searchData"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="4">
            <el-form-item prop="circulationProcess">
              <el-select v-model="searchForm.circulationProcess" placeholder="请选择流转环节" clearable style="width: 100%;">
                <el-option v-for="(item, i) in datas.flowList" :key="i" :label="item.dictionName"
                  :value="item.dictionCode" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item>
              <el-date-picker v-model="searchForm.timeArrs" type="daterange" start-placeholder="开始时间"
                end-placeholder="结束时间" value-format="YYYY-MM-DD" format="YYYY-MM-DD" :disabled-date="disabledDate" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-button type="primary" @click="searchData" :icon="Search" :loading="datas.loading">{{
                $t('lang.common.search') }}</el-button>
              <el-button @click="resetData" :icon="Refresh">{{
                $t('lang.common.reset')
              }}</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="btns">
      <el-button type="success" @click="exportLoad()">{{
        $t('lang.flowLog.export')
      }}</el-button>
    </div>
    <el-table :data="datas.data" border stripe>
      <el-table-column prop="matterBill" :label="$t('lang.flowLog.billNo')"></el-table-column>
      <el-table-column prop="supplierName" :label="$t('lang.flowLog.gong')"></el-table-column>
      <el-table-column :label="$t('lang.flowLog.name')">
        <template #default="scope">
          {{ scope.row.matterCode }} / {{ scope.row.matterName }}
        </template>
      </el-table-column>
      <el-table-column prop="circulationProcessStr" :label="$t('lang.flowLog.flow')"></el-table-column>
      <el-table-column prop="pagIds" label="PAGID"></el-table-column>
      <el-table-column prop="lineCode" :label="$t('lang.flowLog.lineCode')"></el-table-column>
      <!-- <el-table-column prop="circulationProcessType" :label="$t('lang.flowLog.flowType')"></el-table-column> -->
      <el-table-column prop="matterDataSourcesStr" :label="$t('lang.flowLog.source')"></el-table-column>
      <el-table-column prop="circulationTime" :label="$t('lang.flowLog.flowTime')"></el-table-column>
      <el-table-column :label="$t('lang.flowLog.sourceLog')">
        <template #default="scope">
          <el-button type="primary" text @click="look(scope.row)">{{
            $t('lang.common.look')
          }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <table-page :pageSize="searchForm.pageSize" :pageTotal="datas.total" @pageFunc="handleTableChange">
    </table-page>
  </div>
  <flow-Log-Detail :logDetails="datas.editData" v-if="logDetailDlg" @close="close">
  </flow-Log-Detail>
</template>
<script lang="ts" setup>
import { ElMessage } from 'element-plus'
import { getCurrentInstance, reactive, computed, ref, toRefs } from 'vue'
import flowLogDetail from './flowLogDetail.vue'
import TablePage from '@/components/common/ElementPage.vue'
import { Search, Refresh } from '@element-plus/icons-vue'
import { exportExcelPOST } from '@/utils/exportDown.js'
import DateUtils from '@/utils/dateUtils.js'
import { useDictData } from '@/hooks/dictMinxin'
interface SearchFroms {
  pageNo: number
  pageSize: number
  matterKeyword: string
  supplierKeyword: string
  matterBill: string
  endTime: string
  startTime: string
  lineCode: string
  pagIds: any
  circulationProcess: string
}
const logDetailDlg = ref<Boolean>(false)
const { proxy } = getCurrentInstance() as any
const $t = proxy.$t
let searchForm: SearchFroms = reactive({
  pageNo: 1,
  pageSize: 10,
  matterKeyword: '',
  supplierKeyword: '',
  matterBill: '',
  circulationProcess: '',
  rawDataKeyword: '',
  timeArrs: [
    DateUtils.format(
      new Date(),
      'yyyy-MM-dd'
    ),
    DateUtils.format(new Date(), 'yyyy-MM-dd')
  ],
  endTime: '',
  startTime: '',
  lineCode: '',
  pagIds: '',
})
let datas = reactive({
  loading: false,
  value2: '',
  data: [],
  total: 0,
  flowList: [],

})

// const disabledDateStart = (time: Date) => {
//   const start = new Date()
//   start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
//   return time.getTime() < start.getTime()
// }
// const disabledDateEnd = (time: Date) => {
//   return time.getTime() > Date.now()
// }
// 最近三个月
let latest3Month = new Date().setTime(
  new Date().getTime() - 3600 * 1000 * 24 * 30 * 3
)

let disabledDate = (time: Date) => {
  return time.getTime() < latest3Month || time.getTime() > Date.now()
}

const defaultStart = ref<Date>(
  new Date(
    new Date().getFullYear(),
    new Date().getMonth() - 1,
    new Date().getDate()
  )
)
const indexMethod = (index: number) => {
  let indexNo: number = index + 1
  const pageNo: number = searchForm.pageNo - 1
  const pageSize = searchForm.pageSize
  const count: number = pageNo * pageSize
  let sort: number = indexNo + count
  return sort
}

const { getDictData } = useDictData()
onMounted(async () => {
  datas.flowList = await getDictData('10004')

})
/**
 * 回调子组件的事件
 *
 */
const close = (data: any) => {
  logDetailDlg.value = false
}
/**
 * 打开子组件
 */
const look = (data: any) => {
  if (data) {
    datas.editData = toRefs(data)
  } else {
    datas.editData = {}
  }
  logDetailDlg.value = true
}

// 查询数据
const searchData = () => {
  datas.loading = true
  let params = {
    ...searchForm
  }
  if (!params.timeArrs) {
    ElMessage({
      type: 'error',
      message: '请填入3个月内的查询起止时间'
    })
    datas.loading = false
    return false
  }
  params.startTime = params.timeArrs[0] + ' 00:00:00'
  params.endTime = params.timeArrs[1] + ' 23:59:59'
  // params.pagIds = params.pagIds.join(',')
  proxy?.$api.flowLog.flowLogList(params).then((res: any) => {
    let data = res.data.records
    datas.loading = false
    datas.data = data
    datas.total = res.data.total
  })
}
searchData()
/**
 *分页切换
 * @param {} pag
 * @param {*} filters
 * @param {*} sorter
 */
const handleTableChange = (pag: any, filters: any) => {
  searchForm.pageNo = pag.pageNo
  searchForm.pageSize = pag.pageSize
  searchData()
}
/**
 * 重置数据
 */
const resetData = () => {
  (searchForm.pageNo = 1),
    (searchForm.pageSize = 10),
    (searchForm.matterKeyword = ''),
    (searchForm.supplierKeyword = ''),
    (searchForm.matterBill = ''),
    (searchForm.rawDataKeyword = ''),
    (searchForm.timeArrs = [
      DateUtils.format(
        new Date(),
        'yyyy-MM-dd'
      ),
      DateUtils.format(new Date(), 'yyyy-MM-dd')
    ]),
    (searchForm.lineCode = ''),
    (searchForm.pagIds = ''),
    (searchForm.circulationProcess = '')

  searchData()
}
const exportLoad = () => {
  let params = { ...searchForm }
  params.startTime = searchForm.timeArrs[0] + ' 00:00:00'
  params.endTime = searchForm.timeArrs[1] + ' 23:59:59'
  exportExcelPOST('/api/mgt/matter/log/page/export', params, '物料日志导出')
}
</script>
<style lang="less" scoped>
.btns {
  display: flex;
  margin-bottom: 20px;

  :deep(.ant-btn) {
    margin-right: 10px;
  }
}

:deep(.el-form-item) {
  display: flex;
  margin-right: 0;

  &.el-form-item-empty {
    .el-form-item__label {
      padding: 0;
      width: 0;
    }
  }
}
</style>
