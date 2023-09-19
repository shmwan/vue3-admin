<template>
  <div>
    <div class="search-form">
      <el-form :inline="true" :model="searchForm" class="demo-form-inline">
        <el-form-item>
          <el-select
            v-model="searchForm.groupName"
            filterable
            clearable
            :placeholder="$t('lang.diction.dictionTypePlz')"
          >
            <el-option
              v-for="item in datas.codeList"
              :key="item.groupName"
              :label="item.groupName"
              :value="item.groupName"
            >
            </el-option>
          </el-select>
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
      <buttonVue
        type="primary"
        hasPermission="add"
        @click="editData"
        :icon="Plus"
        >{{ $t('lang.common.add') }}</buttonVue
      >
    </div>
    <el-table :data="datas.data" border stripe>
      <el-table-column
        type="index"
        width="50"
        align="center"
        :index="indexMethod"
        v-if="false"
      ></el-table-column>
      <el-table-column
        prop="groupCode"
        :label="$t('lang.diction.groupCode')"
      ></el-table-column>
      <el-table-column
        prop="groupName"
        :label="$t('lang.diction.groupName')"
      ></el-table-column>
      <el-table-column
        prop="dictionName"
        :label="$t('lang.diction.dictionName')"
      ></el-table-column>
      <el-table-column
        prop="dictionCode"
        :label="$t('lang.diction.dictionCode')"
      ></el-table-column>
      <el-table-column
        prop="remark"
        :label="$t('lang.diction.remark')"
      ></el-table-column>
      <el-table-column :label="$t('lang.common.operate')">
        <template #default="scope">
          <buttonVue
            type="primary"
            hasPermission="edit"
            text
            @click="editData(scope.row)"
            >{{ $t('lang.common.edit') }}</buttonVue
          >
          <buttonVue
            type="warning"
            hasPermission="del"
            text
            @click="deleteData(scope.row)"
            >{{ $t('lang.common.delete') }}</buttonVue
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
  <edit-diction
    :editData="datas.editData"
    v-if="editDlg"
    @close="close"
    @success="searchData"
  >
  </edit-diction>
</template>
<script lang="ts" setup>
  import { getCurrentInstance, reactive, computed, ref, toRefs } from 'vue'
  import editDiction from './editDiction.vue'
  import { useCallback } from '@/hooks/useCallback'
  import { useConfirm } from '@/hooks/useConfirm'
  import TablePage from '@/components/common/ElementPage.vue'
  import { Search, Refresh, Plus } from '@element-plus/icons-vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  interface SearchFroms {
    pageNo: number
    pageSize: number
    groupCode: string
    groupName: string
  }
  const editDlg = ref<Boolean>(false)
  const { proxy } = getCurrentInstance()
  const $t = proxy.$t

  let searchForm: SearchFroms = reactive({
    pageNo: 1,
    pageSize: 10,
    groupCode: '',
    groupName: ''
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
  const searchData = () => {
    datas.loading = true
    let params = {
      ...searchForm
    }
    proxy?.$api.dict.getList(params).then((res: any) => {
      let data = res.data.list
      datas.loading = false
      datas.data = data
      datas.total = res.data.total
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
    searchForm.groupCode = ''
    searchForm.groupName = ''
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
