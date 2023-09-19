<template>
    <div class="tableBox">
        <el-dialog custom-class="notice-dialog" v-model="dialogVisible" draggable :before-close="close">
            <img class="headerImg" src="/src/assets/img/AIBig/talbleHeader.png" alt="">
            <div class="tableCon">
                <div class="tableHeader">
                    <div class=" headerIndex"> 产品机型标识/产品品号</div>
                    <div class="headertitle "> UPH</div>
                    <div class="headertitle"> 计划产量</div>
                    <div class="headertitle"> 当前产量</div>
                    <div class="headertitle"> 完成率</div>
                    <div class="headertitle"> 状态</div>
                    <div class="headertitle"> 操作</div>
                </div>
                <div class="tableBody">
                    <div class="tr" v-for="(item, index) in  datas.tableData" :key="index">
                        <div class=" propIndex"> {{ item.modelCode }}/{{ item.partNo }}</div>
                        <div class="propVale"> {{ item.uph }}</div>
                        <div class="propVale"> {{ item.planQty }}</div>
                        <div class="propVale"> {{ item.currentQty }}</div>
                        <div class="propVale"> {{ item.finishRate }}</div>
                        <div class="propVale">
                            <span v-if="item.status == '0'">待生产</span>
                            <span v-if="item.status == '1'">正在生产</span>
                        </div>
                        <div class="propVale">
                            <span class="button" v-if="item.status == '0'" :class="item.status == '1' ? 'active' : ''"
                                @click="startPro(item)">开始生产</span>
                            <span class="button" v-if="item.status == '1'"
                                :class="item.status == '1' ? 'active' : ''">正在生产</span>
                        </div>
                    </div>
                </div>
                <!-- <div class="btn" v-if="listEmp.length > 0">
                <el-button type="primary" @click="changeLine">转线</el-button>
            </div>
            <div class="noData" v-if="listEmp.length == 0">
                <i class="el-icon-loading" style="font-size:20px;color:#fff"></i>
                <span class="span">查询中...</span>
            </div> -->
            </div>
        </el-dialog>
    </div>
</template>
<script lang="ts" setup>
import { ref, reactive, nextTick, getCurrentInstance } from 'vue'
import { ElMessageBox } from "element-plus";
interface Props {
    lineObj: any
}
const { proxy } = getCurrentInstance() as any
const emit = defineEmits(['close'])
const $t = proxy.$t
// const props = defineProps<Props>()
const { lineObj } = defineProps<Props>()
let obj = { ...lineObj }
// const lineCode = props.lineObj.lineCode
const SearchFrom = reactive({
    lineCode: obj.lineCode,
})
interface Datas {
    loading: Boolean
    tableData: any
    lineBaseData: any
}
let datas: Datas = reactive({
    loading: false,
    tableData: [],
    lineBaseData: {}
})
interface Props {
    lineObj: any
}

const dialogVisible = ref(true)
const close = () => {
    emit('close')
}
onMounted(() => {
    // searchLineBase()
    searchPlanData()

})
const searchLineBase = () => {
    datas.loading = true
    let params = {
        lineCode: obj.lineCode
    }
    proxy.$api.bigScreen.getLineData(params).then((res: any) => {
        datas.loading = false
        if (res.code == 200) {
            datas.lineBaseData = res.data

        } else {
            ElMessage({
                message: res.message + '!',
                type: 'error'
            })
        }
    })
}
const searchPlanData = () => {
    datas.loading = true
    let params = {
        lineCode: obj.lineCode
    }
    proxy.$api.bigScreen.productPlan(params).then((res: any) => {
        datas.loading = false
        if (res.code == 200) {
            datas.tableData = res.data
        } else {
            ElMessage({
                message: res.message + '!',
                type: 'error'
            })
        }
    })
}

const chanProduct = (data: any) => {
    datas.loading = true
    let params = {
        lineCode: data.lineCode,
        modelCode: data.modelCode,
        partNo: data.partNo,
    }
    proxy.$api.bigScreen.productChange(params).then((res: any) => {
        datas.loading = false
        if (res.code == 200) {
            searchPlanData()
        } else {
            ElMessage({
                message: res.message + '!',
                type: 'error'
            })
        }
    })
}
const startPro = (val: any) => {
    let tips = `即将执行产线 ${val.lineCode} - [${val.modelCode}]产品切换操作，是否确认？`;
    ElMessageBox.confirm(
        // customClass: 'myMessageBox',
        tips,
        '提示',

        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            customClass: 'myMessageBox',
        }
    ).then(() => {
        chanProduct(val)
    })
        .catch(() => {

        });
}
</script>
  
<style lang="less" >
.notice-dialog.el-dialog.is-draggable {
    /*  */
    background: #102abf !important;
    border: 1px solid #00F6FF;
    border-radius: 10px !important;
    box-shadow: 0px 0px 50px 0px rgb(0, 246, 255) inset;
    // background: url('/src/assets/img/AIBig/dialogImg.png') no-repeat center center !important;
    min-height: 380px !important;
    width: 950px !important;
    background-size: 100% 100% !important;
    position: relative;

    .headerImg {
        position: absolute;
        width: 355px;
        height: 99px;
        left: 50%;
        top: 10%;
        transform: translateX(-50%);
    }

    .tableCon {
        /* display: flex; */
        height: calc(100% - 100px);
        // margin-top: 30px;
        padding: 40px;

        .tableHeader {
            display: flex;

            .headertitle {
                width: 95px;
                height: 33px;
                // background: rgba(0, 192, 255, 0.7);
                box-shadow: 0px 0px 50px 0px rgba(0, 192, 255, 0.7) inset;
                color: #fff;
                margin-right: 10px;
                text-align: center;
                line-height: 33px;

            }

            .headerIndex {
                width: 210px;
                height: 33px;
                // background: rgba(0, 192, 255, 0.7);
                box-shadow: 0px 0px 40px 0px rgba(0, 192, 255, 0.7) inset;
                color: #fff;
                margin-right: 10px;
                text-align: center;
                line-height: 33px;
            }
        }

        .tableBody {
            height: 270px;
            overflow: auto;
            padding-bottom: 10px;

            .tr {
                display: flex;
                margin-top: 10px;
                box-sizing: border-box;

                .propVale {

                    width: 95px;
                    height: 33px;
                    color: #fff;
                    background: rgba(0, 142, 255, 0.2);
                    // box-shadow: 0px 0px 40px 0px rgba(0, 192, 255, 0.1) inset;
                    margin-right: 10px;
                    text-align: center;
                    line-height: 33px;

                    .button {
                        color: #FFEB43;
                        vertical-align: bottom;
                    }

                    .active {
                        color: #00F6FF;
                    }

                }

                .propIndex {

                    width: 210px;
                    height: 33px;
                    color: #fff;
                    background: rgba(0, 142, 255, 0.2);
                    // box-shadow: 0px 0px 40px 0px rgba(0, 192, 255, 0.1) inset;
                    margin-right: 10px;
                    text-align: center;
                    line-height: 33px;
                }
            }
        }

        .btn {
            display: flex;
            justify-content: center;
            margin-top: 10px;

            .el-button {
                width: 128px;
                background: #337df9;
                border-radius: 4px;
            }
        }

    }

    .tableBox {
        width: 50%;
        overflow: auto;
    }

    .noData {
        width: 100%;
        height: 200px;
        text-align: center;

        span {
            line-height: 200px;
            color: #fff;
        }
    }

    *::-webkit-scrollbar-thumb {
        width: 5px;
        background: #010d61;
    }

    *::-webkit-scrollbar {
        width: 0px;
    }




}
</style>
<style  lang="less">
.myMessageBox.el-message-box {
    background: url('/src/assets/img/AIBig/sureImg.png') no-repeat center center;
    color: #fff;

    .el-message-box__title {
        color: #00F6FF
    }

    .el-message-box__message {
        color: #fff;
    }

    .el-message-box__btns {
        .el-button {
            background: rgba(33, 230, 237, 0.21);
            border: 1px solid #21E6ED;
            border-radius: 4px;
            color: #fff
        }

        .el-button.el-button--primary {
            background: #21E6ED;
            color: #282F2F
        }
    }
}
</style>
