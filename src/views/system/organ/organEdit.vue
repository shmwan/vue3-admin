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
          <el-form-item label="组织名称" prop="organName">
            <el-input
              v-model="datas.submitForm.organName"
              maxlength="30"
              clearable
              :disabled="show"
              placeholder="请输入组织名称"
            />
          </el-form-item>
        </el-col>
        <el-col :span="20">
          <el-form-item label="组织代码" prop="organNo">
            <el-input
              v-model="datas.submitForm.organNo"
              maxlength="30"
              clearable
              :disabled="show"
              placeholder="请输入组织代码"
            />
          </el-form-item>
        </el-col>
        <el-col :span="20">
          <el-form-item label="父级组织" prop="parentId" class="treeBox">
            <el-tree
              v-loading="datas.loadingTree"
              ref="collectTree"
              :data="datas.options"
              :props="defaultProps"
              node-key="id"
              highlight-current
              :expand-on-click-node="false"
              :check-strictly="true"
              @node-click="selectTree"
              :default-expanded-keys="datas.expandedKeys"
            >
              <template #default="{ node, data }">
                <span class="custom-tree-node">
                  <el-checkbox
                    v-model="datas.dataCheck[`${data.idx}`]"
                    :indeterminate="datas.dataCheckSalf[`${data.idx}`]"
                    :key="data.id"
                    :disabled="show"
                    @change="pickAll(node, data)"
                  ></el-checkbox>
                  <span style="margin-left: 10px">{{ data.organName }}</span>
                </span>
              </template>
            </el-tree>
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
  import { translateDataToTree } from '@/utils/common.js'
  import { useCallback } from '@/hooks/useCallback'
  import { useConfirm } from '@/hooks/useConfirm'
  const { proxy } = getCurrentInstance() as any
  const $t = proxy.$t
  const emit = defineEmits(['success', 'close'])
  const collectTree = ref()
  interface Props {
    editData: any
    isShow: boolean
  }
  interface Datas {
    loading: boolean
    Tips: string
    submitForm: any
    loadingTree: boolean
    options: any
    dataCheck: any
    dataCheckSalf: any
    dataCheckSalfObj: any
    organData: any
    value: any
    preOrganNo: string
    expandedKeys: any
  }
  let datas: Datas = reactive({
    loading: false,
    loadingTree: false,
    Tips: '新增组织',
    options: [],
    dataCheck: [],
    dataCheckSalf: [],
    dataCheckSalfObj: [],
    organData: [],
    value: [],
    expandedKeys: [],
    preOrganNo: '',
    submitForm: {
      organNo: '',
      organNoP: '',
      organName: '',
      parentId: 0,
      parentIds: '',
      parentOrganNos: null,
      roleType: '1'
    }
  })
  const defaultProps = {
    children: 'children',
    label: 'label'
  }
  const { editData, isShow } = defineProps<Props>()
  let data = { ...editData }
  let show = isShow
  //   if (data.id) {
  //     nextTick(() => {
  //       datas.Tips = '修改组织'
  //       datas.submitForm = data
  //     })
  //   }
  const ruleFormRef = ref<FormInstance>()
  const rules = reactive<FormRules>({
    organName: [
      {
        required: true,
        message: '请输入角色名',
        trigger: 'blur'
      }
    ],
    organNo: [
      {
        required: true,
        message: '请输入角色描述',
        trigger: 'blur'
      }
    ],
    parentId: [
      {
        required: true,
        message: '请选择菜单权限',
        trigger: 'change'
      }
    ]
  })
  if (data.id) {
    nextTick(() => {
      datas.Tips = '修改组织'
    })
    datas.submitForm = data
  }
  const getDetail = () => {
    datas.dataCheckSalfObj.forEach((item: any, index: any) => {
      // debugger
      if (item.id == datas.submitForm.id) {
        datas.dataCheck[index] = true
      } else {
        datas.dataCheck[index] = false
      }
      datas.dataCheckSalf[index] = false
    })
    let idsArr = datas.submitForm.parentIds.split(',')
    idsArr.forEach((item: any, j: any) => {
      for (const i in datas.dataCheckSalfObj) {
        if (item == datas.dataCheckSalfObj[i].id) {
          datas.dataCheckSalf[datas.dataCheckSalfObj[i].idx] = true
        }
      }
    })
    datas.expandedKeys = [datas.submitForm.parentId]
  }
  const getTreeList = () => {
    proxy.$api.organ.getList().then((res: any) => {
      datas.loading = false
      if (res.code == 200) {
        datas.organData = res.data.list
        console.log('datas.data', datas.organData)
        datas.organData.forEach((item: any, index: any) => {
          if (item.id == datas.submitForm.parentId) {
            datas.submitForm.organNoP = item.organNo
          }
          datas.dataCheck.push(false)
          datas.dataCheckSalf.push(false)
          datas.dataCheckSalfObj.push(item)
          item.idx = index
        })
        let nodes = datas.organData
        datas.options = translateDataToTree(nodes)
        if (data.id) {
          getDetail()
        }
      } else {
      }
    })
  }
  const selectTree = (value: any) => {
    if (show) {
      return
    }
    datas.dataCheck.forEach((item: any, index: any) => {
      if (index == value.idx) {
        datas.dataCheck[index] = true
      } else {
        datas.dataCheck[index] = false
      }
      datas.dataCheckSalf[index] = false
    })
    let idsArr = value.parentIds.split(',')
    idsArr.forEach((item: any, j: any) => {
      for (const i in datas.dataCheckSalfObj) {
        if (item == datas.dataCheckSalfObj[i].id) {
          datas.dataCheckSalf[datas.dataCheckSalfObj[i].idx] = true
        }
      }
    })
  }
  const pickAll = (node: any, value: any) => {
    console.log('node', node, 'value', value)
    if (show) {
      return
    }
    if (node.canFocus == true) {
      datas.dataCheck.forEach((item: any, index: any) => {
        if (index == value.idx) {
          datas.dataCheck[index] = true
        } else {
          datas.dataCheck[index] = false
        }

        datas.dataCheckSalf[index] = false
      })
      let idsArr = value.parentIds.split(',')
      console.log('object', value)
      datas.submitForm.parentIds = value.parentIds + ',' + value.id
      datas.submitForm.parentId = value.id
      idsArr.forEach((item: any, j: any) => {
        for (let i in datas.dataCheckSalfObj) {
          if (item == datas.dataCheckSalfObj[i].id) {
            datas.dataCheckSalf[datas.dataCheckSalfObj[i].idx] = true
          }
        }
      })

      collectTree.value.setCheckedKeys([value.id])
      datas.submitForm.parentOrganNos = value.parentOrganNos
        ? value.parentOrganNos
        : value.organNo
    } else {
      datas.value = []
      datas.submitForm.organNo = ''
      datas.submitForm.organNoP = ''
    }
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
    proxy.$api.organ.add(params).then((res: any) => {
      datas.loading = false
      const data = useCallback(res, $t('lang.common.AddSuc') + '!')
      if (data) search()
    })
  }
  const EditInfo = (params: any) => {
    proxy.$api.organ.update(params).then((res: any) => {
      datas.loading = false
      const data = useCallback(res, $t('lang.common.EditSuc') + '!')
      if (data) search()
    })
  }
  const handleClose = () => {
    emit('close')
  }
  const search = () => {
    emit('close')
    emit('success')
  }
  getTreeList()
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
  .treeBox {
    :deep(.el-form-item__content) {
      max-height: 350px;
      overflow-y: scroll;
    }
  }
</style>
