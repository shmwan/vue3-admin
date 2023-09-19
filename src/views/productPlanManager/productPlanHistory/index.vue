<template>
  <div>
    <el-form :model="SearchFrom">
      <el-row :span="20">
        <el-col :span="6">
          <el-form-item>
            <el-date-picker
              v-model="SearchFrom.timeArrs"
              type="daterange"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              value-format="YYYY-MM-DD"
              format="YYYY-MM-DD"
              :disabled-date="disabledDate"
            />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item>
            <el-input
              v-model="SearchFrom.supplierName"
              :placeholder="$t('lang.baseData.GYNamePlz')"
            />
          </el-form-item>
        </el-col>
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
    <el-table
      :data="datas.data"
      border
      stripe
      style="width: 100%; margin-top: 20px"
    >
      <el-table-column
        type="index"
        width="60"
        :index="indexMethod"
        :label="$t('lang.common.orderNO')"
        show-overflow-tooltip
      />
      <el-table-column label="更新人" prop="updator" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="导入文件" prop="file" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="更新时间" prop="updateTime" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="操作" show-overflow-tooltip>
        <template #default="scope">
          <el-button type="primary" text @click="editData(scope)"
            >预览</el-button
          >
          <el-button type="primary" text @click="editData(scope)"
            >下载</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <TablePage
      :pageSize="SearchFrom.pageSize"
      :pageTotal="datas.total"
      @pageFunc="pageFunc"
    >
    </TablePage>
  </div>
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
  import TablePage from '@/components/common/ElementPage.vue'
  import { translateDataToTree } from '@/utils/common.js'
  import { ElMessage } from 'element-plus'
  import SupplierEdit from './SupplierEdit.vue'
  import DateUtils from '@/utils/dateUtils.js'
  const { proxy } = getCurrentInstance() as any
  const $t = proxy.$t
  const SearchFrom = reactive({
    supplierName: '',
    pageNo: 1,
    pageSize: 10,
    timeArrs: [
      DateUtils.format(
        new Date(new Date().getTime() - 3600 * 1000 * 24 * 30),
        'yyyy-MM-dd'
      ),
      DateUtils.format(new Date(), 'yyyy-MM-dd')
    ]
  })
  interface Datas {
    showEdit: Boolean
    loading: Boolean
    data: Object[]
    editData: any
    total: Number
  }
  let datas: Datas = reactive({
    showEdit: false,
    loading: false,
    data: [],
    editData: {},
    total: 0
  })
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
    proxy.$api.SupplierInfo.getList(params).then((res: any) => {
      datas.loading = false
      if (res.code == 200) {
        datas.data = res.data.records
        datas.total = res.data.total
      } else {
        datas.data = translateDataToTree(res.data.list)
      }
    })
  }
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
  const deleteData = (data: any) => {
    let params = data.id
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
  /**
   * 回调子组件的事件
   *
   */
  const close = (data: any) => {
    datas.showEdit = false
  }
  const resetData = () => {
    SearchFrom.supplierName = ''
    SearchFrom.pageNo = 1
    SearchFrom.pageSize = 10
    searchData()
  }
  // searchData()
</script>
<style lang="less" scoped>
  :deep(.el-col) {
    margin-right: 20px;
  }
</style>
