<template>
  <el-dialog
    v-model="dialogVisible"
    :title="datas.title"
    width="30%"
    draggable
    :before-close="handleCancel"
    :close-on-click-modal="false"
  >
    <el-form
      :model="datas.submitForm"
      label-width="100px"
      :rules="rules"
      ref="ruleFormRef"
    >
      <el-col :span="20">
        <el-form-item :label="$t('lang.baseData.GZname')" prop="ruleName">
          <el-input
            v-model="datas.submitForm.ruleName"
            maxlength="30"
            :placeholder="$t('lang.baseData.plzGZmane')"
          />
        </el-form-item>
      </el-col>
      <el-col :span="20">
        <el-form-item
          :label="$t('lang.baseData.GZpz')"
          prop="deviationRangeType"
        >
          <el-select
            v-model="datas.submitForm.deviationRangeType"
            class="m-2"
            style="width: 30%"
            placeholder=""
            @change="changeRange"
          >
            <el-option
              v-for="(item, i) in DeviationRange"
              :key="i"
              :label="item.text"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <div
            style="display: flex"
            v-if="datas.submitForm.deviationRangeType == 1"
          >
            <el-form-item label="" prop="lowerLimit">
              -
              <el-input
                v-model="datas.submitForm.lowerLimit"
                type="number"
                step="0.01"
                min="0"
                max="1000"
                oninput="if(value>1000)value=1000;if(value<0)value=0;if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
                style="width: 80%"
                :rules="rules.lowerLimit"
              />KG
            </el-form-item>
            <span style="width: 60px; text-align: center"> ~ </span>
            <el-form-item label="" prop="superiorLimit">
              +
              <el-input
                v-model="datas.submitForm.superiorLimit"
                type="number"
                maxlength="3"
                step="0.01"
                min="0"
                max="1000"
                oninput="if(value>1000)value=1000;if(value<0)value=0;if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
                style="width: 80%"
              />KG
            </el-form-item>
          </div>
          <div
            style="display: flex"
            v-if="datas.submitForm.deviationRangeType == 2"
          >
            <el-form-item label="" prop="lowerLimit">
              -
              <el-input
                v-model="datas.submitForm.lowerLimit"
                type="number"
                step="0.01"
                min="0"
                max="100"
                style="width: 80%"
                oninput="if(value>100)value=100;if(value<0)value=0;if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
              />%
            </el-form-item>
            <span style="width: 60px; text-align: center"> ~ </span>
            <el-form-item label="" prop="superiorLimit">
              +
              <el-input
                v-model="datas.submitForm.superiorLimit"
                type="number"
                step="0.01"
                min="0"
                max="100"
                style="width: 80%"
                oninput="if(value>100)value=100;if(value<0)value=0;if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
              />%
            </el-form-item>
          </div>
        </el-form-item>
      </el-col>
      <el-col :span="20">
        <el-form-item :label="$t('lang.baseData.BZgg')">
          <el-select
            v-model="datas.submitForm.packType"
            class="m-2"
            style="width: 50%"
            placeholder=""
          >
            <el-option
              v-for="(item, i) in Packaging"
              :key="i"
              :label="item.text"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="20">
        <el-form-item :label="$t('lang.baseData.KZtj')">
          <el-form-item :label="$t('lang.baseData.Gys')">
            <el-input
              v-model="datas.submitForm.supplierCode"
              maxlength="30"
              :placeholder="$t('lang.baseData.plzGys')"
            />
          </el-form-item>
          <el-form-item
            :label="$t('lang.baseData.LH')"
            style="margin-top: 15px"
          >
            <el-input
              v-model="datas.submitForm.matterCode"
              maxlength="30"
              :placeholder="$t('lang.baseData.plzLH')"
            />
          </el-form-item>
        </el-form-item>
      </el-col>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleCancel">{{
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
  </el-dialog>
</template>

<script lang="ts" setup>
  import { ref, reactive, nextTick, getCurrentInstance } from 'vue'
  import { ElMessage, FormRules, FormInstance } from 'element-plus'
  import { useCallback } from '@/hooks/useCallback'
  import { useConfirm } from '@/hooks/useConfirm'
  const { proxy } = getCurrentInstance() as any
  const $t = proxy.$t
  interface Datas {
    title: string
    submitForm: any
    loading: boolean
  }
  interface Props {
    editData: any
  }
  const { editData } = defineProps<Props>()
  let data = { ...editData }
  const emit = defineEmits(['success', 'close'])
  const DeviationRange: any = [
    {
      text: $t('lang.baseData.Weight'),
      value: 1
    },
    {
      text: $t('lang.baseData.percentage'),
      value: 2
    }
  ]

  const Packaging: any = [
    {
      text: $t('lang.baseData.WB'),
      value: 3
    },
    {
      text: $t('lang.baseData.ZB'),
      value: 2
    },
    {
      text: $t('lang.baseData.XB'),
      value: 1
    }
  ]
  let datas: Datas = reactive({
    title: $t('lang.baseData.AddPX'),
    submitForm: {
      id: null,
      deviationRangeType: 1,
      matterCode: '',
      packType: 3,
      ruleName: '',
      lowerLimit: null,
      superiorLimit: null,
      supplierCode: ''
    },
    loading: false
  })
  const ruleFormRef = ref<FormInstance>()
  const rules = reactive<FormRules>({
    ruleName: [
      {
        required: true,
        message: $t('lang.baseData.plzGZmane'),
        trigger: 'blur'
      }
    ],
    deviationRangeType: [{ required: true, message: '', trigger: 'change' }],
    lowerLimit: [
      { required: true, message: $t('lang.baseData.plzPXfw'), trigger: 'blur' }
    ],
    superiorLimit: [
      { required: true, message: $t('lang.baseData.plzPXfw'), trigger: 'blur' }
    ]
  })
  if (data.id) {
    nextTick(() => {
      datas.title = $t('lang.baseData.InfoPX')
      datas.submitForm = data
      if (data.deviationRangeType == 1) {
        datas.submitForm.lowerLimit = data.lowerLimit / 1000
        datas.submitForm.superiorLimit = data.superiorLimit / 1000
      } else {
        datas.submitForm.lowerLimit = data.lowerLimit * 100
        datas.submitForm.superiorLimit = data.superiorLimit * 100
      }
    })
  }
  const dialogVisible = ref(true)
  const handleCancel = () => {
    emit('close')
  }
  const changeRange = () => {
    datas.submitForm.lowerLimit = ''
    datas.submitForm.superiorLimit = ''
  }
  const SaveInfo = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate(valid => {
      if (!valid) return
      datas.loading = true
      let params = {
        ...datas.submitForm
      }
      if (params.deviationRangeType == 1) {
        params.lowerLimit = params.lowerLimit * 1000
        params.superiorLimit = params.superiorLimit * 1000
      } else {
        params.lowerLimit = params.lowerLimit / 100
        params.superiorLimit = params.superiorLimit / 100
      }
      if (!data.id) {
        useConfirm(AddInfo, params, $t('lang.common.plzSubmit') + '!')
      } else {
        useConfirm(EditInfo, params, $t('lang.common.plzSubmit') + '!')
      }
    })
  }
  const AddInfo = (params: any) => {
    proxy.$api.rule.AddRule(params).then((res: any) => {
      datas.loading = false
      const data = useCallback(res, $t('lang.common.AddSuc') + '!')
      if (data) search()
    })
  }
  const EditInfo = (params: any) => {
    proxy.$api.rule.UpdateInfo(params).then((res: any) => {
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

<style scoped lang="less"></style>
