<template>
  <el-dialog
    v-model="dialogVisible"
    :title="datas.title"
    width="30%"
    draggable
    :close-on-click-modal="false"
    :before-close="handleCancel"
  >
    <el-form 
    :model="datas.submitForm" 
    :rules="rules"
    ref="ruleFormRef"
    label-width="140px">
      <el-col :span="20">
        <el-form-item  :label="$t('lang.diction.groupCode')+':'" prop="groupCode">
          <el-input
            v-model="datas.submitForm.groupCode"
            :placeholder="$t('lang.diction.groupCodePlz')"
          />
        </el-form-item>
      </el-col>
      <el-col :span="20">
        <el-form-item :label="$t('lang.diction.groupName')+':'" prop="groupName">
          <el-input
            v-model="datas.submitForm.groupName"
            :placeholder="$t('lang.diction.groupCodePlz')"
          />
        </el-form-item>
      </el-col>
      <el-col :span="20">
        <el-form-item :label="$t('lang.diction.dictionCode')+':'" prop="dictionCode">
          <el-input
            v-model="datas.submitForm.dictionCode"
            :placeholder="$t('lang.diction.dictionCodePlz')"
          />
        </el-form-item>
      </el-col>
      <el-col :span="20">
        <el-form-item :label="$t('lang.diction.dictionName')+':'" prop="dictionName">
          <el-input
            v-model="datas.submitForm.dictionName"
            :placeholder="$t('lang.diction.dictionNamePlz')"
          />
        </el-form-item>
      </el-col>
      <el-col :span="20">
        <el-form-item :label="$t('lang.diction.remark')+':'" prop="remark">
          <el-input
            type="textarea"
            v-model="datas.submitForm.remark"
            :placeholder="$t('lang.diction.remarkPlz')"
            :autosize="{ maxRows: 5}"
            resize="none"
            maxlength="255"
          />
        </el-form-item>
      </el-col>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleCancel">{{$t('lang.common.cancel')}}</el-button>
        <el-button type="primary" @click="SaveInfo(ruleFormRef)" :loading="datas.loading">
          {{$t('lang.common.comfirm')}}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, reactive, nextTick, getCurrentInstance } from "vue";
import { ElMessage ,ElMessageBox, FormInstance, FormRules} from "element-plus";
import {useCallback} from "@/hooks/useCallback"
const { proxy } = getCurrentInstance() as any;
const $t = proxy.$t;
interface SubmitForm {
  id?: Number | null;
  dictionCode: string;
  dictionName: string;
  groupCode: string;
  groupName: string;
  remark:string;
}
interface Datas {
  title: String;
  submitForm: SubmitForm;
  loading: Boolean;
}
interface Props {
  editData: SubmitForm;
}
const { editData } = defineProps<Props>();
let data = { ...editData };
const emit = defineEmits(["success", "close"]);

let datas: Datas = reactive({
  title: $t('lang.diction.addTits'),
  submitForm: {
    dictionCode: "",
    dictionName: "",
    groupCode: "",
    groupName: "",
    remark:"",
  },
  loading: false,
});
// 定义校验规则
const ruleFormRef = ref<FormInstance>()
const rules = reactive<FormRules>({
      groupCode: [
        { required: true, message: $t('lang.diction.groupCodePlz'), trigger: "blur" },
      ],
      groupName: [
        { required: true, message: $t('lang.diction.groupNamePlz'), trigger: "blur" },
      ],
      dictionName: [
        { required: true, message: $t('lang.diction.dictionNamePlz'), trigger: "blur" },
      ],
      dictionCode: [
        { required: true, message: $t('lang.diction.dictionCodePlz'), trigger: "blur" },
      ],
})
if (data.id) {
    datas.title = $t('lang.diction.detailTits');
    datas.submitForm.id = data.id;
    datas.submitForm.dictionCode = data.dictionCode;
    datas.submitForm.dictionName = data.dictionName;
    datas.submitForm.groupCode = data.groupCode;
    datas.submitForm.groupName = data.groupName;
    datas.submitForm.remark = data.remark;
}
const dialogVisible = ref(true);
const handleCancel = () => {
  emit("close");
};
const save=(params:any)=>{
    datas.loading = true;
  if (!data.id) {
      proxy.$api.dict.add(params).then((res: any) => {
      datas.loading = false;
      const data = useCallback(res,$t('lang.common.AddSuc'));
      if(data) search();
    });
  } else {
    proxy.$api.dict.update(params).then((res: any) => {
      datas.loading = false;
      const data = useCallback(res,$t('lang.common.EditSuc'));
      if(data) search();
    });
  }
}
const search =()=>{
  emit("close");
  emit("success");
}
const SaveInfo = async(formEl: FormInstance | undefined) => {
  if (!formEl) return
 await formEl.validate((valid) => {
  if(!valid) return
    let params = {
      ...datas.submitForm,
    };
      ElMessageBox.confirm(
        $t('lang.common.plzSubmit'),
        $t('lang.common.tips'),
      {
        confirmButtonText:    $t('lang.common.comfirm'),
        cancelButtonText:  $t('lang.common.cancel'),
        type: 'warning',
      }
      )
      .then(() => {
        save(params);
      })
  })
    
};

</script>

<style scoped lang="less"></style>
