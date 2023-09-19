<template>
  <div>
    <el-form :model="SearchFrom">
      <el-row :span="20">
        <el-col :span="4" style="margin-right: 20px">
          <el-form-item>
            <el-input v-model="SearchFrom.bomCode" placeholder="请输入BOM清单编号" />
          </el-form-item>
        </el-col>
        <el-col :span="4" style="margin-right: 20px">
          <el-form-item>
            <el-input v-model="SearchFrom.modelCode" placeholder="请输入产品机型标识" />
          </el-form-item>
        </el-col>
        <el-col :span="4" style="margin-right: 20px">
          <el-form-item>
            <el-input v-model="SearchFrom.itemNumber" placeholder="请输入产品机型品号" />
          </el-form-item>
        </el-col>
        <el-col :span="4" style="margin-right: 20px">
          <el-form-item>
            <el-input v-model="SearchFrom.version" placeholder="请输入BOM版本号" />
          </el-form-item>
        </el-col>
        <el-col :span="4" style="margin-right: 20px">
          <el-form-item>
            <el-input v-model="SearchFrom.metaItemNumber" placeholder="请输入元件品号" />
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
      <!-- <el-button type="success" @click="editData" :icon="Download">导入BOM清单</el-button> -->
      <el-button type="primary" @click="exportBom" :icon="Upload">导出BOM清单</el-button>
      <el-button type="info" class="rightDownLoad" @click="exportLoad" :icon="Download">BOM清单模板下载</el-button>
    </div>
    <el-table :data="datas.data" border row-key="bomCode" stripe style="width: 100%; margin-top: 20px">
      <!-- <el-table-column type="index" width="50" :index="indexMethod">
      </el-table-column> -->
      <el-table-column prop="bomCode" label="BOM清单编号" show-overflow-tooltip />
      <el-table-column prop="modelCode" label="产品机型标识" show-overflow-tooltip />
      <el-table-column prop="itemNumber" label="产品机型品号" show-overflow-tooltip />
      <el-table-column prop="version" label="版本" show-overflow-tooltip />
      <el-table-column prop="metaItemNumber" label="元件品号" show-overflow-tooltip />
      <el-table-column prop="memberCount" label="组成用量" show-overflow-tooltip />
      <el-table-column prop="unit" label="用量单位" show-overflow-tooltip />
      <el-table-column prop="procedures" label="工序" show-overflow-tooltip />
      <el-table-column prop="replaceItemNumber" label="替代料编号" show-overflow-tooltip />
      <el-table-column prop="updateUser" label="更新人" show-overflow-tooltip />
      <el-table-column prop="updateTime" label="更新时间" show-overflow-tooltip />
      <!-- <el-table-column :label="$t('lang.common.operate')" show-overflow-tooltip width="250px">
        <template #default="scope">
          <div v-if="scope.row.children">
            <el-button type="success" text @click="editData(scope.row)">更新</el-button>
            <el-button type="primary" text @click="editData(scope.row)">删除</el-button>
            <el-button type="danger" text @click="editData(scope.row)">预览</el-button>
          </div>
        </template>
      </el-table-column> -->
    </el-table>
    <TablePage :pageSize="SearchFrom.pageSize" :layout="layout" :pageTotal="datas.total" @pageFunc="pageFunc">
    </TablePage>
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
import { ElMessage } from 'element-plus'
import { exportExcel } from '@/utils/exportDown.js'
import TablePage from '@/components/common/ElementPage.vue'
const { proxy } = getCurrentInstance() as any
const $t = proxy.$t
const SearchFrom = reactive({
  bomCode: '',
  version: '', // 版本
  itemNumber: '', // 品号
  metaItemNumber: '', // 元件品号
  modelCode: '', // 机型标识
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
  let params = {
    ...SearchFrom
  }
  proxy.$api.BOMList.getList(params).then((res: any) => {
    datas.loading = false
    if (res.code == 200) {
      let data = res.data.records.map((record: any) => {
        record = {
          ...record.childBomList[0], childBomList: record.childBomList
        }
        if (record.childBomList.length > 0) {
          if (record.childBomList.length > 1) {
            delete record.childBomList[0]
            record.children = record.childBomList
            record.children.forEach((i: any) => {
              delete i.bomCode
            })
            delete record.childBomList
          } else {
            delete record.childBomList
            record.children = []
          }
        }
        return record
      })
      datas.data = data
      datas.total = res.data.total
    }
  })
}
useKeyEnter(searchData);
const resetData = () => {
  SearchFrom.bomCode = ''
  SearchFrom.version = ''
  SearchFrom.itemNumber = ''
  SearchFrom.metaItemNumber = ''
  SearchFrom.modelCode = ''
  SearchFrom.pageNo = 1
  SearchFrom.pageSize = 10
  searchData()
}
// 导出BOM清单
const exportBom = () => {
  let params = {
    ...SearchFrom
  }
  exportExcel('/api/mgt/bom/list/export', params, '导出BOM清单')
}
const editData = (data: any) => {
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
// 模板下载
const exportLoad = () => {
  exportExcel('/api/mgt/fileModel/downloadModel', { modelName: 'bomBillModel.xlsx' }, 'BOM清单模板下载')
}
searchData()
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

.rightDownLoad {
  margin-left: auto;
}

.btns {
  margin-top: 20px;
}
</style>
