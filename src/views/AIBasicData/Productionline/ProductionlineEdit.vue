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
          <el-form-item :label="$t('lang.ImesData.Factory')" prop="factoryCode">
            <el-select
              v-model="datas.submitForm.factoryCode"
              :placeholder="
                $t('lang.ImesData.plz') + $t('lang.ImesData.Factory')
              "
              clearable
              :disabled="show"
            >
              <el-option
                v-for="item in datas.FactoryList"
                :key="item.id"
                :label="item.factoryName"
                :value="item.factoryCode"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="20">
          <el-form-item :label="$t('lang.ImesData.LineBs')" prop="lineCode">
            <el-input
              v-model="datas.submitForm.lineCode"
              maxlength="30"
              clearable
              :disabled="show"
              :placeholder="$t('lang.ImesData.FactoryBsTips')"
            />
          </el-form-item>
        </el-col>
        <el-col :span="20">
          <el-form-item :label="$t('lang.ImesData.LineName')" prop="lineName">
            <el-input
              v-model="datas.submitForm.lineName"
              maxlength="30"
              clearable
              :disabled="show"
              :placeholder="
                $t('lang.ImesData.plz') + $t('lang.ImesData.LineName')
              "
            />
          </el-form-item>
        </el-col>
        <el-col :span="20">
          <el-form-item :label="$t('lang.ImesData.remark')" prop="remark">
            <el-input
              type="textarea"
              autosize
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
  import { useCallback } from '@/hooks/useCallback'
  import { useConfirm } from '@/hooks/useConfirm'
  const { proxy } = getCurrentInstance() as any
  const $t = proxy.$t
  const dialogVisible = ref(true)
  const emit = defineEmits(['success', 'close'])
  interface Datas {
    Tips: string
    submitForm: any
    FactoryList: any
    loading: boolean
  }
  let datas: Datas = reactive({
    Tips: $t('lang.ImesData.addLine'),
    submitForm: {
      factoryCode: '',
      lineCode: '',
      lineName: '',
      remark: ''
    },
    FactoryList: [],
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
      callback(new Error($t('lang.ImesData.plz') + $t('lang.ImesData.LineBs')))
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
        message: $t('lang.ImesData.Change') + $t('lang.ImesData.Factory'),
        trigger: 'change'
      }
    ],
    lineCode: [
      {
        required: true,
        validator: validatePass,
        trigger: 'blur'
      }
    ],
    lineName: [
      {
        required: true,
        message: $t('lang.ImesData.plz') + $t('lang.ImesData.LineName'),
        trigger: 'blur'
      }
    ]
  })
  if (data.id) {
    nextTick(() => {
      datas.Tips = $t('lang.ImesData.upLine')
      datas.submitForm = data
    })
  }
  if (show) {
    nextTick(() => {
      datas.Tips = $t('lang.ImesData.deLine')
      //   datas.submitForm = data
    })
  }
  const handleClose = () => {
    emit('close')
  }
  const searchFactory = () => {
    let params = {
      keyword: '',
      pageNo: 1,
      pageSize: 99999
    }
    proxy.$api.FactoryManage.getList(params).then((res: any) => {
      datas.loading = false
      if (res.code == 200) {
        datas.FactoryList = res.data.records
      }
    })
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
    proxy.$api.Productionline.addData(params).then((res: any) => {
      datas.loading = false
      const data = useCallback(res, $t('lang.common.AddSuc') + '!')
      if (data) search()
    })
  }
  const EditInfo = (params: any) => {
    proxy.$api.Productionline.UpdateData(params).then((res: any) => {
      datas.loading = false
      const data = useCallback(res, $t('lang.common.EditSuc') + '!')
      if (data) search()
    })
  }
  const search = () => {
    emit('close')
    emit('success')
  }
  searchFactory()
</script>

<style scoped lang="less">
  :deep(.el-select) {
    width: 100%;
  }
</style>
