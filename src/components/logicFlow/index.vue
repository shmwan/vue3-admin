<template>
  <div class="control">
    <ControlVue :lf="lf" v-if="!isShow"></ControlVue>
  </div>
  <div class="container">
    <edit
      class="editForm"
      :nodeData="nodeData"
      @saveData="saveData"
      @cancel="cancel"
      v-if="dialogVisible"
    />
    <div class="editInfo" ref="container"></div>
    <el-form
      class="change"
      :model="datas.submitForm"
      label-width="100px"
      ref="ruleFormRef"
    >
      <el-row>
        <el-col :span="10">
          <el-form-item label="投入站：" prop="investmentSiteCode">
            <el-select
              :disabled="isShow"
              v-model="datas.submitForm.investmentSiteCode"
              placeholder="请选择投入站"
              @visible-change="visibleChange(0)"
              clearable
            >
              <el-option
                v-for="item in datas.dataList"
                :key="item.id"
                :label="item.name"
                :value="item.name"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="产出站：" prop="produceSiteCode">
            <el-select
              :disabled="isShow"
              v-model="datas.submitForm.produceSiteCode"
              placeholder="请选择产出站"
              @visible-change="visibleChange(1)"
              clearable
            >
              <el-option
                v-for="item in datas.dataList"
                :key="item.id"
                :label="item.name"
                :value="item.name"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!-- <el-button @click="lookData">查看数据</el-button> -->
  </div>
</template>

<script setup>
  import LogicFlow from '@logicflow/core'
  import edit from './edit.vue'
  import ControlVue from './LFComponents/Control.vue'
  import '@logicflow/core/dist/style/index.css'
  import { DndPanel, SelectionSelect } from '@logicflow/extension'
  import '@logicflow/extension/lib/style/index.css'
  import UserTask from './UserTask'
  import realTask from './realTask'

  let lf = $ref(null)
  let emits = defineEmits(['$_catData'])
  let dialogVisible = $ref(false)
  let nodeData = $ref(null)
  const container = $ref('container')
  let isShow = $ref(false)
  const props = defineProps({
    isSilentMode: Boolean
  })
  isShow = props.isSilentMode
  if (!isShow) {
    LogicFlow.use(DndPanel)
    LogicFlow.use(SelectionSelect)
  }
  const datas = reactive({
    submitForm: {
      investmentSiteCode: '', //投入站唯一标识
      produceSiteCode: '', //产出站唯一标识
      siteCode: '', //站标识
      siteSerial: '', //站点序号
      tbTechnologicalProcessSiteMatterAddDtos: [] //物料列表
    },
    dataList: []
  })
  onMounted(() => {
    lf = new LogicFlow({
      container: container,
      keyboard: {
        enabled: true
      },
      isSilentMode: isShow,
      grid: true
    })
    lf.register(UserTask)
    lf.register(realTask)
    lf.setTheme({
      polyline: {
        stroke: '#1890FF',
        strokeWidth: 1,
        outlineColor: '#f00'
      }
    })

    $_rander({})
    lf.on('node:click', ({ data }) => {
      nodeData = data
      if (isShow) {
        return
      }
      dialogVisible = false
      setTimeout(() => {
        dialogVisible = true
      }, 0)
    })
    lf.off('node:dbclick')
  })
  const lookData = () => {
    const catData = lf.getGraphData()
    console.log(catData)
    emits('$_catData', catData)
    return {
      datas: datas.submitForm,
      catData
    }
  }
  const $_setShow = flag => {
    isShow = flag
    if (!isShow) {
      lf.extension.dndPanel.setPatternItems([
        {
          type: 'UserTask',
          label: '关键站',
          text: '',
          icon: require('../../assets/img/logicflow/set.png'),
          className: 'important-node'
        },
        {
          type: 'realTask',
          label: '维修站',
          text: '',
          icon: require('../../assets/img/logicflow/real.png'),
          className: 'importantNode1'
        }
      ])
    }
  }
  const $_rander = (data, allData) => {
    lf.render(data)
    if (allData) {
      datas.submitForm.investmentSiteCode = allData.investmentSiteCode
      datas.submitForm.produceSiteCode = allData.produceSiteCode
    }
  }

  // 导出父组件方法供子组件使用 （必须）
  defineExpose({
    lookData,
    $_rander,
    $_setShow
  })
  const visibleChange = type => {
    const catData = lf.getGraphData().nodes
    let nodes = catData
    let dataList = []
    if (type == 1) {
      dataList = nodes.filter(
        ele =>
          ele.text.value != datas.submitForm.investmentSiteCode &&
          ele.type == 'UserTask'
      )
    } else {
      dataList = nodes.filter(
        ele =>
          ele.text.value != datas.submitForm.produceSiteCode &&
          ele.type == 'UserTask'
      )
    }
    let list = []
    dataList.forEach(ele => {
      list.push({
        name: ele.text.value,
        id: ele.id
      })
    })
    datas.dataList = list
  }
  // 保存数据
  const saveData = data => {
    lf.setProperties(nodeData.id, data)
    const nodeModel = lf.getNodeModelById(nodeData.id)
    nodeModel.updateText(data.siteCode)
    dialogVisible = false
  }
  const cancel = () => {
    dialogVisible = false
  }
</script>

<style lang="less" scoped>
  .control {
    width: 100%;
    height: 34px;
    overflow: hidden;
    background: #fafafa;
  }
  .container {
    width: 100%;
    height: 100%;
    position: relative;
    .editInfo {
      width: 100%;
      height: 100%;
      position: relative;
    }
    .editForm {
      position: absolute;
      right: 20px;
      top: 20px;
      z-index: 100;
      width: 449px;
      height: 437px;
      background: #ffffff;
      box-shadow: -4px 0px 8px 0px rgba(221, 221, 221, 0.5);
      border-radius: 8px;
      overflow-y: auto;
      overflow-x: hidden;
    }
    .change {
      position: absolute;
      top: 20px;
      left: 100px;
    }
  }
  // 任务的样式
  :deep(.important-node) {
    width: 94px;
    height: 57px;
    background: rgba(24, 144, 255, 0.3);
    border-radius: 8px;
    border: 1px solid #1890ff;
    margin: 30px 15px 30px 15px;
    .lf-dnd-shape {
      margin: 0px 0 0 0px;
    }
  }
  :deep(.importantNode1) {
    width: 94px;
    height: 57px;
    background: rgba(255, 121, 23, 0.3);
    border-radius: 8px;
    border: 1px solid #ff7917;
    margin: 30px 15px 30px 15px;
    .lf-dnd-shape {
      margin: 0px 0 0 0px;
    }
  }

  .icon {
    width: 1em;
    height: 1em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
  }
</style>
