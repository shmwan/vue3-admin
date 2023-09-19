<template>
  <el-dialog
    class="DiyDialog"
    v-model="dialogVisible"
    :title="datas.title"
    width="40%"
    draggable
    :close-on-click-modal="false"
    :before-close="handleCancel"
  >
    <el-tabs
      v-model="datas.activeName"
      class="demo-tabs"
      @tab-click="handleClick"
    >
      <el-tab-pane :label="$t('lang.InventLog.Basic')" name="first">
        <BasicInfo :BasicList="datas.detailsList"></BasicInfo>
      </el-tab-pane>
      <el-tab-pane :label="$t('lang.InventLog.History')" name="second">
        <HistoryInfo
          :BasicList="datas.detailsList"
          :LogList="datas.logList"
        ></HistoryInfo>
      </el-tab-pane>
    </el-tabs>
    <template #footer>
      <span class="dialog-footer">
        <el-button
          type="primary"
          @click="handleCancel"
          :loading="datas.loading"
        >
          {{ $t('lang.common.close') }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
  import {
    ref,
    reactive,
    nextTick,
    getCurrentInstance,
    onMounted,
    computed
  } from 'vue'
  import { ElMessage } from 'element-plus'
  import type { TabsPaneContext } from 'element-plus'
  import { useDictData } from '@/hooks/dictMinxin'
  import BasicInfo from './BasicInfo.vue'
  import HistoryInfo from './HistoryInfo.vue'
  console.log()

  const { proxy } = getCurrentInstance() as any
  const $t = proxy.$t

  interface Datas {
    title: string
    detailsList: any
    activeName: string
    logList: any
    loading: boolean
  }
  interface Props {
    editData: any
  }

  const { editData } = defineProps<Props>()
  let data = { ...editData }
  const emit = defineEmits(['success', 'close'])

  let datas: Datas = reactive({
    title: $t('lang.InventLog.WLdetails'),
    detailsList: {},
    activeName: 'first',
    logList: {},
    loading: false
  })
  const { getDictData } = useDictData()

  onMounted(async () => {})
  const dialogVisible = ref(true)
  const handleCancel = () => {
    emit('close')
  }
  const getDetails = (id: any) => {
    proxy.$api.matter.weightInfo(id).then((res: any) => {
      datas.loading = false
      if (res.code == 200) {
        datas.detailsList = res.data
        // datas.detailsList.img = config().imgBaseUrl + res.data.img
        // datas.detailsList.scanImg = config().imgBaseUrl + res.data.scanImg
      } else {
        ElMessage({
          message: res.message + '!',
          type: 'error'
        })
      }
    })
  }
  const getLogList = (id: any) => {
    let params = {
      weighId: id
    }
    proxy.$api.matter.weightLogList(params).then((res: any) => {
      if (res.code == 200) {
        datas.logList = res.data
        datas.logList.forEach((item: any) => {
          item.timeList = item.createTime.trim().split(/\s+/)
        })
        datas.logList.reverse()
      } else {
        ElMessage({
          message: res.message + '!',
          type: 'error'
        })
      }
    })
  }
  const handleClick = (tab: TabsPaneContext, event: Event) => {
    console.log(tab, event)
  }
  getDetails(data.id)
  getLogList(data.id)
</script>

<style scoped lang="less">
  .el-form {
    margin: 10px 0;
  }

  .el-form-item__content {
    flex-wrap: nowrap;
  }
  :deep(.el-tabs__content) {
    height: 500px;
    overflow-y: scroll;
  }
</style>
<style>
  .DiyDialog .el-dialog__body {
    padding: 0 30px;
  }
  .el-dialog__footer {
    text-align: center;
  }
  .DiyDialog .el-select {
    width: 100%;
  }

  .DiyDialog .el-form-item__content {
    flex-wrap: nowrap;
  }
  *::-webkit-scrollbar-button {
    width: 0px;
    height: 0px;
    display: none;
  }

  *::-webkit-scrollbar-corner {
    background-color: transparent;
  }

  *::-webkit-scrollbar-thumb {
    border: 4px solid rgba(0, 0, 0, 0);
    height: 6px;
    border-radius: 25px;
    background-clip: padding-box;
    background-color: rgba(0, 0, 0, 0.3);
  }
  *::-webkit-scrollbar {
    width: 12px;
    height: 12px;
  }
</style>
