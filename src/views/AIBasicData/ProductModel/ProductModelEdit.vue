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
        label-width="140px"
        :rules="rules"
        ref="ruleFormRef"
      >
        <el-col :span="20">
          <el-form-item :label="$t('lang.ImesData.modelBs')" prop="modelCode">
            <el-input
              v-model="datas.submitForm.modelCode"
              maxlength="32"
              clearable
              :disabled="show"
              :placeholder="$t('lang.ImesData.FactoryBsTips')"
            />
          </el-form-item>
        </el-col>
        <el-col :span="20">
          <el-form-item :label="$t('lang.ImesData.modelName')" prop="modelName">
            <el-input
              v-model="datas.submitForm.modelName"
              maxlength="32"
              clearable
              :disabled="show"
              :placeholder="
                $t('lang.ImesData.plz') + $t('lang.ImesData.modelName')
              "
            />
          </el-form-item>
        </el-col>
        <el-col :span="20">
          <el-form-item :label="$t('lang.ImesData.image')" prop="modelImage">
            <uploadImg
              :imgUpText="datas.imgText"
              @fileDetail="fileDetail"
              :imageUrl="datas.submitForm.modelImage"
              :disabledType="show"
            ></uploadImg>
          </el-form-item>
        </el-col>
        <el-col :span="20">
          <el-form-item
            :label="$t('lang.ImesData.productNo')"
            prop="itemNumber"
          >
            <el-input
              v-model="datas.submitForm.itemNumber"
              clearable
              maxlength="255"
              :disabled="show"
              :placeholder="
                $t('lang.ImesData.plz') + $t('lang.ImesData.productNo')
              "
            />
          </el-form-item>
        </el-col>
        <el-col :span="20">
          <el-form-item :label="$t('lang.ImesData.remark')" prop="ruleName">
            <el-input
              type="textarea"
              autosize
              maxlength="255"
              v-model="datas.submitForm.remark"
              clearable
              :disabled="show"
              :placeholder="
                $t('lang.ImesData.plz') + $t('lang.ImesData.remark')
              "
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
  import uploadImg from '../../../components/common/uploadImg.vue'
  import { useCallback } from '@/hooks/useCallback'
  import { useConfirm } from '@/hooks/useConfirm'
  const { proxy } = getCurrentInstance() as any
  const $t = proxy.$t
  const dialogVisible = ref(true)
  const emit = defineEmits(['success', 'close'])
  let datas = reactive({
    Tips: $t('lang.ImesData.addModel'),
    submitForm: {
      modelImage: '',
      modelCode: '',
      modelName: '',
      remark: '',
      itemNumber: ''
    },

    articleNo: [],
    imgText: $t('lang.ImesData.upImg'),
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
      callback(new Error($t('lang.ImesData.plz') + $t('lang.ImesData.modelBs')))
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
    itemNumber: [
      {
        required: true,
        message: $t('lang.ImesData.plz') + $t('lang.ImesData.productNo'),
        trigger: 'blur'
      }
    ],
    modelImage: [
      {
        required: true,
        message: $t('lang.ImesData.plzUpImg'),
        trigger: 'change'
      }
    ],
    modelCode: [
      {
        required: true,
        validator: validatePass,
        trigger: 'blur'
      }
    ],
    modelName: [
      {
        required: true,
        message: $t('lang.ImesData.plz') + $t('lang.ImesData.modelName'),
        trigger: 'blur'
      }
    ]
  })
  if (data.id) {
    nextTick(() => {
      datas.Tips = $t('lang.ImesData.upModel')
      datas.submitForm = data
    })
  }
  if (show) {
    nextTick(() => {
      datas.Tips = $t('lang.ImesData.deModel')
      //   datas.submitForm = data
    })
  }
  // const remoteMethod = (query: string) => {
  //   if (query) {
  //     datas.loading = true
  //     setTimeout(() => {
  //       datas.loading = false
  //       datas.articleNo = list.value.filter((item: any) => {
  //         return item.label.toLowerCase().includes(query.toLowerCase())
  //       })
  //     }, 200)
  //   } else {
  //     datas.articleNo = []
  //   }
  // }
  const handleClose = () => {
    emit('close')
  }
  const fileDetail = (file: any) => {
    datas.submitForm.modelImage = file.fileUrl
    // console.log(file, 'woajicnie')
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
        useConfirm(addInfo, params, $t('lang.common.plzSubmit') + '!')
      }
    })
  }
  const addInfo = (params: any) => {
    proxy.$api.ProductModel.addData(params).then((res: any) => {
      datas.loading = false
      const data = useCallback(res, $t('lang.common.AddSuc') + '!')
      if (data) search()
    })
  }
  const EditInfo = (params: any) => {
    proxy.$api.ProductModel.UpdateData(params).then((res: any) => {
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
