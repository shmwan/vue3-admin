<template>
  <div>
    <el-form :model="SearchFrom">
      <el-row :span="20">
        <el-col :span="4" style="margin-right: 20px">
          <el-form-item label="">
            <el-input style="display: none;" />
            <el-input v-model="SearchFrom.keyword" :placeholder="$t('lang.ImesData.plzLine')" clearable />
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
      <el-button type="primary" @click="editData('', 1)" :icon="Plus">{{
        $t('lang.ImesData.addLine')
      }}</el-button>
    </div>
    <el-table :data="datas.data" border stripe style="width: 100%; margin-top: 20px">
      <el-table-column prop="lineCode" :label="$t('lang.ImesData.LineBs')" show-overflow-tooltip />
      <el-table-column prop="lineName" :label="$t('lang.ImesData.LineName')" show-overflow-tooltip />
      <el-table-column prop="factoryCode" :label="$t('lang.ImesData.Factory')" show-overflow-tooltip />
      <el-table-column prop="remark" :label="$t('lang.ImesData.remark')" show-overflow-tooltip />
      <el-table-column prop="updateUser" :label="$t('lang.ImesData.updateUser')" show-overflow-tooltip />
      <el-table-column prop="updateTime" :label="$t('lang.ImesData.updateTime')" show-overflow-tooltip />
      <el-table-column :label="$t('lang.common.operate')" show-overflow-tooltip width="300px">
        <template #default="scope">
          <el-button type="success" text @click="goBigScreen(scope.row)">{{
            $t('lang.ImesData.board')
          }}</el-button>
          <el-button type="primary" text @click="editData(scope.row, 1)">{{
            $t('lang.common.gaiBtn')
          }}</el-button>
          <el-button type="danger" text @click="DeleteBtn(scope.row)">{{
            $t('lang.common.delBtn')
          }}</el-button>
          <el-button type="warning" text @click="editData(scope.row, 2)">{{
            $t('lang.common.details')
          }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <TablePage :pageSize="SearchFrom.pageSize" :layout="layout" :pageTotal="datas.total" @pageFunc="pageFunc">
    </TablePage>
    <ProductionlineEdit v-if="datas.showEdit" @close="close" :isShow="datas.show" :editData="datas.editData"
      @success="searchData"></ProductionlineEdit>
  </div>
</template>

<script setup lang="ts">
import { defineComponent, getCurrentInstance, reactive } from 'vue'
import { Search, Refresh, Plus } from '@element-plus/icons-vue'
import TablePage from '@/components/common/ElementPage.vue'
import ProductionlineEdit from './ProductionlineEdit.vue'
import { useRouter } from 'vue-router'
import { useCallback } from '@/hooks/useCallback'
import { useConfirm } from '@/hooks/useConfirm'
import useKeyEnter from '@/hooks/useKeyEnter.ts'
const { proxy } = getCurrentInstance() as any
const $t = proxy.$t
const router = useRouter()
const SearchFrom = reactive({
  keyword: '',
  pageNo: 1,
  pageSize: 10
})
interface Datas {
  showEdit: boolean
  loading: boolean
  data: Object[]
  editData: any
  total: number
  show: boolean
}
let datas: Datas = reactive({
  showEdit: false,
  loading: false,
  data: [],
  editData: {},
  total: 0,
  show: false
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
  proxy.$api.Productionline.getList(params).then((res: any) => {
    datas.loading = false
    if (res.code == 200) {
      datas.data = res.data.records
      datas.total = res.data.total
    }
  })
}
const resetData = () => {
  SearchFrom.keyword = ''
  SearchFrom.pageNo = 1
  SearchFrom.pageSize = 10
  searchData()
}
const DeleteBtn = (data: any) => {
  let params = data.id
  useConfirm(
    deleteData,
    params,
    $t('lang.common.delTipOne') +
    `-${data.lineName}[${data.lineCode}]` +
    $t('lang.common.delTipTwo')
  )
}
const deleteData = (params: any) => {
  proxy.$api.Productionline.DeleteData(params).then((res: any) => {
    datas.loading = false
    useCallback(res)
    searchData()
  })
}
let otherwindow: any = null
const goBigScreen = (data: any) => {
  // router.push('/bigScreen')
  if (otherwindow && !otherwindow.closed) {
    if (otherwindow.location.search == `?lineCode=${data.lineCode}`) {
      otherwindow.focus()
    } else {
      otherwindow = window.open(
        `/bigScreen?lineCode=${data.lineCode}`,
        'bigScreen'
      )
    }
  } else {
    otherwindow = window.open(
      `/bigScreen?lineCode=${data.lineCode}`,
      'bigScreen'
    )
  }
}
const editData = (data: any, num: any) => {
  if (data) {
    if (num == 1) {
      datas.show = false
    } else {
      datas.show = true
    }
    datas.editData = data
  } else {
    datas.show = false
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
searchData()
useKeyEnter(searchData)
</script>
<style lang="less" scoped></style>
