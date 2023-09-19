<template>
  <el-dialog
    v-model="dialogVisible"
    :title="datas.title"
    width="40%"
    draggable
    :before-close="close"
  >
    <el-form :model="datas.submitForm" class="logBox" label-width="140px">
      <el-row>
        <el-col :span="12">
          <el-form-item :label="$t('lang.log.userName') + '：'">
            <div class="value">【{{ data.userName }}】</div>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('lang.log.title') + '：'">
            <div class="value">【{{ data.title }}】</div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item :label="$t('lang.log.type') + '：'">
            <div class="value">【{{ typeList[data.businessType].name }}】</div>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('lang.log.status') + '：'">
            <div class="value">【{{ statusList[data.status] }}】</div>
          </el-form-item>
        </el-col>
      </el-row>

      <el-col :span="22">
        <el-form-item :label="$t('lang.log.method') + '：'">
          <div class="value">【{{ data.method }}】</div>
        </el-form-item>
      </el-col>
      <el-col :span="22">
        <el-form-item :label="$t('lang.log.param') + '：'">
          <div class="value">【{{ data.param }}】</div>
        </el-form-item>
      </el-col>
      <el-col :span="22">
        <el-form-item :label="$t('lang.log.errorMsg') + '：'">
          <div class="value">【{{ data.errorMsg }}】</div>
        </el-form-item>
      </el-col>
      <el-col :span="22">
        <el-form-item :label="$t('lang.log.operTime') + '：'">
          <div class="value">【{{ data.operTime }}】</div>
        </el-form-item>
      </el-col>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="close">
          {{ $t('lang.common.comfirm') }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
  import { ref, reactive, nextTick, getCurrentInstance } from 'vue'
  import { ElMessage } from 'element-plus'
  const { proxy } = getCurrentInstance() as any
  const $t = proxy.$t
  interface SubmitForm {
    id: Number | null
    supplierName: String
    supplierCode: String
  }
  interface Datas {
    title: string
    submitForm?: any
    loading: boolean
  }
  interface Props {
    logDetails: any
  }
  const typeList: any[] = [
    {
      id: 0,
      name: $t('lang.log.businessTypes0')
    },
    {
      id: 1,
      name: $t('lang.log.businessTypes1')
    },
    {
      id: 2,
      name: $t('lang.log.businessTypes2')
    },
    {
      id: 3,
      name: $t('lang.log.businessTypes3')
    }
  ]
  const statusList: any[] = [
    $t('lang.log.statusList0'),
    $t('lang.log.statusList1')
  ]
  const { logDetails } = defineProps<Props>()
  let data = { ...logDetails }
  const emit = defineEmits(['success', 'close'])
  console.log(data)
  let datas: Datas = reactive({
    title: $t('lang.log.infoTits'),
    loading: false
  })
  const dialogVisible = ref(true)
  const close = () => {
    emit('close')
  }
</script>

<style scoped lang="less">
  :deep(.el-dialog__footer) {
    text-align: center;
  }
  .value {
    word-break: break-all;
  }
  .logBox {
    max-height: 600px;
    overflow-y: scroll;
  }

  :deep(.el-dialog__footer) {
    text-align: center;
  }

  .value {
    word-break: break-all;
  }

  *::-webkit-scrollbar {
    width: 12px;
    height: 12px;
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
</style>
