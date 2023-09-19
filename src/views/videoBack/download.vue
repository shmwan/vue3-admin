<template>
    <div class="page-management deliver-order">
        <div class="search-form">
            <el-form inline :model="searchForm" ref="searchFormRef">
                <el-form-item prop="mhvNo">
                    <el-input v-model="searchForm.mhvNo" placeholder="文件名称" @keyup.enter="onSearch"></el-input>
                </el-form-item>
                <el-form-item prop="updateTime">
                    <el-date-picker v-model="searchForm.updateTime" type="daterange" start-placeholder="开始时间"
                        end-placeholder="结束时间" value-format="YYYY-MM-DD" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSearch" :icon="Search">
                        查询
                    </el-button>
                    <el-button @click="onReset" :icon="Refresh">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="search-table">
            <el-table :data="data" border>
                <el-table-column type="index" width="50" />
                <el-table-column prop="mhvNo" label="文件名称">
                    <template #header>
                        <el-tooltip class="box-item" effect="dark" content="文件名规则：[物料编号]-[产线or供应商代码]-[视频开始日期]-[随机序列].mp4"
                            placement="top-start">
                            <div class="tableIcon">
                                <span>文件名称</span>
                                <img src="@/assets/matter/msg.png" />
                            </div>
                        </el-tooltip>

                    </template>
                    <template #default="scope">
                        <span>{{ scope.row.mhvNo }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="createTime" label="创建时间"> </el-table-column>
                <el-table-column prop="createUserName" label="创建人" show-overflow-tooltip>
                </el-table-column>
                <el-table-column label="视频文件状态">
                    <template #default="scope">
                        <span style="color:#3300ff" v-if="scope.row.status == 1">{{ scope.row.statusStr
                        }}</span>
                        <span style="color:#66cc00" v-if="scope.row.status == 2">{{ scope.row.statusStr
                        }}</span>
                        <span style="color:#ff0033" v-if="scope.row.status == 3">{{ scope.row.statusStr
                        }} <span style="margin-left: 10px;"><el-button type="text"
                                    @click="errorMsg(scope.row)">查看</el-button></span></span>
                        <span v-if="scope.row.status == 0">{{ scope.row.statusStr }}</span>
                        <!-- failureReason -->
                    </template>
                </el-table-column>
                <el-table-column prop="fileSize" label="视频文件大小">
                    <template #default="scope">
                        <span>{{ bytesToSize(scope.row.fileSize) }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="视频下载状态">
                    <template #default="scope">
                        <span style="color:#3300ff" v-if="scope.row.downloadStatus == 1">{{ scope.row.downloadStatusStr
                        }}</span>
                        <span style="color:#66cc00" v-if="scope.row.downloadStatus == 2">{{ scope.row.downloadStatusStr
                        }}</span>
                        <span style="color:#ff0033" v-if="scope.row.downloadStatus == 3">{{ scope.row.downloadStatusStr
                        }}</span>
                        <span v-if="scope.row.downloadStatus == 0">{{ scope.row.downloadStatusStr }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="updateTime" label="更新时间"> </el-table-column>
                <!-- <el-table-column label="视频下载进度">
                    <template #default="scope">
                        <span :id="'span' + `${scope.row.id}`">正在下载 {{ scope.row.speed }}kb/s</span>
                    </template>
                </el-table-column> -->
                <el-table-column fixed="right" label="操作" width="150">
                    <template #default="scope">
                        <span v-if="scope.row.progress">下载中...<el-progress :text-inside="true" :stroke-width="22"
                                :percentage="scope.row.progress" status="success" /></span>
                        <el-button v-else-if="scope.row.status == 2 && scope.row.downloadStatus != 3"
                            @click="exportLoad(scope.row)" type="text"
                            :disabled="scope.row.status == 1 || scope.row.downloadStatus == 1">下载 </el-button>
                        <el-button v-if="scope.row.status == 2 && scope.row.downloadStatus == 3"
                            @click="downloadAgin(scope.row)" type="text">重新下载</el-button>
                        <el-button v-if="scope.row.status == 3" @click="onRemerge(scope.row)" type="text">重新拼接视频</el-button>
                        <!-- <el-button v-if="scope.row.downloadStatus == 2" @click="openVideo(scope.row)"
                            type="text">查看视频</el-button> -->
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <table-page :pageSize="pagination.pageSize" :pageTotal="pagination.total" @pageFunc="handleTableChange">
        </table-page>
        <el-dialog v-model="dialogVideo" title="查看视频" width="40%">
            <video class="video" style="width:650px;height: 500px;" :autoplay="true" :loop="true" muted :src="videoUrl"
                type="video/mp4"></video>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVideo = false">关 闭</el-button>
                </span>
            </template>
        </el-dialog>

    </div>
</template>
  
<script setup lang="ts">
import useKeyEnter from "@/hooks/useKeyEnter.ts";
import { useProgress } from '@/stores/file';
import { Search, Refresh } from '@element-plus/icons-vue'
import TablePage from '@/components/common/ElementPage.vue'
import { exportMp4 } from "@/utils/exportDown.js";
import { ElMessage, ElMessageBox } from 'element-plus'
import { computed } from 'vue';
const store = useProgress();

let progressList = computed(() => store.GET_PROGRESS);
const { proxy } = getCurrentInstance()
let dialogVideo = $ref(false)
let searchForm = $ref({
    updateTime: [],
    mhvNo: '',
    startTime: '',
    endTime: ''
})
let pagination = $ref({
    pageNo: 1,
    pageSize: 10,
    total: 0
})
let searchFormRef = $ref(null)
let data = $ref([])
// 视频合成失败原因
const errorMsg = (data: any) => {
    ElMessageBox.alert(data.failureReason ? data.failureReason : '暂无', '失败原因', {
        confirmButtonText: '关闭',
    })
}
let getTableList = () => {
    let { updateTime, ...reset } = searchForm
    console.log("🚀 ~ file: download.vue:141 ~ getTableList ~ searchForm:", searchForm)
    let params
    if (searchForm.updateTime) {
        params = {
            ...reset,
            startTime: searchForm.updateTime[0],
            endTime: searchForm.updateTime[1],
            pageNo: pagination.pageNo,
            pageSize: pagination.pageSize
        }
    } else {
        params = {
            ...reset,
            startTime: "",
            endTime: "",
            pageNo: pagination.pageNo,
            pageSize: pagination.pageSize
        }
    }

    proxy.$api.materialDownload.getHistoryList(params).then((res: any) => {
        data = res.data.records
        pagination.total = res.data.total
    })
}
useKeyEnter(getTableList);

watch(() =>
    progressList.value,
    (val) => {
        console.log(val)
        val.forEach((element: any) => {
            data.forEach((item: any) => {
                if (item.id == element.id) {
                    item.progress = element.progress
                    if (element.progress == 100) {
                        delete item.progress
                    }

                }
            })
        });

    }, { immediate: true, deep: true })
let onSearch = () => {
    getTableList()
}
let onReset = () => {
    searchFormRef.resetFields()
    getTableList()
}
let handleTableChange = ({ pageNo, pageSize }) => {
    pagination.pageNo = pageNo
    pagination.pageSize = pageSize
    onSearch()
}
onMounted(() => {
    onSearch()
})
let videoUrl = $ref('')
// 查看视频
let openVideo = (row: any) => {
    dialogVideo = true;
    videoUrl = row.videoUrl;
}
// 重新下载
let downloadAgin = (val: any) => {
    if (val.fileSize > 0) {
        exportMp4(
            "/api/mgt/matter-history-video/download/" + val.id,
            null,
            val.mhvNo,
            val.id,
            val.fileSize
        );
    }
}
const exportLoad = (val: any) => {
    if (val.fileSize > 0) {
        exportMp4(
            "/api/mgt/matter-history-video/download/" + val.id,
            null,
            val.mhvNo,
            val.id,
            val.fileSize
        );
    }
}
const onRemerge = (row: any) => {
    proxy.$api.materialDownload.remergeVideo(row.id).then((res: any) => {
        if (res.code == 200) {
            ElMessage({
                message: res.message + '!',
                type: 'success'
            })
        } else {
            ElMessage({
                message: res.message + '!',
                type: 'error'
            })
        }
    })
};
function bytesToSize(bytes: any) {
    if (bytes === 0) return '0 B';
    let k = 1024;
    let sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    let i = Math.floor(Math.log(bytes) / Math.log(k));
    return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
}
</script>
<style lang="less" scoped>
.tableIcon {
    display: flex;
    align-items: center;

    img {
        margin-left: 5px;
        width: 16px;
        height: 16px;
    }
}
</style>
  