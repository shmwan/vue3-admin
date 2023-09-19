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
          <el-form-item label="角色名" prop="roleName">
            <el-input
              v-model="datas.submitForm.roleName"
              maxlength="30"
              clearable
              placeholder="请输入角色名"
            />
          </el-form-item>
        </el-col>
        <el-col :span="20">
          <el-form-item label="角色描述" prop="roleDes">
            <el-input
              v-model="datas.submitForm.roleDes"
              maxlength="30"
              clearable
              placeholder="请输入角色描述"
            />
          </el-form-item>
        </el-col>
        <el-col :span="20">
          <el-form-item label="角色类型" prop="roleType">
            <el-select
              v-model="datas.submitForm.roleType"
              placeholder="请选择角色类型"
              clearable
            >
              <el-option
                v-for="item in datas.dictList"
                :key="item.id"
                :label="item.dictionName"
                :value="item.dictionCode"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="20">
          <el-form-item label="菜单权限" prop="checkedKeys">
            <el-tree
              :data="treeData"
              show-checkbox
              ref="treeRef"
              node-key="id"
              :props="defaultProps"
              @check="handleCheck"
              :check-strictly="true"
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
  import { translateDataToTree, treeToList2 } from '@/utils/common.js'

  const { proxy } = getCurrentInstance() as any
  const $t = proxy.$t
  const emit = defineEmits(['success', 'close'])
  interface Props {
    editData: any
  }
  interface Datas {
    loading: boolean
    Tips: string
    submitForm: any
  }
  let treeData = $ref<any[]>([])
  let datas: Datas = reactive({
    loading: false,
    Tips: '新增角色',
    submitForm: {
      roleName: '',
      roleDes: '',
      roleType: null,
      checkedKeys: []
    }
  })
  const defaultProps = {
    children: 'children',
    label: 'name'
  }
  const { editData } = defineProps<Props>()
  let data = { ...editData }
  // 获取权限树
  const getTree = async (menuIdList?: number[]) => {
    let { list } = await proxy.$api.menu.getMenuList({
      pageNo: 1,
      pageSize: 1000,
      systemId: 45
    })

    treeData = translateDataToTree(list)
    if (menuIdList) {
      treeRef.setCheckedKeys(menuIdList)
    }
  }
  const getRoleMenu = async (roleId: number) => {
    // 获取角色对应的权限
    const data = await proxy.$api.menu.getMenuTree({ roleId })
    let menuList = treeToList2(data)
    let menuIdList = menuList.map((ele: any) => {
      return ele.id
    })
    return {
      menuIdList
    }
  }
  if (data.id) {
    nextTick(async () => {
      datas.Tips = '修改角色'
      datas.submitForm = data
      const { menuIdList } = await getRoleMenu(data.id)
      getTree(menuIdList)
    })
  } else {
    datas.submitForm = {}
    getTree()
  }

  const ruleFormRef = ref<FormInstance>()
  //声明权限菜单树
  let treeRef = $ref<any>()
  const rules = reactive<FormRules>({
    roleType: [
      {
        required: true,
        message: '请选择角色类型',
        trigger: 'change'
      }
    ],
    roleName: [
      {
        required: true,
        message: '请输入角色名',
        trigger: 'blur'
      }
    ],
    roleDes: [
      {
        required: true,
        message: '请输入角色描述',
        trigger: 'blur'
      }
    ],
    checkedKeys: [
      {
        required: true,
        message: '请选择菜单权限',
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
  let cusChecked = reactive<any[]>([])
  //权限树的选择则
  const handleCheck = (currentNode: any, treeStatus: any) => {
    console.log(currentNode, treeStatus)
    /**
     * @des 根据父元素的勾选或取消勾选，将所有子级处理为选择或非选中状态
     * @param { node: Object }  当前节点
     * @param { status: Boolean } （true ： 处理为勾选状态 ； false： 处理非选中）
     */
    const setChildStatus = (node: any, status: any) => {
      /* 这里的 id children 也可以是其它字段，根据实际的业务更改 */
      treeRef.setChecked(node.id, status)
      if (node.children) {
        /* 循环递归处理子节点 */
        for (let i = 0; i < node.children.length; i++) {
          setChildStatus(node.children[i], status)
        }
      }
    }
    /* 设置父节点为选中状态 */
    const setParentStatus = (nodeObj: any) => {
      /* 拿到tree组件中的node,使用该方法的原因是第一次传入的 node 没有 parent */
      const node = treeRef.getNode(nodeObj)
      if (node.parent.key) {
        treeRef.setChecked(node.parent, true)
        setParentStatus(node.parent)
      }
    }
    /* 判断当前点击是选中还是取消选中操作 */
    if (treeStatus.checkedKeys.includes(currentNode.id)) {
      setParentStatus(currentNode)
      setChildStatus(currentNode, true)
    } else {
      /* 取消选中 */
      if (currentNode.children) {
        setChildStatus(currentNode, false)
      }
    }
    cusChecked = [...treeRef.getCheckedKeys()]
    console.log(cusChecked)
  }
  /**
   * 大数组去除小数组
   * @param {大的数组} totalArray
   * @param {小的数组} falseList
   */
  const eliminateArray = (totalArray: [], falseList: []) => {
    // 总数据中删除 取消的数据
    var len = falseList.length //  this.falseList 数据量小的
    // 小的在外  大的在内
    for (var i = 0; i < len; i++) {
      var totalLen = totalArray.length
      for (var j = totalLen - 1; j >= 0; j--) {
        if (totalArray[j] == falseList[i]) {
          totalArray.splice(j, 1)
          break
        }
      }
    }
    return totalArray
  }
  // 数据合并并去重  arr [{id:'',value:''},...]
  const mergeArrayRelaseSame = (arr: any[]) => {
    return Array.from(new Set(arr))
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
  const handleClose = () => {
    emit('close')
  }
  const search = () => {
    emit('close')
    emit('success')
  }

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
