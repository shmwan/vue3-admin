<template>
  <div class="editForm">
    <div class="title">
      属性面板

      <img @click="cancel" src="../../assets/img/logicflow/delBtn.png" alt="" />
    </div>
    <div class="line"></div>
    <el-form
      :model="datas.submitForm"
      label-width="100px"
      :rules="rules"
      ref="ruleFormRef"
    >
      <el-col>
        <el-form-item label="工站标识：" prop="siteCode">
          <el-input v-model="datas.submitForm.siteCode" maxlength="30" />
        </el-form-item>
      </el-col>
      <div class="line"></div>
      <el-col>
        <el-form-item label="指定视觉计数站点序号：" prop="siteSerial">
          <el-input v-model="datas.submitForm.siteSerial" maxlength="30" />
        </el-form-item>
      </el-col>
      <div class="line"></div>
      <el-col>
        <el-row
          v-for="(item, index) in datas.submitForm
            .tbTechnologicalProcessSiteMatterAddDtos"
          :key="index"
        >
          <el-col :span="12" style="margin-right: 10px">
            <el-form-item label="选择物料编号：" prop="mingcheng">
              <el-input
                v-model="item.matterCode"
                maxlength="30"
                clearable
                placeholder="选择物料编号"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="用量：" prop="ruleName">
              <el-input
                max="100"
                autosize
                v-model="item.dosage"
                @input="
                  e => {
                    item.dosage = numMinMax(e, 0, 100)
                  }
                "
              />
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-button @click="del" class="del" link>删除</el-button>
          </el-col>
        </el-row>
      </el-col>
      <el-col>
        <div @click="add" class="add">+ 增加</div>
      </el-col>
      <div class="line"></div>
      <el-col>
        <div class="btnGroup">
          <el-button class="save" @click="cancel" style="margin-right: 10px"
            >取消</el-button
          >
          <el-button @click="save(ruleFormRef)" class="save" type="primary"
            >保存</el-button
          >
        </div>
      </el-col>
    </el-form>
  </div>
</template>

<script setup lang="ts">
  import { ElMessageBox, FormRules, FormInstance } from 'element-plus'
  import { numMinMax } from '@/utils/regularExpress.js'

  let datas = reactive({
    submitForm: {
      siteCode: '', //站标识
      siteSerial: '', //站点序号
      tbTechnologicalProcessSiteMatterAddDtos: [] //物料列表
    }
  })
  const ruleFormRef = ref<FormInstance>()
  const rules = reactive<FormRules>({
    siteCode: [
      {
        required: true,
        message: '请输入工站标识',
        trigger: 'blur'
      }
    ],
    siteSerial: [
      {
        required: true,
        message: '请输入工站标识',
        trigger: 'blur'
      }
    ]
  })

  /***
   * 接受父组件传值
   */
  interface Props {
    nodeData: any
  }
  const props = defineProps<Props>()
  const nodeData = props.nodeData.properties
  watch(
    () => nodeData,
    val => {
      datas.submitForm.siteCode = val.siteCode
      datas.submitForm.siteSerial = val.siteSerial
      datas.submitForm.tbTechnologicalProcessSiteMatterAddDtos =
        val.tbTechnologicalProcessSiteMatterAddDtos || []
    },
    { deep: true, immediate: true }
  )

  const add = () => {
    datas.submitForm.tbTechnologicalProcessSiteMatterAddDtos.push({
      matterCode: '',
      dosage: null
    })
  }
  const del = (index: number) => {
    datas.submitForm.tbTechnologicalProcessSiteMatterAddDtos.splice(index, 1) //移除指定索引处的元素。如果没有索引指定，则移除指定列表中的第一个元素。或者，移除指定索引处的元素，并将其替换为空。或者，将空列表替换为指定元素，如果指定了元素名称或索引。或者，将空列表作为指定元素从列表中删除一个元素。或者，
  }
  const emits = defineEmits(['saveData', 'cancel'])
  const save = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate(valid => {
      if (!valid) return
      emits('saveData', datas.submitForm)
    })
  }
  const cancel = () => {
    emits('cancel')
  }
</script>
<style lang="less" scoped>
  .editForm {
    box-sizing: border-box;
    padding: 20px;
    .title {
      font-size: 16px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333c4f;
      line-height: 22px;
      border-left: 3px solid #5473e8;
      padding-left: 15px;
      position: relative;
      img {
        position: absolute;
        top: 0;
        right: 10px;
        cursor: pointer;
      }
    }
    .line {
      width: 414px;
      border-top: 1px solid #e8e8e8;
      margin: 20px 0;
    }
    :deep(.el-form-item__label) {
      width: auto !important;
    }
    .el-col {
      margin-right: 0;
    }
    .del {
      margin: 5px 0 0 15px;
      cursor: pointer;
      color: #1890ff;
    }
    .add {
      width: 415px;
      height: 32px;
      border-radius: 2px;
      border: 1px dashed #1890ff;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #1890ff;
      line-height: 32px;
      text-align: center;
      cursor: pointer;
    }
    .btnGroup {
      display: flex;
      margin: 0 auto;
    }
    .save {
      width: 110px;
      height: 32px;
      border-radius: 4px;
      margin: 0 auto;
      .el-button--primary {
        width: 100%;
      }
    }
  }
</style>
