<template>
  <div>
    <el-form :model="SearchFrom">
      <el-row :span="20">
        <el-col :span="4" style="margin-right: 20px">
          <el-form-item label="">
            <el-input
              v-model="SearchFrom.matterName"
              :placeholder="$t('lang.baseData.plzWLname')"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="4" style="margin-right: 20px">
          <el-form-item label="">
            <el-input
              v-model="SearchFrom.matterCode"
              :placeholder="$t('lang.baseData.plzWLcode')"
              clearable
            />
          </el-form-item>
        </el-col>
        <!-- <el-col :span="4" style="margin-right: 20px">
          <el-form-item label="">
            <el-input
              v-model="SearchFrom.matterSupplierCode"
              :placeholder="$t('lang.baseData.plzGYname')"
            />
          </el-form-item>
        </el-col> -->
        <el-col :span="4">
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
    <div class="btns" v-if="false">
      <el-button type="primary" @click="editData" :icon="Plus">{{
        $t('lang.common.add')
      }}</el-button>
      <el-button type="success" :icon="Switch" @click="Synchronization">{{
        $t('lang.common.synchro')
      }}</el-button>
    </div>
    <el-table
      :data="datas.data"
      border
      stripe
      style="width: 100%; margin-top: 20px"
    >
      <el-table-column
        prop="matterName"
        :label="$t('lang.baseData.WLname')"
        show-overflow-tooltip
      />
      <el-table-column
        prop="matterCode"
        :label="$t('lang.baseData.WLCode')"
        show-overflow-tooltip
      />
      <el-table-column
        prop="matterUnit"
        :label="$t('lang.baseData.WLCompany')"
        show-overflow-tooltip
      />
      <el-table-column
        prop="matterTypeStr"
        :label="$t('lang.baseData.WLtype')"
        show-overflow-tooltip
      />
      <el-table-column
        prop="productClassificationStr"
        :label="$t('lang.baseData.CLASSIFICATION')"
        show-overflow-tooltip
      />
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
  <MaterialEdit
    v-if="datas.showEdit"
    @close="close"
    :editData="datas.editData"
    @success="searchData"
  ></MaterialEdit>
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
  import { translateDataToTree } from '@/utils/common.js'
  import { ElMessage } from 'element-plus'
  import TablePage from '@/components/common/ElementPage.vue'
  import MaterialEdit from './MaterialEdit.vue'
  import useKeyEnter from '@/hooks/useKeyEnter.ts'
  const { proxy } = getCurrentInstance() as any
  const $t = proxy.$t
  const SearchFrom = reactive({
    matterCode: '',
    matterName: '',
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
    proxy.$api.MaterialInfo.getList(params).then((res: any) => {
      datas.loading = false
      if (res.code == 200) {
        datas.data = res.data.records
        datas.total = res.data.total
      } else {
        datas.data = translateDataToTree(res.data.list)
        console.log('datas.data', datas.data)
      }
    })
  }
  const resetData = () => {
    SearchFrom.matterCode = ''
    SearchFrom.matterName = ''
    SearchFrom.pageNo = 1
    SearchFrom.pageSize = 10
    searchData()
  }
  const deleteData = (data: any) => {
    let params = data.id
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
  searchData()
  useKeyEnter(searchData)
</script>
<style lang="less" scoped></style>
