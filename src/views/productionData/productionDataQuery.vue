<template>
  <div>
    <el-form ref="SearchFromRef" :model="SearchFrom">
      <el-row :span="20">
        <el-col :span="4" style="margin-right: 20px">
          <el-form-item>
            <el-input v-model="SearchFrom.matterName" placeholder="请输入站点编号" />
          </el-form-item>
        </el-col>
        <el-col :span="4" style="margin-right: 20px">
          <el-form-item>
            <el-input v-model="SearchFrom.lineCode" placeholder="请输入线体标识" />
          </el-form-item>
        </el-col>
        <el-col :span="4" style="margin-right: 20px">
          <el-form-item>
            <el-input v-model="SearchFrom.moNumber" placeholder="请输入生产工单" />
          </el-form-item>
        </el-col>
        <el-col :span="4" style="margin-right: 20px">
          <el-form-item prop="dateRange">
            <el-date-picker v-model="SearchFrom.dateRange" type="daterange" start-placeholder="开始时间"
              end-placeholder="结束时间" value-format="YYYY-MM-DD" />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" :icon="Search" @click="searchData" :loading="datas.loading">{{
            $t('lang.common.search') }}</el-button>
          <el-button :icon="Refresh" @click="resetData">{{
            $t('lang.common.reset')
          }}</el-button>
        </el-col>
      </el-row>
    </el-form>
    <div class="btns">
      <el-button type="primary" @click="exportData" :icon="Upload">导出</el-button>
    </div>
    <el-table :data="datas.data" border row-key="id" default-expand-all stripe style="width: 100%; margin-top: 20px">
      <el-table-column prop="lineCode" label="线体标识" show-overflow-tooltip />
      <el-table-column prop="id" label="站点编号" show-overflow-tooltip />
      <el-table-column prop="workDate" label="日期" show-overflow-tooltip />
      <el-table-column prop="hour" label="时刻" show-overflow-tooltip />
      <el-table-column prop="modelName" label="产品机型标识" show-overflow-tooltip />
      <el-table-column prop="moNumber" label="生产工单编号" show-overflow-tooltip />
      <el-table-column prop="workClass" label="班次" show-overflow-tooltip />
      <el-table-column prop="count" label="通过数量" show-overflow-tooltip />
      <el-table-column prop="defectiveCount" label="不良数量" show-overflow-tooltip />
      <el-table-column prop="returnCount" label="返站通过数量" show-overflow-tooltip />
      <el-table-column prop="updateTime" label="更新时间" show-overflow-tooltip />
      <el-table-column label="工艺流程" show-overflow-tooltip>
        <template #default="scope">
          <el-button type="primary" text @click="onDetail(scope.row)">{{ scope.row.technologicalProcessCode }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <TablePage :pageSize="SearchFrom.pageSize" :layout="layout" :pageTotal="datas.total" @pageFunc="pageFunc">
    </TablePage>
    <edit @close="close" :technologicalProcessCode="technologicalProcessCode" :isShow="isShow" v-if="editDlog">
    </edit>
  </div>
</template>
<script setup lang="ts">
import useKeyEnter from "@/hooks/useKeyEnter.ts";
import {
  defineComponent,
  getCurrentInstance,
  reactive,
  ref,
  toRefs
} from 'vue'
import {
  Download,
  Search,
  Refresh,
  Upload,
} from '@element-plus/icons-vue'
import { exportExcelPOST } from '@/utils/exportDown.js'
import { translateDataToTree } from '@/utils/common.js'
import { ElMessage } from 'element-plus'
import TablePage from '@/components/common/ElementPage.vue'
import edit from '@/views/processFlow/edit.vue'
import { da } from 'element-plus/es/locale'
const { proxy } = getCurrentInstance() as any
const $t = proxy.$t
let SearchFromRef = ref('')
let editDlog = ref<boolean>(false)
let isShow = ref<boolean>(false)
let technologicalProcessCode = ref<any>('')
const SearchFrom: any = reactive({
  endTime: '',
  id: '', // 工站标识
  lineCode: '', // 线体标识
  moNumber: '', //工单
  startTime: '',
  dateRange: [],
  pageNo: 1,
  pageSize: 10
})
interface Datas {
  showEdit: Boolean
  loading: Boolean
  data: Object[]
  editData: any
  total: number
}
let datas: Datas = reactive({
  showEdit: false,
  loading: false,
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
// 查询数据
const searchData = () => {
  datas.loading = true
  datas.data = []
  if (SearchFrom.dateRange && SearchFrom.dateRange.length > 0) {
    SearchFrom.startTime = SearchFrom.dateRange[0].replace(/-/g, "")
    SearchFrom.endTime = SearchFrom.dateRange[1].replace(/-/g, "")
  } else {
    SearchFrom.startTime = ""
    SearchFrom.endTime = ""
  }
  let params = {
    ...SearchFrom
  }
  delete params.dateRange
  proxy.$api.productDataQuery.getProductionDataList(params).then((res: any) => {
    datas.loading = false
    if (res.code == 200) {
      datas.data = res.data.records
      datas.total = res.data.total
    } else {
      datas.data = translateDataToTree(res.data.records)
      console.log('datas.data', datas.data)
    }
  })
}
onMounted(() => {
  if (window.location.search.indexOf("?") != -1) {
    let routerData = getUrl(window.location.search)
    SearchFrom.lineCode = routerData.lineCode
    SearchFrom.startTime = routerData.date
    SearchFrom.endTime = routerData.date
    SearchFrom.dateRange = [SearchFrom.startTime, SearchFrom.endTime]
    searchData()
  } else {
    searchData()
  }
})
function getUrl(url: any) {
  let returl: any = new Object();
  if (url.indexOf("?") != -1) {
    let queryString = url.substr(1);
    let queryParams = queryString.split("&");
    for (let i = 0; i < queryParams.length; i++) {
      let [key, value] = queryParams[i].split("=");
      returl[key] = decodeURI(value);
    }
  };
  return returl;
}
const resetData = () => {
  SearchFrom.lineCode = ''
  SearchFrom.id = ''
  SearchFrom.moNumber = ''
  SearchFrom.endTime = ''
  SearchFrom.startTime = ''
  SearchFrom.dateRange = []
  SearchFrom.pageNo = 1
  SearchFrom.pageSize = 10
  searchData()
}
const onDetail = async (data: any) => {
  if (data.technologicalProcessCode) {
    technologicalProcessCode.value = data.technologicalProcessCode
    editDlog.value = true
    isShow.value = true
  }
}
// productionDataExport
const exportData = async () => {
  if (SearchFrom.dateRange.length > 0) {
    SearchFrom.startTime = SearchFrom.dateRange[0].replace(/-/g, "")
    SearchFrom.endTime = SearchFrom.dateRange[1].replace(/-/g, "")
  }
  let params = {
    ...SearchFrom
  }
  delete params.dateRange
  exportExcelPOST('/api/mgt/data-collect-history/page/export', params, '导出生产数据')
}
const close = () => {
  editDlog.value = false
}
useKeyEnter(searchData);

</script>

<style lang="less" scoped>
#components-form-demo-advanced-search .ant-form {
  max-width: none;
}

#components-form-demo-advanced-search .search-result-list {
  margin-top: 16px;
  border: 1px dashed #e9e9e9;
  border-radius: 2px;
  background-color: #fafafa;
  min-height: 200px;
  text-align: center;
  padding-top: 80px;
}

[data-theme='dark'] .ant-advanced-search-form {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid #434343;
  padding: 24px;
  border-radius: 2px;
}

[data-theme='dark'] #components-form-demo-advanced-search .search-result-list {
  border: 1px dashed #434343;
  background: rgba(255, 255, 255, 0.04);
}
</style>