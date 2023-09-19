<template>
  <div>
    <div class="search-form">
      <el-form :inline="true" :model="searchForm" class="demo-form-inline">
        <el-form-item>
          <el-input
            v-model="searchForm.userName"
            :placeholder="$t('lang.log.userNamePlh')"
            @keyup.enter.native="searchData"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="searchForm.title"
            :placeholder="$t('lang.log.titlePlh')"
            @keyup.enter.native="searchData"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="searchForm.businessType"
            :placeholder="$t('lang.log.businessTypePlh')"
          >
            <el-option
              v-for="item in datas.businessTypes"
              :key="item.id"
              :label="item.name"
              :value="item.id"
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
    <el-table :data="datas.data" border stripe>
      <el-table-column
        type="index"
        width="50"
        align="center"
        :index="indexMethod"
        v-if="false"
      ></el-table-column>
      <el-table-column
        prop="userName"
        :label="$t('lang.log.userName')"
      ></el-table-column>
      <el-table-column
        prop="title"
        :label="$t('lang.log.title')"
      ></el-table-column>
      <el-table-column
        prop="type"
        :label="$t('lang.log.type')"
        :formatter="typeFormatter"
      ></el-table-column>
      <el-table-column
        prop="status"
        :formatter="statusFormatter"
        :label="$t('lang.log.status')"
      ></el-table-column>
      <el-table-column
        prop="operTime"
        sortable
        :label="$t('lang.log.operTime')"
      ></el-table-column>
      <el-table-column :label="$t('lang.common.operate')">
        <template #default="scope">
          <el-button type="primary" text @click="look(scope.row)">{{
            $t('lang.common.look')
          }}</el-button>
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
  <log-Detail :logDetails="datas.editData" v-if="logDetailDlg" @close="close">
  </log-Detail>
</template>
<script lang="ts" setup>
  import { getCurrentInstance, reactive, computed, ref, toRefs } from 'vue'
  import logDetail from './logDetail.vue'
  import TablePage from '@/components/common/ElementPage.vue'
  import { Search, Refresh } from '@element-plus/icons-vue'
  interface SearchFroms {
    keyword: string
    pageNo: number
    pageSize: number
    userName: string
    title: string
    businessType: string | null
  }
  const logDetailDlg = ref<Boolean>(false)
  const { proxy } = getCurrentInstance()
  const $t = proxy.$t
  let searchForm: SearchFroms = reactive({
    keyword: '',
    pageNo: 1,
    pageSize: 10,
    userName: '',
    title: '',
    businessType: null
  })
  let datas = reactive({
    loading: false,
    data: [],
    total: 0,
    editData: {},
    businessTypes: [
      {
        id: 0,
        name: $t('lang.log.businessTypes0')
      },
      {
        id: 1,
        name: $t('lang.log.businessTypes1')
      },
      {
        id: 2,
        name: $t('lang.log.businessTypes2')
      },
      {
        id: 3,
        name: $t('lang.log.businessTypes3')
      }
    ],
    statusList: [$t('lang.log.statusList0'), $t('lang.log.statusList1')]
  })
  // 格式化业务类型
  const typeFormatter = (value: any) => {
    return datas.businessTypes[value.businessType].name
  }
  // 格式化操作状态
  const statusFormatter = (value: any) => {
    return datas.statusList[value.status]
  }
  const indexMethod = (index: number) => {
    let indexNo: number = index + 1
    const pageNo: number = searchForm.pageNo - 1
    const pageSize = searchForm.pageSize
    const count: number = pageNo * pageSize
    let sort: number = indexNo + count
    return sort
  }
  /**
   * 回调子组件的事件
   *
   */
  const close = (data: any) => {
    logDetailDlg.value = false
  }
  /**
   * 打开子组件
   */
  const look = (data: any) => {
    if (data) {
      datas.editData = toRefs(data)
    } else {
      datas.editData = {}
    }
    logDetailDlg.value = true
  }

  // 查询数据
  const searchData = () => {
    datas.loading = true
    let params = {
      ...searchForm
    }
    proxy?.$api.log.getLogList(params).then((res: any) => {
      let data = res.data.records
      datas.loading = false
      datas.data = data
      datas.total = res.data.total
    })
  }
  searchData()
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
    searchForm.keyword = ''
    searchForm.pageNo = 1
    searchForm.pageSize = 10
    searchForm.userName = ''
    searchForm.title = ''
    searchForm.businessType = ''
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
