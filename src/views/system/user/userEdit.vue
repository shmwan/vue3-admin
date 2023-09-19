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
          <el-form-item label="所属组织" prop="organIdList" class="treeBox">
            <el-tree
              :data="datas.options"
              show-checkbox
              node-key="id"
              ref="collectTree"
              check-strictly
              :disabled="show"
              :props="defaultProps"
              @check="handleCheckChange"
            />
          </el-form-item>
        </el-col>
        <el-col :span="20">
          <el-form-item label="用户姓名" prop="showName">
            <el-input
              v-model="datas.submitForm.showName"
              maxlength="30"
              clearable
              :disabled="show"
              placeholder="请输入用户姓名"
            />
          </el-form-item>
        </el-col>
        <el-col :span="20">
          <el-form-item label="用户登录名" prop="username">
            <el-input
              v-model="datas.submitForm.username"
              maxlength="30"
              clearable
              :disabled="show"
              placeholder="请输入用户登录名"
            />
          </el-form-item>
        </el-col>
        <el-col :span="20" v-if="datas.showPass">
          <el-form-item label="密码" prop="password">
            <el-input
              v-model="datas.submitForm.password"
              maxlength="30"
              clearable
              :disabled="show"
              placeholder="请输入密码"
            />
          </el-form-item>
        </el-col>
        <el-col :span="20">
          <el-form-item label="角色类型" prop="systemIds">
            <el-select
              v-model="datas.submitForm.systemIds"
              placeholder="请选择角色类型"
              clearable
              multiple
              :disabled="show"
            >
              <el-option
                v-for="item in datas.roleList"
                :key="item.id"
                :label="item.roleName"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="20">
          <el-form-item label="联系电话" prop="mobile">
            <el-input
              v-model="datas.submitForm.mobile"
              maxlength="11"
              clearable
              :disabled="show"
              placeholder="请输入联系电话"
            />
          </el-form-item>
        </el-col>
      </el-form>
      <template #footer>
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
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, getCurrentInstance } from 'vue'
  import { ElMessageBox, FormRules, FormInstance } from 'element-plus'
  import { useCallback } from '@/hooks/useCallback'
  import { useConfirm } from '@/hooks/useConfirm'
  import { translateDataToTree } from '@/utils/common.js'
  const { proxy } = getCurrentInstance() as any
  const $t = proxy.$t
  const emit = defineEmits(['success', 'close'])
  const collectTree = ref()
  const { editData, isShow } = defineProps<Props>()
  let data = { ...editData }
  let show = isShow
  interface Props {
    editData: any
    isShow: boolean
  }
  interface Datas {
    loading: boolean
    Tips: string
    submitForm: any
    options: any
    roleList: any
    showPass: boolean
    selectList: any
  }
  let datas: Datas = reactive({
    loading: false,
    Tips: '新增用户',
    options: [],
    roleList: [],
    selectList: [],
    showPass: true,
    submitForm: {
      showName: '', // 登录名
      username: '', // 用户姓名
      password: '', // 密码
      mobile: '', // 手机号
      systemIds: [],
      organIdList: [],
      status: 1,
      userType: 0
    }
  })
  const defaultProps = {
    children: 'children',
    label: 'organName',
    disabled: 'disabled'
  }
  const checkPhone = (rule: any, value: any, callback: any) => {
    const reg = /^1[34578]\d{9}$$/
    if (value === '') {
      callback(new Error('请输入联系电话'))
    } else {
      if (!reg.test(value)) {
        callback(new Error('电话号码格式不正确！'))
      } else {
        callback()
      }
    }
  }
  const checkPassword = (rule: any, value: any, callback: any) => {
    const reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{6,}$/
    if (value === '') {
      callback(new Error('请输入密码'))
    } else {
      if (!reg.test(value)) {
        callback(
          new Error('密码至少包含一个大写字母、小写字母和数字，至少6个字符！')
        )
      } else {
        callback()
      }
    }
  }

  if (data.id) {
    nextTick(() => {
      datas.Tips = '修改用户'
      datas.submitForm = data
      datas.showPass = false
      datas.selectList = data.organIdList.split(',').map((ele: any) => {
        return Number(ele)
      })
      collectTree.value.setCheckedKeys(datas.selectList)
      datas.submitForm.systemIds = data.systemIdList
    })
  }
  const ruleFormRef = ref<FormInstance>()
  const rules = reactive<FormRules>({
    organIdList: [
      {
        required: true,
        message: '请选择所属组织',
        trigger: 'change'
      }
    ],
    showName: [
      {
        required: true,
        message: '请输入用户姓名',
        trigger: 'blur'
      }
    ],
    username: [
      {
        required: true,
        message: '请输入用户登录名',
        trigger: 'blur'
      }
    ],
    password: [
      {
        required: true,
        validator: checkPassword,
        trigger: 'blur'
      }
    ],
    mobile: [
      {
        required: true,
        validator: checkPhone,
        trigger: 'blur'
      }
    ],
    systemIds: [
      {
        required: true,
        message: '请选择角色类型',
        trigger: 'change'
      }
    ]
  })
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
    proxy.$api.user.addUser(params).then((res: any) => {
      datas.loading = false
      const data = useCallback(res, $t('lang.common.AddSuc') + '!')
      if (data) search()
    })
  }
  const EditInfo = (params: any) => {
    proxy.$api.user.update(params).then((res: any) => {
      datas.loading = false
      const data = useCallback(res, $t('lang.common.EditSuc') + '!')
      if (data) search()
    })
  }
  const getTreeList = () => {
    proxy.$api.organ.getList().then((res: any) => {
      datas.loading = false
      if (res.code == 200) {
        let listArr = res.data.list
        listArr.forEach((item: any) => {
          item.disabled = show
        })
        datas.options = translateDataToTree(listArr)
      } else {
      }
    })
  }
  const handleCheckChange = (item: any, data: any) => {
    datas.submitForm.organIdList = data.checkedKeys
  }
  const handleClose = () => {
    emit('close')
  }
  const search = () => {
    emit('close')
    emit('success')
  }
  const getRoleList = () => {
    let params = {
      pageNo: 1,
      pageSize: 9999
    }
    proxy.$api.role.getRoleList(params).then((res: any) => {
      if (res.code == 200) {
        datas.roleList = res.data.list
      }
    })
  }
  getTreeList()
  getRoleList()
  const dialogVisible = ref(true)
</script>

<style scoped lang="less">
  .dialog-footer button:first-child {
    margin-right: 10px;
  }
  :deep(.el-select) {
    width: 100%;
  }
  :deep(.el-tree) {
    width: 100% !important;
  }
</style>
