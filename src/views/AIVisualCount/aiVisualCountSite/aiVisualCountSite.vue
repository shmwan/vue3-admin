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
                <el-col :span="3">
                    <el-button type="primary" :icon="Search" @click="searchData" :loading="datas.loading">{{
                        $t('lang.common.search') }}</el-button>
                    <el-button :icon="Refresh" @click="resetData">{{
                        $t('lang.common.reset')
                    }}</el-button>
                </el-col>
            </el-row>
        </el-form>
        <div class="btns">
            <el-button type="primary" @click="editData('', 1)">+ 添加站点</el-button>
            <el-button type="success" @click="goBigScreen()">AI视觉MES线体监控</el-button>
        </div>
        <el-table :data="datas.data" border stripe style="width: 100%; margin-top: 20px">
            <el-table-column prop="siteNumber" label="站点计数器编号" show-overflow-tooltip />
            <el-table-column prop="serialNumber" label="站点序号" show-overflow-tooltip />
            <el-table-column prop="lineCode" label="线体标识" show-overflow-tooltip />

            <el-table-column prop="deviceCode" label="摄像头设备编号" show-overflow-tooltip width="350">
                <template #default="scope">
                    <div style="display: flex;flex-direction: row;justify-content:space-between;">
                        <span>
                            {{ scope.row.deviceCode }}</span>
                        <el-button style="vertical-align: top; " type="primary" @click="openVideo(scope.row)"
                            text>预览</el-button>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="videoStreamAddress" label="实时视频流地址" show-overflow-tooltip width="200">
            </el-table-column>
            <el-table-column prop="apiUrl" label="拉流地址" show-overflow-tooltip width="200" />
            <el-table-column prop="angle" label="摄像旋转角度" show-overflow-tooltip width="120" />
            <el-table-column prop="remarks" label="备注" show-overflow-tooltip />
            <el-table-column prop="" label="操作" show-overflow-tooltip width="160">
                <template #default="scope">
                    <el-button type="primary" text @click="editData(scope.row, 1)">修改</el-button>
                    <el-button type="danger" text @click="DeleteBtn(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <TablePage :pageSize="SearchFrom.pageSize" :layout="layout" :pageTotal="datas.total" @pageFunc="pageFunc">
        </TablePage>
    </div>
    <aiVisualCountAdd v-if="datas.showEdit" @close="close" :isShow="datas.show" :editData="datas.editData"
        @success="searchData"></aiVisualCountAdd>

    <el-dialog v-model="datas.showVideo" width="50%" title="视频预览" draggable :before-close="handleClose"
        :close-on-click-modal="false">
        <div style="height: 500px">
            <video-Player v-if="datas.showVideo" class="items" :videoUrl="datas.videoUrl"></video-Player>
        </div>
    </el-dialog>
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
import { useRouter } from 'vue-router'
import aiVisualCountAdd from './aiVisualCountAdd.vue'
import videoPlayer from '/src/components/video-player/VideoPlayer.vue'
import { useCallback } from '@/hooks/useCallback'
import { useConfirm } from '@/hooks/useConfirm'
import useKeyEnter from "@/hooks/useKeyEnter.ts";
const { proxy } = getCurrentInstance() as any
const $t = proxy.$t
const router = useRouter()
const SearchFrom = reactive({
    siteNumber: '',
    lineCode: '',
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
    show: boolean
    showVideo: boolean
}
let datas: Datas = reactive({
    showEdit: false,
    loading: false,
    dataTime: [],
    data: [],
    editData: {},
    total: 0,
    show: false,
    showVideo: false
})


let layout: string = 'total,sizes, prev, pager, next, jumper, ->, slot' //分页组件会展示的功能项

const pageFunc = (data: any) => {
    SearchFrom.pageSize = data.pageSize
    SearchFrom.pageNo = data.pageNo
    searchData() // 触发获取数据函数
}
let otherwindow: any = null
const goBigScreen = (data: any) => {
    // router.push('/bigScreen')
    if (otherwindow && !otherwindow.closed) {
        otherwindow = window.open(`/bigScreen`, 'bigScreen')
    } else {
        otherwindow = window.open(`/bigScreen`, 'bigScreen')
    }
}
const openVideo = (data: any) => {
    if (data.deviceCode) {
        let params = {
            //  channelId: '91934d77-98bf-4c5a-8af0-00f499213e2c',
            channelId: data.deviceCode
        }
        proxy?.$api.matter.getVideoUrl(params).then((res: any) => {
            if (res.code == 200) {
                if (res.data[0] && res.data[0].address) {
                    datas.videoUrl = res.data[0].address
                    datas.showVideo = true
                } else {
                    datas.videoUrl = ''
                    ElMessage({
                        message: '无视频资源!',
                        type: 'error'
                    })
                }
            } else {
                datas.videoUrl = ''
                ElMessage({
                    message: '无视频资源!',
                    type: 'error'
                })
            }
        })
    }


}
const closeVideo = () => {
    datas.showVideo = false
}
// 查询数据
const searchData = () => {
    datas.loading = true
    let params = {
        ...SearchFrom
    }
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
const DeleteBtn = (data: any) => {
    let params = [data.id]
    useConfirm(deleteData, params, `即将执行删除操作，是否确认？`)
}
const deleteData = (params: any) => {
    proxy.$api.aiVisualCount.siteRemoves(params).then((res: any) => {
        datas.loading = false
        useCallback(res)
        searchData()
    })
}
const resetData = () => {
    SearchFrom.siteNumber = ''
    SearchFrom.lineCode = ''
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
searchData()

useKeyEnter(searchData);
</script>
<style lang="less" scoped></style>
