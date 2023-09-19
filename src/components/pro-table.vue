<template>
  <div class="pro-table">
    <div class="pro-toolbar" v-if="toolbars && toolbars.length">
      <el-button
        v-for="({ label, click, icon, ...rest }, index) in toolbars"
        :key="index"
        @click="click()"
        v-bind="rest"
      >
        {{ label }}
      </el-button>
    </div>
    <el-table ref="proTable" :data="data" v-bind="$attrs" border>
      <el-table-column
        v-if="index"
        label="序号"
        align="center"
        type="index"
        width="60"
      />
      <el-table-column
        v-if="selection"
        align="center"
        type="selection"
        width="60"
      />
      <el-table-column
        v-for="column in columns"
        v-bind="{
          ...column,
          fixed: column.buttons && 'right',
          'show-overflow-tooltip': true
        }"
      >
        <template #default="scope">
          <slot
            v-if="column.cellSlot"
            :name="column.cellSlot"
            v-bind="scope"
          ></slot>
          <div v-else-if="column.buttons && column.buttons.length">
            <el-button
              link
              v-for="{
                type,
                label,
                click,
                disabled,
                ...rest
              } in column.buttons"
              v-bind="{
                ...rest,
                type: type || 'primary',
                disabled: disabled && disabled(scope)
              }"
              v-has="permission(rest)"
              @click="click(scope)"
            >
              {{ label }}
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="pro-pagination">
      <el-pagination
        background
        layout="total,sizes, jumper, prev, pager, next"
        :page-sizes="[10, 20, 30, 40, 50, 100]"
        :total="total"
        :currentPage="pageNo"
        :pageSize="pageSize"
        @current-change="onCurrentChange"
        @size-change="onSizeChange"
      ></el-pagination>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useRouterPermission } from '@/hooks/permission'
  import { Plus } from '@element-plus/icons-vue'
  const routerPermission = useRouterPermission()
  interface IProps {
    toolbars?: any[]
    data: any[]
    columns: any[]
    index?: boolean
    selection?: boolean
    pageNo?: number
    pageSize?: number
    total: number
  }
  let { toolbars, data, columns, index, selection, pageNo, pageSize, total } =
    withDefaults(defineProps<IProps>(), {
      toolbar: () => [],
      data: () => [],
      columns: () => [],
      index: false,
      selection: false,
      pageNo: 1,
      pageSize: 10,
      total: 0
    })
  const permission = (data: any) => {
    if (data.permission == 'default' || !data.permission) {
      return 'default'
    } else {
      return routerPermission + ':' + data.permission
    }
  }
  let emits = defineEmits([
    'current-change',
    'size-change',
    'update:pageNo',
    'update:pageSize'
  ])
  let onCurrentChange = (pageNo: number) => {
    emits('current-change', pageNo)
    emits('update:pageNo', pageNo)
  }
  let onSizeChange = (pageSize: number) => {
    emits('size-change', pageSize)
    emits('update:pageSize', pageSize)
  }
</script>

<style scoped lang="less">
  .pro-table {
    .pro-toolbar {
      margin-bottom: 20px;
    }
    .pro-pagination {
      margin-top: 20px;
      display: flex;
      justify-content: flex-end;
    }
  }
  .el-pagination {
    justify-content: flex-end;
  }
</style>
