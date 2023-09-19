<template>
    <el-dialog v-model="dialogVisible" :title="datas.title" width="30%" draggable :before-close="handleCancel"  :close-on-click-modal="false">

        <el-form :model="datas.submitForm" label-width="140px">
            <el-col :span="20">
                <el-form-item :label="$t('lang.baseData.GYName')">
                    <el-input v-model="datas.submitForm.supplierName" :placeholder="$t('lang.baseData.plzGYname')" />
                </el-form-item>
            </el-col>
            <el-col :span="20">
                <el-form-item :label="$t('lang.baseData.GYCode')">
                    <el-input v-model="datas.submitForm.supplierCode" :placeholder="$t('lang.baseData.plzGYcode')" />
                </el-form-item>
            </el-col>

        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="handleCancel">{{ $t("lang.common.cancel") }}</el-button>
                <el-button type="primary" @click="SaveInfo" :loading="datas.loading">
                    {{ $t("lang.common.comfirm") }}
                </el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script lang="ts" setup>
import { ref, reactive, nextTick, getCurrentInstance } from "vue";
import { ElMessage } from 'element-plus'
const { proxy } = getCurrentInstance() as any;
const $t = proxy.$t;
interface SubmitForm {
    id: Number | null,
    supplierName: String;
    supplierCode: String;
}
interface Datas {
    title: String;
    submitForm: SubmitForm;
    loading: Boolean
}
interface Props {
    editData: SubmitForm
}
const { editData } = defineProps<Props>();
let data = { ...editData };
const emit = defineEmits(["success", "close"]);

let datas: Datas = reactive({
    title: $t("lang.baseData.AddGY"),
    submitForm: {
        id: null,
        supplierName: "",
        supplierCode: "",
    },
    loading: false,
});
if (data.id) {
    nextTick(() => {
        datas.title = $t("lang.baseData.InfoGY");
        datas.submitForm.id = data.id;
        datas.submitForm.supplierName = data.supplierName;
        datas.submitForm.supplierCode = data.supplierCode;

    })
}
const dialogVisible = ref(true);
const handleCancel = () => {
    emit("close");
};

const SaveInfo = () => {
    datas.loading = true;
    let params = {
        ...datas.submitForm,
    };
    if (!data.id) {
        proxy.$api.SupplierInfo.AddSupplier(params).then((res: any) => {
            datas.loading = false;
            if (res.code == 200) {
                emit("close");
                ElMessage({
                    message: $t("lang.common.AddSuc")+"!",
                    type: 'success',
                })
                
                emit("success");

            } else {
                ElMessage({
                    message: res.message+"!",
                    type: 'error',
                })
            }
        });
    } else {
        proxy.$api.SupplierInfo.UpdateInfo(params).then((res: any) => {
            datas.loading = false;
            if (res.code == 200) {
                emit("close");
                ElMessage({
                    message:$t("lang.common.EditSuc")+"!",
                    type: 'success',
                })
                emit("success");

            } else {
                ElMessage({
                    message: res.message+"!",
                    type: 'error',
                })
            }
        });
    }

}
</script>

<style scoped lang="less"></style>
