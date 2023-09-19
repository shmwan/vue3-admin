<template>
  <div>
    <el-form :model="SearchFrom">
      <el-row :span="20">
        <el-col :span="4">
          <el-form-item>
            <el-input
              v-model="SearchFrom.lineCode"
              :placeholder="$t('lang.productPlan.XTBS')"
            />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item>
            <el-input
              v-model="SearchFrom.modelName"
              :placeholder="$t('lang.productPlan.CPJXBS')"
            />
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item>
            <el-checkbox-group
              v-model="SearchFrom.radio"
              @change="checkBoxChange"
            >
              <el-checkbox label="D">D(白班))</el-checkbox>
              <el-checkbox label="P">P(中班)</el-checkbox>
              <el-checkbox label="N">N(晚班)</el-checkbox>
            </el-checkbox-group>
            <!-- <el-radio-group v-model="SearchFrom.radio">
              <el-radio label="D">D班</el-radio>
              <el-radio label="P">P班</el-radio>
              <el-radio label="N">N班</el-radio>
            </el-radio-group> -->
          </el-form-item>
        </el-col>
        <el-col :span="5">
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
    <!-- <div class="btns">
      <el-button type="primary" @click="editData" :icon="Plus">{{
        $t('lang.common.add')
      }}</el-button>
      <el-button type="success" :icon="Switch" @click="Synchronization">{{
        $t('lang.common.synchro')
      }}</el-button>
    </div> -->
    <el-table
      :data="datas.data"
      border
      stripe
      style="width: 100%; margin-top: 20px"
    >
      <el-table-column
        type="index"
        width="100"
        v-if="false"
        :index="indexMethod"
        :label="$t('lang.common.orderNO')"
        show-overflow-tooltip
        :fit="false"
      />
      <el-table-column
        width="100"
        show-overflow-tooltip
        v-for="(item, index) in column"
        :label="item.name"
        :prop="item.prop"
        :key="index"
      ></el-table-column>
      <el-table-column label="生产计划" align="center">
        <el-table-column
          :label="item.workDate"
          v-for="(item, index) in datas.data[0].details"
          :key="index"
          align="center"
        >
          <el-table-column
            prop="state"
            label="D"
            width="70"
            v-if="SearchFrom.radio.includes('D')"
          >
            <template #default="scope">
              {{ scope.row.details[index].dayPlanQty }}
            </template>
          </el-table-column>
          <el-table-column
            prop="state"
            label="人力"
            show-overflow-tooltip
            width="70"
            v-if="SearchFrom.radio.includes('D')"
          >
            <template #default="scope">
              {{ scope.row.details[index].dayPlanHuman }}
            </template>
          </el-table-column>
          <el-table-column
            prop="state"
            label="备注"
            width="70"
            show-overflow-tooltip
            v-if="SearchFrom.radio.includes('D')"
          >
            <template #default="scope">
              {{ scope.row.details[index].dayNotes }}
            </template>
          </el-table-column>
          <el-table-column
            prop="city"
            label="P"
            show-overflow-tooltip
            width="70"
            v-if="SearchFrom.radio.includes('P')"
          >
            <template #default="scope">
              {{ scope.row.details[index].pPlanQty }}
            </template>
          </el-table-column>
          <el-table-column
            prop="state"
            label="人力"
            show-overflow-tooltip
            width="70"
            v-if="SearchFrom.radio.includes('P')"
          >
            <template #default="scope">
              {{ scope.row.details[index].pplanHuman }}
            </template>
          </el-table-column>
          <el-table-column
            prop="state"
            label="备注"
            show-overflow-tooltip
            width="70"
            v-if="SearchFrom.radio.includes('P')"
          >
            <template #default="scope">
              {{ scope.row.details[index].pNotes }}
            </template>
          </el-table-column>
          <el-table-column
            prop="city"
            label="N"
            show-overflow-tooltip
            width="70"
            v-if="SearchFrom.radio.includes('N')"
          >
            <template #default="scope">
              {{ scope.row.details[index].nightPlanQty }}
            </template>
          </el-table-column>
          <el-table-column
            prop="state"
            label="人力"
            show-overflow-tooltip
            width="70"
            v-if="SearchFrom.radio.includes('N')"
          >
            <template #default="scope">
              {{ scope.row.details[index].nightPlanHuman }}
            </template>
          </el-table-column>
          <el-table-column
            prop="state"
            label="备注"
            show-overflow-tooltip
            width="70"
            v-if="SearchFrom.radio.includes('N')"
          >
            <template #default="scope">
              {{ scope.row.details[index].nightNotes }}
            </template>
          </el-table-column>
        </el-table-column>
      </el-table-column>
      <!-- <el-table-column label="操作" show-overflow-tooltip>
        <template #default="scope">
          <el-button type="primary" text @click="editData(scope)">{{
            $t('lang.common.details')
          }}</el-button>
        </template>
      </el-table-column> -->
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
  import { ElMessage } from 'element-plus'
  import SupplierEdit from './SupplierEdit.vue'
  import DateUtils from '@/utils/dateUtils.js'
  const { proxy } = getCurrentInstance() as any
  const $t = proxy.$t
  interface SearchI {
    lineCode?: string
    modelName?: string
    pageNo: number
    pageSize: number
    radio: string[]
    timeArrs: [string, string]
  }
  const SearchFrom = reactive<SearchI>({
    lineCode: '',
    modelName: '',
    pageNo: 1,
    pageSize: 10,
    radio: ['D', 'N'],
    timeArrs: [
      DateUtils.format(new Date(), 'yyyy-MM-dd'),
      DateUtils.format(
        new Date(new Date().getTime() + 3600 * 1000 * 24 * 7),
        'yyyy-MM-dd'
      )
    ]
  })

  const column = [
    {
      name: '线体标识',
      prop: 'lineCode'
    },
    {
      name: '生产工令',
      prop: 'moNumber'
    },
    {
      name: '机型标识',
      prop: 'modelName'
    },
    {
      name: '工单量',
      prop: 'finishQty'
    },
    {
      name: '工单欠结',
      prop: 'debt'
    }
  ]
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
  let lastCheck = $ref<string[]>(['N'])
  const checkBoxChange = (data: string[]) => {
    if (data.length == 0) {
      SearchFrom.radio = lastCheck
    }
    if (data.length == 1) {
      lastCheck = data
    }
  }
  const pageFunc = (data: any) => {
    SearchFrom.pageSize = data.pageSize
    SearchFrom.pageNo = data.pageNo
    searchData() // 触发获取数据函数
  }
  // 查询数据
  const searchData = () => {
    if (!SearchFrom.timeArrs) {
      ElMessage({
        message: '请选择时间范围!',
        type: 'error'
      })
      return false
    }
    const end = new Date(SearchFrom.timeArrs[1]).getTime()
    const start = new Date(SearchFrom.timeArrs[0]).getTime()
    if (end - start > 7 * 24 * 60 * 60 * 1000) {
      ElMessage({
        message: '时间范围不能大于7天!',
        type: 'error'
      })
      return false
    }
    datas.loading = true
    let params = {
      lineCode: SearchFrom.lineCode,
      modelName: SearchFrom.modelName,
      pageNo: SearchFrom.pageNo,
      pageSize: SearchFrom.pageSize,
      workEndDate: SearchFrom.timeArrs[1].replace(/-/g, ''),
      workStartDate: SearchFrom.timeArrs[0].replace(/-/g, '')
    }
    proxy.$api.productPlan.getProductionPage(params).then((res: any) => {
      datas.loading = false
      if (res.code == 200) {
        datas.data = res.data.records
        datas.total = res.data.total
      }
    })
  }
  let disabledDate = (time: Date) => {
    const times = new Date(
      new Date().getTime() + 3600 * 1000 * 24 * 7
    ).getTime()
    return time.getTime() > times
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
    SearchFrom.lineCode = ''
    SearchFrom.modelName = ''
    SearchFrom.pageNo = 1
    SearchFrom.pageSize = 10
    SearchFrom.radio = ['N']
    SearchFrom.timeArrs = [
      DateUtils.format(new Date(), 'yyyy-MM-dd'),
      DateUtils.format(
        new Date(new Date().getTime() + 3600 * 1000 * 24 * 7),
        'yyyy-MM-dd'
      )
    ]
    searchData()
  }
  // searchData()
</script>
<style lang="less" scoped>
  :deep(.el-col) {
    margin-right: 20px;
  }
  :deep(.el-table .cell) {
    white-space: nowrap;
  }
</style>
