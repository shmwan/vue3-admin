<template>
  <pro-container>
    <pro-form
      ref="queryFormRef"
      v-model="queryForm"
      :fields="fields"
      query
      visible-label
      @on-query="onQuery"
      @on-reset="onReset"
    >
    </pro-form>
    <div class="btns">
      <el-button type="primary" @click="editData('', 1)" :icon="Plus">{{
        $t('lang.common.add')
      }}</el-button>
      <el-button type="danger" @click="editData('', 1)" :icon="Delete"
        >删除</el-button
      >
    </div>
    <pro-table
      ref="proTableRef"
      :toolbars="toolbars"
      :data="data"
      :columns="columns"
      :total="total"
      :selection="true"
      v-model:page-no="pageNo"
      v-model:page-size="pageSize"
      @current-change="onCurrentChange"
      @size-change="onSizeChange"
    >
    </pro-table>
  </pro-container>
  <userEdit
    v-if="datas.showEdit"
    @close="close"
    :editData="datas.editData"
    :isShow="datas.show"
    @success="searchData"
  ></userEdit>
</template>

<script setup lang="ts">
  import useTable from '@/hooks/useTable'
  import { useCallback } from '@/hooks/useCallback'
  import { useConfirm } from '@/hooks/useConfirm'
  import { Delete, Plus } from '@element-plus/icons-vue'
  import userEdit from './userEdit.vue'
  const { proxy } = getCurrentInstance() as any
  const $t = proxy.$t
  let queryForm = $ref({
    keyword: ''
  })
  let fields = $ref([
    {
      prop: 'keyword',
      label: '请输入用户名/登录名',
      component: 'input'
    }
  ])
  interface Datas {
    showEdit: boolean
    editData: any
    show: boolean
  }
  let datas: Datas = reactive({
    showEdit: false,
    editData: {},
    show: false
  })
  let proTableRef = $ref(null)
  const getTableData = async (params: any) => {
    params = {
      ...params,
      ...queryForm
    }
    let {
      data: { list: data, total: totalCount }
    } = await proxy.$api.user.getUserList(params)
    return {
      dataList: data || [],
      totalCount: totalCount
    }
  }
  let {
    queryFormRef,
    data,
    total,
    onQuery,
    onReset,
    pageNo,
    pageSize,
    onCurrentChange,
    onSizeChange,
    refresh
  } = useTable({
    getTableData
  })
  console.log('data', data)
  let columns = $ref([
    { label: '登录名', prop: 'username' },
    { label: '用户名', prop: 'showName' },
    { label: '所属组织', prop: 'organNameList' },
    { label: '启用状态', prop: 'status' },
    { label: '角色', prop: 'roleNameList' },
    { label: '用户组', prop: 'groupName' },
    { label: '联系电话', prop: 'mobile' },
    { label: '更新时间', prop: 'updateTimeStr' },
    { label: '上次登陆时间', prop: 'lastLoginTime' },
    {
      label: '操作',
      prop: 'option',
      buttons: [
        {
          label: '修改',
          click: ({ row }) => {
            editData(row, 1)
          }
        },
        {
          label: '删除',
          type: 'danger',
          click: ({ row }) => {
            DeleteBtn(row)
          }
        },
        {
          label: '详情',
          type: 'warning',
          click: ({ row }) => {
            editData(row, 2)
          }
        }
      ]
    }
  ])
  const DeleteBtn = (data: any) => {
    let params = [data.id]
    useConfirm(deleteData, params, '确定删除选中的数据？')
  }
  const deleteData = async (params: any) => {
    const res = await proxy?.$api.user.deleteUser(params)
    useCallback(res, refresh(), $t('lang.common.DelSuc') + '!')
  }
  const close = (data: any) => {
    datas.showEdit = false
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
  const searchData = () => {
    refresh()
  }
</script>
<style lang="less" scoped></style>
