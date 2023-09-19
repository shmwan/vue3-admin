<template>
  <div>
    <el-dialog
      v-model="dialogVisible"
      :title="datas.Tips"
      width="30%"
      draggable
      :before-close="handleClose"
      :close-on-click-modal="false"
    >
      <el-form
        :model="datas.submitForm"
        label-width="100px"
        :rules="rules"
        ref="ruleFormRef"
      >
        <el-col :span="20">
          <el-form-item
            :label="$t('lang.ImesData.FactoryBs')"
            prop="factoryCode"
          >
            <el-input
              v-model="datas.submitForm.factoryCode"
              maxlength="30"
              clearable
              :placeholder="$t('lang.ImesData.FactoryBsTips')"
              :disabled="show"
            />
          </el-form-item>
        </el-col>
        <el-col :span="20">
          <el-form-item
            :label="$t('lang.ImesData.FactoryName')"
            prop="factoryName"
          >
            <el-input
              v-model="datas.submitForm.factoryName"
              maxlength="30"
              clearable
              :placeholder="$t('lang.ImesData.FactoryNameTips')"
              :disabled="show"
            />
          </el-form-item>
        </el-col>
        <el-col :span="20">
          <el-form-item :label="$t('lang.ImesData.remark')" prop="ruleName">
            <el-input
              type="textarea"
              autosize
              v-model="datas.submitForm.remark"
              clearable
              :placeholder="
                $t('lang.ImesData.plz') + $t('lang.ImesData.remark')
              "
              :disabled="show"
            />
          </el-form-item>
        </el-col>
      </el-form>
      <template #footer v-if="!show">
        <span class="dialog-footer">
          <el-button @click="handleClose">{{
            $t('lang.common.cancel')
          }}</el-button>
          <el-button
            type="primary"
            @click="SaveInfo(ruleFormRef)"
            :loading="datas.loading"
          >
            {{ $t('lang.common.comfirm') }}
          </el-button>
        </span>
      </template>
      <template #footer v-else>
        <span class="dialog-footer">
          <el-button type="primary" @click="handleClose">{{
            $t('lang.common.close')
          }}</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, getCurrentInstance } from 'vue'
  import { ElMessageBox, FormRules, FormInstance } from 'element-plus'
  import { useCallback } from '@/hooks/useCallback'
  import { useConfirm } from '@/hooks/useConfirm'
  const { proxy } = getCurrentInstance() as any
  const $t = proxy.$t
  const dialogVisible = ref(true)
  const emit = defineEmits(['success', 'close'])
  let datas = reactive({
    Tips: $t('lang.ImesData.addFactory'),
    submitForm: {
      factoryCode: '',
      factoryName: '',
      remark: ''
    },
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
      callback(
        new Error($t('lang.ImesData.plz') + $t('lang.ImesData.FactoryBs'))
      )
    } else {
      if (!reg.test(value)) {
        callback(new Error($t('lang.ImesData.FactoryBsTips')))
      } else {
        callback()
      }
    }
  }
  const ruleFormRef = ref<FormInstance>()
  const rules = reactive<FormRules>({
    factoryCode: [
      {
        required: true,
        validator: validatePass,
        trigger: 'blur'
      }
    ],
    factoryName: [
      {
        required: true,
        message: $t('lang.ImesData.plz') + $t('lang.ImesData.FactoryName'),
        trigger: 'blur'
      }
    ]
  })
  if (data.id) {
    nextTick(() => {
      datas.Tips = $t('lang.ImesData.upFactory')
      datas.submitForm = data
    })
  }
  if (show) {
    nextTick(() => {
      datas.Tips = $t('lang.ImesData.deFactory')
      //   datas.submitForm = data
    })
  }
  const handleClose = () => {
    emit('close')
  }
  const SaveInfo = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate(valid => {
      if (!valid) return
      datas.loading = true
      let params = {
        ...datas.submitForm
      }
      if (data.id) {
        useConfirm(EditInfo, params, $t('lang.common.plzSubmit') + '!')
      } else {
        useConfirm(addFactory, params, $t('lang.common.plzSubmit') + '!')
      }
    })
  }
  const addFactory = (params: any) => {
    proxy.$api.FactoryManage.addFactory(params).then((res: any) => {
      datas.loading = false
      const data = useCallback(res, $t('lang.common.AddSuc') + '!')
      if (data) search()
    })
  }
  const EditInfo = (params: any) => {
    proxy.$api.FactoryManage.FactoryUpdate(params).then((res: any) => {
      datas.loading = false
      const data = useCallback(res, $t('lang.common.EditSuc') + '!')
      if (data) search()
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
