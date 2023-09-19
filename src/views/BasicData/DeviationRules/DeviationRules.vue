<template>
  <div>
    <el-form :model="SearchFrom">
      <el-row :span="20">
        <el-col :span="4" style="margin-right: 20px">
          <el-form-item label="">
            <el-input style="display: none;" />
            <el-input v-model="SearchFrom.ruleName" :placeholder="$t('lang.baseData.plzGZmane')" clearable />
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
      <el-button type="primary" @click="editData" :icon="Plus">{{
        $t('lang.common.add')
      }}</el-button>
      <el-button type="danger" :icon="Delete" @click="DeleteData">{{
        $t('lang.common.delete')
      }}</el-button>
    </div>
    <el-table :data="datas.data" border stripe style="width: 100%; margin-top: 20px"
      @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" />
      <el-table-column prop="ruleName" :label="$t('lang.baseData.GZname')" show-overflow-tooltip />
      <el-table-column prop="supplierCode" :label="$t('lang.baseData.GZpz')" show-overflow-tooltip>
        <template #default="scope">
          <div v-if="scope.row.deviationRangeType == 1">
            -{{ scope.row.lowerLimit / 1000 }}kg ~ +{{
              scope.row.superiorLimit / 1000
            }}kg
          </div>
          <div v-if="scope.row.deviationRangeType == 2">
            -{{ scope.row.lowerLimit * 100 }}% ~ +{{
              scope.row.superiorLimit * 100
            }}%
          </div>
        </template>
      </el-table-column>
      <el-table-column :label="$t('lang.common.operate')" show-overflow-tooltip>
        <template #default="scope">
          <el-button type="primary" text @click="editData(scope.row)">{{
            $t('lang.common.details')
          }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <TablePage :pageSize="Number(SearchFrom.pageSize)" :layout="layout" :pageTotal="Number(datas.total)"
      @pageFunc="pageFunc">
    </TablePage>
  </div>
  <DeviationEdit v-if="datas.showEdit" @close="close" :editData="datas.editData" @success="searchData"></DeviationEdit>
</template>

<script setup lang="ts">
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
  Switch
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import TablePage from '../../.././components/common/ElementPage.vue'
import DeviationEdit from './DeviationEdit.vue'
import { useCallback } from '@/hooks/useCallback'
import { useConfirm } from '@/hooks/useConfirm'
import useKeyEnter from '@/hooks/useKeyEnter.ts'
const { proxy } = getCurrentInstance() as any
const $t = proxy.$t
const SearchFrom = reactive({
  ruleName: '',
  pageNo: 1,
  pageSize: 10
})
interface Datas {
  showEdit: Boolean
  loading: Boolean
  data: Object[]
  editData: any
  total: Number
  selectionData: any
}
let datas: Datas = reactive({
  showEdit: false,
  loading: false,
  data: [],
  editData: {},
  total: 0,
  selectionData: []
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
  proxy.$api.rule.getList(params).then((res: any) => {
    datas.loading = false
    if (res.code == 200) {
      datas.data = res.data.records
      datas.total = res.data.total
    } else {
    }
  })
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
/**
 * 回调子组件的事件
 *
 */
const handleSelectionChange = (val: any) => {
  datas.selectionData = val
}
const DeleteData = () => {
  if (datas.selectionData.length < 1) {
    ElMessage({
      message: $t('lang.common.plzDelData') + '!',
      type: 'warning'
    })
  } else {
    let codes = datas.selectionData.map((i: any) => {
      return i.id
    })
    useConfirm(del, codes)
  }
}
const del = async (data: any) => {
  const res = await proxy?.$api.rule.detDel(data)
  useCallback(res, searchData(), $t('lang.common.DelSuc') + '!')
}
const close = (data: any) => {
  datas.showEdit = false
}
const resetData = () => {
  SearchFrom.ruleName = ''
  SearchFrom.pageNo = 1
  SearchFrom.pageSize = 10
  searchData()
}
searchData()
useKeyEnter(searchData)
</script>
<style lang="less" scoped></style>
