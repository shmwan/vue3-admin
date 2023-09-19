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
      label-width="140px"
    >
      <el-row>
        <el-col :span="18">
          <el-form-item label="菜单类型" prop="type" label-width="150px">
            <el-select
              v-model="datas.submitForm.type"
              clearable
              placeholder="请选择"
            >
              <el-option
                v-for="item in typeOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="!btnFlag">
        <el-col :span="18">
          <el-form-item label="功能名称" prop="name" label-width="150px">
            <el-select
              @change="btnChange"
              v-model="datas.submitForm.name"
              placeholder="请选择功能"
            >
              <el-option
                v-for="item in btnOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="btnFlag">
        <el-col :span="18">
          <el-form-item label="菜单名称" prop="name" label-width="150px">
            <el-input
              v-model="datas.submitForm.name"
              @input="e => (submitForm.name = validForbid(e))"
              auto-complete="off"
              @focus="filterData"
              maxlength="20"
              show-word-limit
              placeholder="请输入菜单名称"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="18">
          <el-form-item label="上级菜单" prop="parentId" label-width="150px">
            <el-select
              v-model="datas.submitForm.parentId"
              clearable
              placeholder="请选择"
            >
              <el-option
                v-for="item in options"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="18">
          <el-form-item label="路由名称" prop="routerName" label-width="150px">
            <el-input
              v-model="datas.submitForm.routerName"
              auto-complete="off"
              placeholder="请输入名称（前端提供）"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="18">
          <el-form-item label="访问地址" prop="requestUrl" label-width="150px">
            <el-input
              v-model="datas.submitForm.requestUrl"
              auto-complete="off"
              placeholder="请输入地址（前端提供）"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="btnFlag">
        <el-col :span="18">
          <el-form-item label="图标" prop="icon" label-width="150px">
            <el-input v-model="datas.submitForm.icon">
              <el-button
                @click="changeIcon"
                slot="append"
                icon="el-icon-search"
              ></el-button>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="18">
          <el-form-item label="排序" prop="orderNum" label-width="150px">
            <el-input v-model="datas.submitForm.orderNum" type="number" min="0">
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
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
  import {
    ElMessage,
    ElMessageBox,
    FormInstance,
    FormRules
  } from 'element-plus'
  import { useCallback } from '@/hooks/useCallback'
  const { proxy } = getCurrentInstance() as any
  const $t = proxy.$t
  interface SubmitForm {
    id?: Number
    routerName: String
    name: String
    requestUrl: String
    parentId: Number | null
    type: Number
    orderNum: Number | null
    addType: String
  }

  interface BtnRef {
    id: Number
    groupName: String
    dictionCode: String
  }
  /**
   * 定义父级菜单的接口
   */
  interface ParentOption {
    id: Number | String
    name: String
  }
  interface Datas {
    title: String
    visible?: Boolean
    loading: Boolean
    btnOptions: Array<BtnRef>
    submitForm: SubmitForm
    parentOption: Array<ParentOption>
  }
  interface Props {
    editData: SubmitForm
  }
  const { editData } = defineProps<Props>()
  let data = { ...editData }
  const emit = defineEmits(['success', 'close'])

  let datas: Datas = reactive({
    title: '新增菜单',
    visible: true,
    loading: false,
    btnOptions: [],
    submitForm: {
      routerName: '',
      type: 0,
      requestUrl: '',
      parentId: null,
      name: '',
      orderNum: null,
      addType: ''
    },
    parentOption: []
  })
  const getBtnOption = async () => {
    let res = await proxy?.$api.dict.selectBy({ groupCode: 1050 })
    if (res.code === 200) {
      datas.btnOptions = res.data
    }
  }
  getBtnOption()
  let typeOptions: Object[] = reactive([
    {
      id: 0,
      name: '目录'
    },
    {
      id: 1,
      name: '菜单'
    }
  ])
  let typeBtnOptions: Object[] = reactive([
    {
      id: 1,
      name: '菜单'
    },
    {
      id: 2,
      name: '功能'
    }
  ])
  // 定义校验规则
  const ruleFormRef = ref<FormInstance>()
  const rules = reactive<FormRules>({
    type: [
      {
        required: true,
        message: '请输入菜单类型'
      }
    ],
    name: [
      {
        required: true,
        message: '请输入菜单名称'
      }
    ],
    routerName: [
      {
        required: true,
        message: '请输入路由名称'
      }
    ],
    requestUrl: [
      {
        required: true,
        message: '请选择访问地址'
      }
    ]
  })
  if (data.id) {
    datas.title = $t('lang.diction.detailTits')
    console.log()
    datas.submitForm = {
      ...data
    }
  }

  const btnChange = () => {}
  const dialogVisible = ref(true)
  const handleCancel = () => {
    emit('close')
  }
  const save = (params: any) => {
    datas.loading = true
    if (!data.id) {
      proxy.$api.dict.add(params).then((res: any) => {
        datas.loading = false
        const data = useCallback(res, $t('lang.common.AddSuc'))
        if (data) search()
      })
    } else {
      proxy.$api.dict.update(params).then((res: any) => {
        datas.loading = false
        const data = useCallback(res, $t('lang.common.EditSuc'))
        if (data) search()
      })
    }
  }
  const search = () => {
    emit('close')
    emit('success')
  }
  const SaveInfo = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate(valid => {
      if (!valid) return
      let params = {
        ...datas.submitForm
      }
      ElMessageBox.confirm(
        $t('lang.common.plzSubmit'),
        $t('lang.common.tips'),
        {
          confirmButtonText: $t('lang.common.comfirm'),
          cancelButtonText: $t('lang.common.cancel'),
          type: 'warning'
        }
      ).then(() => {
        save(params)
      })
    })
  }
</script>

<style scoped lang="less">
  :deep(.el-select) {
    width: 100%;
  }
</style>
