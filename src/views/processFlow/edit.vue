<template>
  <div>
    <el-dialog
      v-model="dialogVisible"
      :title="datas.Tips"
      width="80%"
      draggable
      :before-close="handleClose"
      :close-on-click-modal="false"
    >
      <el-form
        :model="datas.submitForm"
        label-width="100px"
        :rules="rules"
        ref="ruleFormRef"
        :disabled="isShow"
      >
        <el-row>
          <el-col :span="5">
            <el-form-item
              label="工艺流程编号："
              prop="technologicalProcessCode"
            >
              <el-input
                v-model="datas.submitForm.technologicalProcessCode"
                maxlength="30"
                clearable
                placeholder="请输入工艺流程编号"
              />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="产品机型标识：" prop="modelName">
              <el-select
                v-model="datas.submitForm.modelName"
                placeholder="请选择产品机型标识"
                clearable
                filterable
                @change="modelChange"
              >
                <el-option
                  v-for="item in datas.modelNameList"
                  :key="item.modelCode"
                  :label="item.modelCode"
                  :value="item.modelCode"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="适用品号：">
              <el-select
                v-model="datas.submitForm.partNo"
                placeholder="请选择适用品号"
                clearable
              >
                <el-option
                  v-for="item in datas.partNoList"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="工序类别：" prop="processCategoryType">
              <el-select
                v-model="datas.submitForm.processCategoryType"
                placeholder="请选择工序类别"
                clearable
              >
                <el-option
                  v-for="item in datas.processCategoryTypeList"
                  :key="item.dictionCode"
                  :label="item.dictionName"
                  :value="item.dictionCode"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="logic">
        <logicFlowVue ref="logic" :isSilentMode="isShow" />
      </div>
      <template #footer>
        <span class="dialog-footer" v-if="!isShow">
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
        <span class="dialog-footer" v-if="isShow">
          <el-button type="primary" @click="handleClose">
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
  import logicFlowVue from '@/components/logicFlow/index.vue'
  import { useProductModel } from '@/hooks/useProductModel.ts'
  import { useDictData } from '@/hooks/dictMinxin'

  const { proxy } = getCurrentInstance() as any
  const { getDictData } = useDictData()
  let logic = $ref(null)
  const $t = proxy.$t
  const dialogVisible = ref(true)
  const emit = defineEmits(['success', 'close'])
  let datas = reactive({
    Tips: '添加工艺流程',
    modelNameList: [],
    json: '',
    processCategoryTypeList: [],
    partNoList: [],
    submitForm: {
      technologicalProcessCode: '', //工艺流程编号
      modelName: '', //机型
      partNo: '', //成品料号
      processCategoryType: '', //工序类别-字典表

      tbTechnologicalProcessSiteAddDtos: [] //站点列表
    },
    loading: false
  })
  interface Props {
    id?: any
    technologicalProcessCode: any
    isShow?: boolean
  }
  const { id, isShow, technologicalProcessCode } = defineProps<Props>()
  const validatePass = (rule: any, value: any, callback: any) => {
    const reg = /^(?!.*--)(?![_-])(?!.*-$)(?!.*_$)[a-zA-Z0-9_-]+$/
    if (value === '') {
      callback(new Error('请输入线体标识'))
    } else {
      if (!reg.test(value)) {
        callback(new Error("仅支持：字母、数字、英文'-'、英文'_'"))
      } else {
        callback()
      }
    }
  }
  const ruleFormRef = ref<FormInstance>()
  const rules = reactive<FormRules>({
    technologicalProcessCode: [
      {
        required: true,
        message: '请输入工艺流程编号',
        trigger: 'blur'
      }
    ],
    modelName: [
      {
        required: true,
        message: '请选择产品机型标识',
        trigger: 'change'
      }
    ],
    partNo: [
      {
        required: true,
        message: '请选择适用品号',
        trigger: 'change'
      }
    ],
    processCategoryType: [
      {
        required: true,
        message: '请选择工序类别',
        trigger: 'change'
      }
    ]
  })
  if (id || technologicalProcessCode) {
    nextTick(() => {
      datas.Tips = '工艺流程详情'
    })
  }
  const modelData = useProductModel()
  onMounted(async () => {
    datas.processCategoryTypeList = await getDictData('10003')
    const { records } = await modelData.getData()
    datas.modelNameList = records
    if (id) getDetail({ id })
    if (technologicalProcessCode) getDetail({ technologicalProcessCode })
  })
  nextTick(() => {
    logic.$_setShow(isShow)
  })
  const getDetail = async (obj: object) => {
    const { data } = await proxy.$api.processFlow.getProcessDetail(obj)
    const json = JSON.parse(data.json)
    logic.$_rander(json, data)
    datas.submitForm = {
      ...data
    }
    logic.$_setShow(isShow)
    if (technologicalProcessCode) {
      modelChange(datas.submitForm.modelName)
      datas.submitForm.partNo = data.partNo
    }
  }
  const handleClose = () => {
    emit('close')
  }
  // 产品星报切换
  const modelChange = (item: string) => {
    console.log(item)
    datas.partNoList = []
    datas.submitForm.partNo = ''
    datas.partNoList = datas.modelNameList
      .filter(ele => ele.modelCode == item)[0]
      .itemNumber?.split(',')
  }
  const SaveInfo = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate(valid => {
      if (!valid) return
      const lookData = logic.lookData()
      // console.log(JSON.stringify(lookData.catData))
      const { nodes, edges } = lookData.catData
      if (edges.length == 0 && nodes.length > 0) {
        ElMessage({
          message: '工艺流程未做关联！',
          type: 'error'
        })
        return false
      }
      let TbTechnologicalProcessSiteAddDto = []
      for (let i = 0; i < nodes.length; i++) {
        let obj: any = {}
        let returnSiteCodeList = []
        let noNext = [] // 记录无下一个节点的节点、
        for (let j = 0; j < edges.length; j++) {
          // 判断当前节点是某个节点的源头节点
          if (nodes[i].id == edges[j].sourceNodeId) {
            console.log(nodes[i], 'nodes[i]')
            if (nodes[i].type == 'realTask') {
              returnSiteCodeList.push(edges[j].targetNodeId)
              obj['returnSiteCode'] = returnSiteCodeList
              obj['siteCode'] = nodes[i].properties.siteCode
              obj['siteType'] = 2
              obj['siteSerial'] = nodes[i].properties.siteSerial
              obj['tbTechnologicalProcessSiteMatterAddDtos'] =
                nodes[i].properties.tbTechnologicalProcessSiteMatterAddDtos
            } else {
              obj['nextSiteCode'] = edges[j].targetNodeId
              obj['siteCode'] = nodes[i].properties.siteCode
              obj['siteType'] = 1
              obj['siteSerial'] = nodes[i].properties.siteSerial
              obj['tbTechnologicalProcessSiteMatterAddDtos'] =
                nodes[i].properties.tbTechnologicalProcessSiteMatterAddDtos
            }
          } else {
            noNext.push({
              id: nodes[i].id,
              type: nodes[i].type,
              siteCode: nodes[i].properties.siteCode,
              siteSerial: nodes[i].properties.siteSerial,
              tbTechnologicalProcessSiteMatterAddDtos:
                nodes[i].properties.tbTechnologicalProcessSiteMatterAddDtos
            })
          }
          console.log(noNext, 'noNext')
          let length = edges.length > nodes.length ? nodes.length : edges.length
          if (noNext.length == length) {
            if (noNext[0].type == 'realTask') {
              obj['siteType'] = 2
            } else {
              obj['siteType'] = 1
            }
            obj['siteCode'] = noNext[0].siteCode
            obj['siteSerial'] = noNext[0].siteSerial
            obj['tbTechnologicalProcessSiteMatterAddDtos'] =
              noNext[0].tbTechnologicalProcessSiteMatterAddDtos
          }
        }
        TbTechnologicalProcessSiteAddDto.push(obj)
      }
      let TbTechnologicalProcessSiteAddDto1 = []
      console.log(
        TbTechnologicalProcessSiteAddDto,
        'TbTechnologicalProcessSiteAddDto'
      )
      for (let j = 0; j < TbTechnologicalProcessSiteAddDto.length; j++) {
        let obj: any = {}
        let retrunCode = []
        for (let i = 0; i < nodes.length; i++) {
          if (nodes[i].id == TbTechnologicalProcessSiteAddDto[j].nextSiteCode) {
            if (nodes[i].type == 'realTask') {
              obj['maintenanceSiteCode'] = nodes[i].text.value
              obj['siteCode'] = TbTechnologicalProcessSiteAddDto[j].siteCode
              obj['siteSerial'] = TbTechnologicalProcessSiteAddDto[j].siteSerial
              obj['tbTechnologicalProcessSiteMatterAddDtos'] =
                TbTechnologicalProcessSiteAddDto[
                  j
                ].tbTechnologicalProcessSiteMatterAddDtos
              obj['siteType'] = TbTechnologicalProcessSiteAddDto[j].siteType
            } else {
              obj['nextSiteCode'] = nodes[i].text.value
              obj['siteCode'] = TbTechnologicalProcessSiteAddDto[j].siteCode
              obj['siteSerial'] = TbTechnologicalProcessSiteAddDto[j].siteSerial
              obj['tbTechnologicalProcessSiteMatterAddDtos'] =
                TbTechnologicalProcessSiteAddDto[
                  j
                ].tbTechnologicalProcessSiteMatterAddDtos
              obj['siteType'] = TbTechnologicalProcessSiteAddDto[j].siteType
            }
          }
          let retrunCodeList =
            TbTechnologicalProcessSiteAddDto[j].returnSiteCode
          if (retrunCodeList) {
            for (let k = 0; k < retrunCodeList.length; k++) {
              if (nodes[i].id == retrunCodeList[k]) {
                retrunCode.push(nodes[i].text.value)
                obj['returnSiteCode'] = retrunCode.join(',')
                obj['siteCode'] = TbTechnologicalProcessSiteAddDto[j].siteCode
                obj['siteSerial'] =
                  TbTechnologicalProcessSiteAddDto[j].siteSerial
                obj['tbTechnologicalProcessSiteMatterAddDtos'] =
                  TbTechnologicalProcessSiteAddDto[
                    j
                  ].tbTechnologicalProcessSiteMatterAddDtos
                obj['siteType'] = TbTechnologicalProcessSiteAddDto[j].siteType
              }
            }
          } else {
            obj['siteCode'] = TbTechnologicalProcessSiteAddDto[j].siteCode
            obj['siteSerial'] = TbTechnologicalProcessSiteAddDto[j].siteSerial
            obj['tbTechnologicalProcessSiteMatterAddDtos'] =
              TbTechnologicalProcessSiteAddDto[
                j
              ].tbTechnologicalProcessSiteMatterAddDtos
            obj['siteType'] = TbTechnologicalProcessSiteAddDto[j].siteType
          }
        }
        obj['technologicalProcessCode'] =
          datas.submitForm.technologicalProcessCode
        TbTechnologicalProcessSiteAddDto1.push(obj)
      }
      console.log(
        TbTechnologicalProcessSiteAddDto1,
        'TbTechnologicalProcessSiteAddDto1'
      )
      console.log(datas.submitForm)
      const data = lookData.datas
      const params = {
        ...datas.submitForm,
        investmentSiteCode: data.investmentSiteCode, //投入站唯一标识
        produceSiteCode: data.produceSiteCode, //产出站唯一标识
        siteCount: TbTechnologicalProcessSiteAddDto1.length,
        tbTechnologicalProcessSiteAddDtos: TbTechnologicalProcessSiteAddDto1,
        json: JSON.stringify(lookData.catData)
      }
      if (params.investmentSiteCode == '') {
        ElMessage({
          message: '请设置投入站！',
          type: 'error'
        })
        return false
      }
      if (params.produceSiteCode == '') {
        ElMessage({
          message: '请设置产出站！',
          type: 'error'
        })
        return false
      }
      if (params.investmentSiteCode == params.produceSiteCode) {
        ElMessage({
          message: '投入站和产出站不能相同！',
          type: 'error'
        })
        return false
      }
      if (TbTechnologicalProcessSiteAddDto1.length == 0) {
        ElMessage({
          message: '请设置工艺流程',
          type: 'error'
        })
        return false
      }
      // TbTechnologicalProcessSiteAddDto1.forEach(ele => {
      //   if (ele.siteCode == '' || !ele.siteCode) {
      //     ElMessage({
      //       message: '请设置工站标识',
      //       type: 'error'
      //     })
      //     return
      //   }
      // })
      if (technologicalProcessCode) {
        updata(params, id)
      } else {
        add(params)
      }
    })
  }
  import { useCallback } from '@/hooks/useCallback'
  const add = async (params: any) => {
    const data = await proxy.$api.processFlow.addprocessFlow(params)
    const datas = useCallback(data, $t('lang.common.AddSuc') + '!')
    if (datas) {
      emit('success')
    }
  }
  const updata = async (params: any, id?: number) => {
    if (id) params.id = id
    const data = await proxy.$api.processFlow.update(params)
    const datas = useCallback(data, $t('lang.common.EditSuc') + '!')
    if (datas) {
      emit('success')
    }
  }
</script>

<style scoped lang="less">
  :deep(.el-select) {
    width: 100%;
  }
  :deep(.el-form-item__label) {
    width: 120px !important;
  }
  .logic {
    width: 100%;
    height: 500px;
  }
  :deep(.el-dialog__footer) {
    position: relative;
    z-index: 1000;
  }
</style>
