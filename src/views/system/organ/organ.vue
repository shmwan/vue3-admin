<template>
  <div>
    <el-form :model="SearchFrom">
      <el-row :span="20">
        <el-col :span="4" style="margin-right: 20px">
          <el-form-item label="">
            <el-input
              v-model="SearchFrom.keyword"
              :placeholder="$t('lang.organ.keyWordPlz')"
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
    <div class="btns">
      <el-button type="primary" @click="editData('', 1)" :icon="Plus">{{
        $t('lang.common.add')
      }}</el-button>
    </div>
    <el-table
      :data="datas.data"
      border
      stripe
      row-key="id"
      style="width: 100%; margin-top: 20px"
    >
      <el-table-column
        prop="organName"
        label="组织名称"
        show-overflow-tooltip
      />
      <el-table-column prop="organNo" label="组织代码" show-overflow-tooltip />
      <el-table-column prop="createUser" label="创建人" show-overflow-tooltip />
      <el-table-column
        prop="preOrganNo"
        label="上级组织"
        show-overflow-tooltip
      />
      <el-table-column :label="$t('lang.common.operate')" show-overflow-tooltip>
        <template #default="scope">
          <el-button type="primary" text @click="editData(scope.row, 1)"
            >修改</el-button
          >
          <el-button type="danger" text @click="DeleteBtn(scope.row)"
            >删除</el-button
          >
          <el-button type="warning" text @click="editData(scope.row, 2)">{{
            $t('lang.common.details')
          }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- <TablePage
      :pageSize="Number(SearchFrom.pageSize)"
      :layout="layout"
      :pageTotal="Number(datas.total)"
      @pageFunc="pageFunc"
    >
    </TablePage> -->
  </div>
  <organEdit
    v-if="datas.showEdit"
    @close="close"
    :editData="datas.editData"
    :isShow="datas.show"
    @success="searchData"
  ></organEdit>
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
  import organEdit from './organEdit.vue'
  import { translateDataToTree } from '@/utils/common.js'
  import { useCallback } from '@/hooks/useCallback'
  import { useConfirm } from '@/hooks/useConfirm'
  const { proxy } = getCurrentInstance() as any
  const $t = proxy.$t
  const SearchFrom = reactive({
    keyword: '',
    pageNo: 1,
    pageSize: 99999
  })
  interface Datas {
    showEdit: boolean
    loading: boolean
    data: Object[]
    editData: any
    total: number
    selectionData: any
    show: boolean
  }
  let datas: Datas = reactive({
    show: false,
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
    proxy.$api.organ.getList(params).then((res: any) => {
      datas.loading = false
      if (res.code == 200) {
        if (params.keyword && params.keyword != '') {
          datas.data = res.data.list
        } else {
          datas.data = translateDataToTree(res.data.list)
          console.log('datas.data', datas.data)
        }
        // datas.data = res.data.list
        // datas.total = res.data.total
      } else {
      }
    })
  }
  const editData = (data: any, num: any) => {
    console.log(data)
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
  /**
   * 回调子组件的事件
   *
   */
  const DeleteBtn = (data: any) => {
    let params = data.id
    useConfirm(deleteData, params, '确定删除选中的数据？')
  }
  const deleteData = async (params: any) => {
    const res = await proxy?.$api.organ.delete([params])
    useCallback(res, searchData(), $t('lang.common.DelSuc') + '!')
  }
  const close = (data: any) => {
    datas.showEdit = false
  }
  const resetData = () => {
    SearchFrom.keyword = ''
    SearchFrom.pageNo = 1
    SearchFrom.pageSize = 99999
    searchData()
  }
  searchData()
</script>
<style lang="less" scoped></style>
