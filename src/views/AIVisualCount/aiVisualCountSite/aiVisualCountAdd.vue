<template>
    <div>
        <el-dialog v-model="dialogVisible" :title="datas.Tips" width="35%" draggable :before-close="handleClose"
            :close-on-click-modal="false">
            <el-form :model="datas.submitForm" label-width="180px" :rules="rules" ref="ruleFormRef">
                <el-col :span="20">
                    <el-form-item label="站点计数器编码" prop="siteNumber">
                        <el-input v-model="datas.submitForm.siteNumber" maxlength="30" clearable :disabled="show"
                            placeholder="请输入站点计数器编码" />
                    </el-form-item>
                </el-col>
                <el-col :span="20">
                    <el-form-item label="站点序号" prop="serialNumber">
                        <el-input v-model="datas.submitForm.serialNumber" clearable :disabled="show"
                            placeholder="请输入1-10 内的正整数" />
                    </el-form-item>
                </el-col>
                <el-col :span="20">
                    <el-form-item label="线体标识" prop="lineCode">
                        <el-input v-model="datas.submitForm.lineCode" maxlength="30" clearable :disabled="show"
                            placeholder="仅支持：字母、数字、英文'-'、英文'_'" />
                    </el-form-item>
                </el-col>
                <el-col :span="20">
                    <el-form-item label="摄像头设备编号" prop="deviceCode">
                        <el-input v-model="datas.submitForm.deviceCode" maxlength="120" clearable :disabled="show"
                            placeholder="请输入摄像头设备编号" />
                    </el-form-item>
                </el-col>
                <el-col :span="20">
                    <el-form-item label="实时视频流地址" prop="videoStreamAddress">
                        <el-input v-model="datas.submitForm.videoStreamAddress" clearable :disabled="show"
                            placeholder="视频地址格式为 *** :// ***" />
                    </el-form-item>
                </el-col>
                <el-col :span="20">
                    <el-form-item label="拉流地址" prop="apiUrl">
                        <el-input v-model="datas.submitForm.apiUrl" clearable :disabled="show"
                            placeholder="地址格式为 *** :// ***" />
                    </el-form-item>
                </el-col>
                <el-col :span="20">
                    <el-form-item label="摄像旋转角度" prop="angle">
                        <!-- <el-input style="width: 100%;" :controls="false" v-model="datas.submitForm.angle" :max="360"
                            :controls-position="right" placeholder="请输入0-360之间的旋转角度" clearable /> -->
                        <el-input v-model="datas.submitForm.angle" type="number" @blur="checkAngle()" clearable
                            :disabled="show" placeholder="请输入0-360旋转角度" />
                    </el-form-item>
                </el-col>
                <el-col :span="20">
                    <el-form-item label="备注" prop="remarks">
                        <el-input type="textarea" maxlength="255" autosize v-model="datas.submitForm.remarks" clearable
                            :disabled="show" placeholder="请输入备注" />
                    </el-form-item>
                </el-col>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="handleClose">{{
                        $t('lang.common.cancel')
                    }}</el-button>
                    <el-button type="primary" @click="SaveInfo(ruleFormRef)" :loading="datas.loading">
                        {{ $t('lang.common.comfirm') }}
                    </el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, getCurrentInstance } from 'vue'
import { ElMessageBox, FormRules, FormInstance } from 'element-plus'
import { useDictData } from '@/hooks/dictMinxin'
import { useCallback } from '@/hooks/useCallback'
import { useConfirmNew } from '@/hooks/useConfirm'
import { number } from 'echarts'
const { proxy } = getCurrentInstance() as any
const $t = proxy.$t
const dialogVisible = ref(true)
const emit = defineEmits(['success', 'close'])
let datas = reactive({
    Tips: '添加站点',
    submitForm: {
        serialNumber: null,
        deviceCode: '',
        lineCode: '',
        videoStreamAddress: '',
        siteNumber: '',
        apiUrl: '',
        angle: '',
        remarks: ''
    },
    options: [
        {
            value: '1',
            label: '爱的速递'
        }
    ],
    loading: false
})
interface Props {
    editData: any
    isShow: boolean
}
const { editData, isShow } = defineProps<Props>()
let data = { ...editData }
let show = isShow
const validatePass = (rule: any, value: any, callback: any) => {
    const reg = /^(?!.*--)(?![_-])(?!.*-$)(?!.*_$)[a-zA-Z0-9_-]+$/
    if (value === '') {
        callback(new Error('请输入线体标识'))
    } else {
        if (!reg.test(value)) {
            callback(new Error("仅支持：字母、数字、英文'-'、英文'_'"))
        } else {
            callback()
        }
    }
}
const checkNumber = (rule: any, value: any, callback: any) => {

    var reg = new RegExp("^([1-9]|[1-9]\\d|100)$");

    if (!reg.test(value)) {
        callback(new Error("请输入1-100的站点序号"))
    } else {
        callback()
    }

}

const checkAngle = (rule: any, value: any, callback: any) => {

    var reg = new RegExp("^([1-9]|([1-9][0-9])|([1-2][0-9][0-9])|([3][0-5][0-9])|([0]{1}))$|^[3][6][0]$");
    if (value) {
        if (!reg.test(value)) {
            callback(new Error("请输入1-360内的数字"))
        } else {
            callback()
        }
    } else {
        callback()
    }

}

const videoAddressPass = (rule: any, value: any, callback: any) => {
    const reg = /^([A-Za-z]{1,10}:\/\/)[^\s]/

    // const reg = /^((https?|ftp|file):\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/
    if (value === '') {
        callback(new Error('请输入实时视频流地址'))
    } else {
        if (!reg.test(value)) {
            callback(new Error("请输入正确的流地址"))
        } else {
            callback()
        }
    }
}
const ruleFormRef = ref<FormInstance>()
const rules = reactive<FormRules>({

    //     siteNumber: '',
    serialNumber: [
        { required: true, validator: checkNumber, trigger: 'blur' },
    ],
    deviceCode: [
        {
            required: true,
            message: '请输入摄像头设备编号',
            trigger: 'blur'
        }
    ],
    lineCode: [
        {
            required: true,
            validator: validatePass,
            trigger: 'blur'
        }
    ],
    videoStreamAddress: [
        {
            required: true,
            validator: videoAddressPass,
            // message: '请输入实时视频流地址',
            trigger: 'blur'
        }
    ],
    siteNumber: [
        {
            required: true,
            message: '请输入站点计数器编号',
            trigger: 'blur'
        }
    ],
    angle: [
        {
            required: false,
            validator: checkAngle,
            trigger: 'blur'
        }
    ]

})
if (data.id) {
    nextTick(() => {
        datas.Tips = '站点详情'
        //   datas.submitForm = data
        let params = {
            id: data.id
        }
        getDetail(params)
    })
}
const handleClose = () => {
    emit('close')
}
const SaveInfo = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate(valid => {
        if (!valid) { return }
        else {
            datas.loading = true
            let params = {
                ...datas.submitForm
            }
            if (!data.id) {
                useConfirmNew(AddInfo, params, $t('lang.common.plzSubmit') + '!')
            } else {
                useConfirmNew(EditInfo, params, $t('lang.common.plzSubmit') + '!')
            }
        }
    })
}
const AddInfo = (params: any, flag: any) => {
    if (flag) {
        proxy.$api.aiVisualCount.addSite(params).then((res: any) => {
            datas.loading = false
            const data = useCallback(res, $t('lang.common.AddSuc') + '!')
            if (data) search()
        })
    } else {
        datas.loading = false
    }

}
const EditInfo = (params: any, flag: any) => {
    if (flag) {
        proxy.$api.aiVisualCount.addUpdate(params).then((res: any) => {
            datas.loading = false
            const data = useCallback(res, $t('lang.common.EditSuc') + '!')
            if (data) search()
        })
    } else {
        datas.loading = false
    }

}
const getDetail = (params: any) => {
    proxy.$api.aiVisualCount.siteInfo(params).then((res: any) => {
        if (res.code == 200) {
            datas.submitForm = res.data
        }
    })
}
const search = () => {
    emit('close')
    emit('success')
}
</script>

<style scoped lang="less">
:deep(.el-select) {
    width: 100%;
}
</style>
