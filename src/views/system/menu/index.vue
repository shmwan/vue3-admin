<template>
  <div>
    <div class="search-form">
      <el-form :inline="true" :model="searchForm" class="demo-form-inline">
        <el-form-item>
          <el-input
            v-model="searchForm.keyword"
            :placeholder="$t('lang.menu.keyWordPlz')"
          />
        </el-form-item>
        <el-form-item style="margin-left: 50px">
          <el-button
            type="primary"
            @click="searchData"
            :icon="Search"
            :loading="datas.loading"
            >{{ $t('lang.common.search') }}</el-button
          >
          <el-button @click="resetData" :icon="Refresh">{{
            $t('lang.common.reset')
          }}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="btns">
      <buttonVue type="primary" @click="editData" :icon="Plus">{{
        $t('lang.common.add')
      }}</buttonVue>
    </div>
    <el-table
      ref="dataTable"
      :data="
        datas.data.slice(
          (searchForm.pageNo - 1) * searchForm.pageSize,
          searchForm.pageNo * searchForm.pageSize
        )
      "
      border
      row-key="id"
      stripe
      lazy
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <!-- <el-table-column
            type="selection"
            :selectable="selectable"
            width="50" align="center"
           :show-overflow-tooltip="false" ></el-table-column> -->
      <el-table-column
        prop="name"
        label="菜单名称"
        :show-overflow-tooltip="false"
      ></el-table-column>
      <el-table-column
        prop="routerName"
        label="路由名称"
        :show-overflow-tooltip="false"
      ></el-table-column>
      <el-table-column
        prop="requestUrl"
        label="访问地址"
        :show-overflow-tooltip="false"
      ></el-table-column>
      <el-table-column prop="type" label="类型">
        <template #default="scope">
          <span>{{
            scope.row.type == 0 ? '目录' : scope.row.type == 1 ? '菜单' : '功能'
          }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="icon" label="图标">
        <template #default="icon">
          <span
            :class="icon.row.icon"
            style="font-size: 18px; color: #8492a6; font-weight: bolder"
          ></span>
        </template>
      </el-table-column>
      <el-table-column
        prop="orderNum"
        label="序号"
        :show-overflow-tooltip="false"
      ></el-table-column>
      <!-- <el-table-column prop="createTimeStr" label="创建时间" :show-overflow-tooltip="false" ></el-table-column> -->
      <el-table-column label="操作" ref="caozuo">
        <template #default="scope">
          <buttonVue
            type="primary"
            link
            @click="editData(scope.row, 0)"
            :disabled="scope.row.type === 2"
            >新增</buttonVue
          >
          <buttonVue type="warning" link @click="editData(scope.row, 1)"
            >修改</buttonVue
          >
          <buttonVue type="danger" link @click="deleteData(scope.row)"
            >删除</buttonVue
          >
        </template>
      </el-table-column>
    </el-table>
    <table-page
      :pageSize="searchForm.pageSize"
      :pageTotal="datas.total"
      @pageFunc="handleTableChange"
    >
    </table-page>
  </div>
  <edit
    :editData="datas.editData"
    v-if="editDlg"
    @close="close"
    @success="searchData"
  >
  </edit>
</template>
<script lang="ts" setup>
  import { getCurrentInstance, reactive, computed, ref, toRefs } from 'vue'
  import edit from './edit.vue'
  import { useCallback } from '@/hooks/useCallback'
  import { useConfirm } from '@/hooks/useConfirm'
  import { translateDataToTree, treeToList } from '@/utils/common.js'

  import TablePage from '@/components/common/ElementPage.vue'
  import { Search, Refresh, Plus } from '@element-plus/icons-vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  interface SearchFroms {
    pageNo: number
    pageSize: number
    keyword: string
  }
  const editDlg = ref<Boolean>(false)
  const { proxy } = getCurrentInstance()
  const $t = proxy.$t

  let searchForm: SearchFroms = reactive({
    pageNo: 1,
    pageSize: 10,
    keyword: ''
  })
  let datas: any = reactive({
    loading: false,
    data: [],
    total: 0,
    editData: {},
    codeList: []
  })

  const indexMethod = (index: number) => {
    let indexNo: number = index + 1
    const pageNo: number = searchForm.pageNo - 1
    const pageSize = searchForm.pageSize
    const count: number = pageNo * pageSize
    let sort: number = indexNo + count
    return sort
  }

  /**
   * 查询codeList
   */
  const getCodeList = () => {
    try {
      proxy?.$api.dict.searchCode().then((res: any) => {
        let data = res.data
        datas.codeList = data
      })
    } catch (error) {
      console.log(error)
    }
  }
  getCodeList()
  /**
   * 回调子组件的事件
   *
   */
  const close = (data: any) => {
    editDlg.value = false
  }
  /**
   * 打开子组件
   */
  const editData = (data: any) => {
    if (data) {
      datas.editData = toRefs(data)
    } else {
      datas.editData = {}
    }
    editDlg.value = true
  }

  // 查询数据
  const searchData = async () => {
    datas.loading = true
    let params = {
      ...searchForm
    }
    await proxy?.$api.menu
      .getMenuList({ pageNo: 1, pageSize: 99999, keyword: params.keyword })
      .then((res: any) => {
        datas.loading = false
        if (params.keyword && params.keyword != '') {
          datas.data = res.list
          datas.total = res.list.length
        } else {
          datas.data = translateDataToTree(res.list)
          datas.total = datas.data.length
        }
      })
  }
  searchData()
  /**
   *
   */

  const del = async (data: any) => {
    const res = await proxy?.$api.dict.delete([{ id: data.id }])
    useCallback(res, searchData(), $t('lang.diction.delSuccess'))
  }
  const deleteData = async (data: any) => {
    useConfirm(del, data)
  }

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
    searchForm.pageNo = 1
    searchForm.pageSize = 10
    searchForm.keyword = ''
    searchData()
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
</style>
