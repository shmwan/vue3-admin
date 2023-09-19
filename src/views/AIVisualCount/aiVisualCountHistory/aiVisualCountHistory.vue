<template>
    <div>
        <el-form :model="SearchFrom">
            <el-row :span="20">
                <el-col :span="4" style="margin-right: 20px">
                    <el-form-item label="">
                        <el-input v-model="SearchFrom.siteNumber" placeholder="请输入站点计数器编号" clearable />
                    </el-form-item>
                </el-col>
                <el-col :span="4" style="margin-right: 20px">
                    <el-form-item label="">
                        <el-input v-model="SearchFrom.lineCode" placeholder="请输入线体标识" clearable />
                    </el-form-item>
                </el-col>
                <el-col :span="7" style="margin-right: 20px">
                    <el-form-item label=" " required>
                        <el-date-picker v-model="SearchFrom.timeArrs" type="daterange" value-format="YYYYMMDD"
                            format="YYYY-MM-DD" range-separator="-" :start-placeholder="$t('lang.InventLog.StartTime')"
                            :end-placeholder="$t('lang.InventLog.EndTime')" />
                    </el-form-item>

                </el-col>
                <el-col :span="3">
                    <el-button type="primary" :icon="Search" @click="searchData" :loading="datas.loading">{{
                        $t('lang.common.search') }}</el-button>
                    <el-button :icon="Refresh" @click="resetData">{{
                        $t('lang.common.reset')
                    }}</el-button>
                </el-col>
            </el-row>
        </el-form>
        <el-table :data="datas.data" border stripe style="width: 100%; margin-top: 20px">
            <el-table-column prop="siteNumber" label="站点计数器编号" show-overflow-tooltip />
            <el-table-column prop="serialNumber" label="站点序号" show-overflow-tooltip />
            <el-table-column prop="lineCode" label="线体标识" show-overflow-tooltip />

            <el-table-column prop="number" label="数量" show-overflow-tooltip />
            <el-table-column prop="startHistoryTime" label="计数起始时间" show-overflow-tooltip />
            <el-table-column prop="endHistoryTime" label="计数截止时间" show-overflow-tooltip />
            <el-table-column prop="updateHistoryTime" label="更新时间" show-overflow-tooltip />
        </el-table>
        <TablePage :pageSize="SearchFrom.pageSize" :layout="layout" :pageTotal="datas.total" @pageFunc="pageFunc">
        </TablePage>
    </div>
    <!-- <InventoryLogEdit v-if="datas.showEdit" @close="close" :editData="datas.editData" @success="searchData">
    </InventoryLogEdit> -->
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
import DateUtils from '@/utils/dateUtils.js'
import useKeyEnter from "@/hooks/useKeyEnter.ts";
// import InventoryLogEdit from './InventoryLogEdit.vue'
const { proxy } = getCurrentInstance() as any
const $t = proxy.$t
const SearchFrom = reactive({
    siteNumber: '',
    lineCode: "",
    startTime: '',
    endTime: '',
    timeArrs: [DateUtils.format(
        new Date(new Date().getTime() - 3600 * 1000 * 24 * 30),
        'yyyyMMdd'
    ),
    DateUtils.format(new Date(), 'yyyyMMdd')],
    pageNo: 1,
    pageSize: 10
})
interface Datas {
    showEdit: Boolean
    loading: Boolean
    data: Object[]
    editData: any
    total: number
    dataTime: any
}
let datas: Datas = reactive({
    showEdit: false,
    loading: false,
    dataTime: [],
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

    // console.log(datas.dataTime)
    // if (datas.dataTime && datas.dataTime.length > 1) {
    //     SearchFrom.startTime = datas.dataTime[0] + "00:00:00"
    //     SearchFrom.endTime = datas.dataTime[1] + '23:59:59'
    // } else {
    //     SearchFrom.startTime = ''
    //     SearchFrom.endTime = ''
    //     ElMessage({
    //         message: "请输入起止时间",
    //         type: 'error'
    //     })
    //     return
    // }
    // datas.loading = true
    // let params = {
    //     ...SearchFrom
    // }

    datas.loading = true
    let params = {
        ...SearchFrom
    }
    console.log("21", params.timeArrs)
    if (!params.timeArrs) {
        ElMessage({
            type: 'error',
            message: '请填入查询起止时间'
        })
        datas.loading = false
        return false
    }
    params.startTime = params.timeArrs[0]
    params.endTime = params.timeArrs[1]
    proxy.$api.aiVisualCount.getList(params).then((res: any) => {
        datas.loading = false
        if (res.code == 200) {
            datas.data = res.data.records
            datas.total = res.data.total
        } else {
            ElMessage({
                message: res.message + '!',
                type: 'error'
            })
        }
    })
}
const resetData = () => {
    SearchFrom.siteNumber = ''
    SearchFrom.lineCode = ''
    SearchFrom.startTime = ''
    SearchFrom.endTime = ''
    SearchFrom.timeArrs = [DateUtils.format(
        new Date(new Date().getTime() - 3600 * 1000 * 24 * 30),
        'yyyyMMdd'
    ),
    DateUtils.format(new Date(), 'yyyyMMdd')]
    SearchFrom.pageNo = 1
    SearchFrom.pageSize = 10
    searchData()
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
//searchData()
useKeyEnter(searchData);
</script>
<style lang="less" scoped></style>
  