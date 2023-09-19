<template>
  <div>
    <el-form :model="SearchFrom">
      <el-row :span="20">
        <el-col :span="4" style="margin-right: 20px">
          <el-form-item label="">
            <el-input style="display: none;" />
            <el-input v-model="SearchFrom.keyword" :placeholder="$t('lang.ImesData.plzModel')" clearable />
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
        $t('lang.ImesData.addModel')
      }}</el-button>
    </div>
    <el-table :data="datas.data" border stripe style="width: 100%; margin-top: 20px">
      <el-table-column prop="modelCode" :label="$t('lang.ImesData.modelBs')" show-overflow-tooltip />
      <el-table-column prop="modelName" :label="$t('lang.ImesData.modelName')" show-overflow-tooltip /><el-table-column
        prop="modelImage" :label="$t('lang.ImesData.image')" show-overflow-tooltip>
        <template #default="scope">
          <span v-if="scope.row.modelImage">
            <el-image style="width: 50px; height: 50px" :preview-teleported="true"
              :src="datas.imgUrl + scope.row.modelImage" :zoom-rate="1.5"
              :preview-src-list="[datas.imgUrl + scope.row.modelImage]" fit="cover" />
          </span>
          <span v-else>
            <el-button type="primary" text @click="editData(scope.row, 1)">{{
              $t('lang.ImesData.upload')
            }}</el-button>
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="itemNumber" :label="$t('lang.ImesData.productNo')" show-overflow-tooltip />
      <el-table-column prop="remark" :label="$t('lang.ImesData.remark')" show-overflow-tooltip />
      <el-table-column prop="updateUser" :label="$t('lang.ImesData.updateUser')" show-overflow-tooltip />
      <el-table-column prop="updateTime" :label="$t('lang.ImesData.updateTime')" show-overflow-tooltip />
      <el-table-column :label="$t('lang.common.operate')" show-overflow-tooltip width="300px">
        <template #default="scope">
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
    <ProductModelEdit v-if="datas.showEdit" @close="close" :editData="datas.editData" :isShow="datas.show"
      @success="searchData"></ProductModelEdit>
  </div>
</template>

<script setup lang="ts">
import { defineComponent, getCurrentInstance, reactive } from 'vue'
import { Search, Refresh, Plus } from '@element-plus/icons-vue'
import { translateDataToTree } from '@/utils/common.js'
import { ElMessage } from 'element-plus'
import TablePage from '@/components/common/ElementPage.vue'
import ProductModelEdit from './ProductModelEdit.vue'
import { useCallback } from '@/hooks/useCallback'
import { useConfirm } from '@/hooks/useConfirm'
import useKeyEnter from '@/hooks/useKeyEnter.ts'
const { proxy } = getCurrentInstance() as any
const $t = proxy.$t
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
  imgUrl: string
}
let datas: Datas = reactive({
  showEdit: false,
  loading: false,
  data: [],
  editData: {},
  total: 0,
  show: false,
  imgUrl: config().imgBaseUrl
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
  proxy.$api.ProductModel.getList(params).then((res: any) => {
    datas.loading = false
    if (res.code == 200) {
      datas.data = res.data.records
      datas.total = res.data.total
    } else {
      datas.data = translateDataToTree(res.data.list)
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
    `-${data.modelName}[${data.modelCode}]` +
    $t('lang.common.delTipTwo')
  )
}
const deleteData = (params: any) => {
  proxy.$api.ProductModel.DeleteData(params).then((res: any) => {
    datas.loading = false
    useCallback(res)
    searchData()
  })
}
const Synchronization = () => {
  proxy.$api.MaterialInfo.MatterAynchronization().then((res: any) => {
    if (res.code == 200) {
      ElMessage({
        message: $t('lang.common.synchroSuc') + '!',
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
