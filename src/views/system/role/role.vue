<template>
  <div>
    <pro-form
      ref="queryFormRef"
      v-model="SearchFrom"
      :fields="fields"
      :query="true"
      :visible-label="true"
      @on-query="onQuery"
      @on-reset="onReset"
    >
    </pro-form>
    <pro-table
      :toolbars="toolbars"
      ref="proTableRef"
      :data="data"
      :columns="columns"
      :total="total"
      v-model:page-no="pageNo"
      v-model:page-size="pageSize"
      @current-change="onCurrentChange"
      @size-change="onSizeChange"
    >
    </pro-table>
  </div>
  <roleEdit
    v-if="datas.showEdit"
    @close="close"
    :editData="datas.editData"
    @success="searchData"
  ></roleEdit>
</template>

<script setup lang="ts">
  import useTable from '@/hooks/useTable'
  import roleEdit from './roleEdit.vue'
  import { useCallback } from '@/hooks/useCallback'

  const { proxy } = getCurrentInstance() as any
  const $t = proxy.$t
  const toolbars = $ref([
    {
      label: '新增',
      type: 'primary',
      icon: 'Plus',
      click: () => {
        add()
      }
    }
  ])
  const add = () => {
    datas.showEdit = true
    datas.editData = {}
  }
  let datas = reactive<any>({
    showEdit: false,
    editData: {}
  })
  const SearchFrom = reactive({
    keyword: '',
    pageNo: 1,
    pageSize: 10
  })
  const queryFormRef = $ref(null)
  const fields = $ref([
    {
      prop: 'keyword',
      label: '名称',
      component: 'input'
    }
  ])
  let columns = $ref([
    {
      label: '角色名',
      prop: 'roleName'
    },
    {
      label: '角色描述',
      prop: 'roleDes'
    },
    {
      label: '更新人',
      prop: 'updateUser'
    },
    {
      label: '更新时间',
      prop: 'updateTime'
    },
    {
      label: '操作',
      prop: 'operation',
      buttons: [
        {
          type: 'primary',
          label: '编辑',
          click: (data: any) => {
            editData(data.row)
          }
        },
        {
          type: 'warning',
          label: '删除',
          click: (data: any) => {
            del(data.row.id)
          }
        }
      ]
    }
  ])
  const editData = (data: any) => {
    datas.editData = data
    datas.showEdit = true
  }
  // 关闭
  const close = (data: any) => {
    datas.showEdit = false
  }
  const searchData = () => {
    refresh()
  }
  let getTableData = async (params?: any) => {
    params = {
      ...SearchFrom,
      ...params
    }
    let {
      data: { list: data, total: totalCount }
    } = await proxy.$api.role.getRoleList(params)
    console.log(data)
    return {
      dataList: data || [],
      totalCount: totalCount
    }
  }
  let { data, total, onCurrentChange, onSizeChange, refresh } = useTable({
    getTableData
  })
  let onQuery = () => {
    refresh()
  }
  let onReset = async () => {
    await queryFormRef.resetFields()
    refresh()
  }
  //删除角色
  const del = async (id: number) => {
    const res = await proxy?.$api.menu.delete([{ id }])
    useCallback(res, onQuery(), $t('lang.diction.delSuccess'))
  }
</script>
<style lang="less" scoped></style>
