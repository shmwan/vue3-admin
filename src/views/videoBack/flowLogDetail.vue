<template>
  <el-dialog v-model="dialogVisible" :title="datas.title" width="30%" draggable :before-close="close">
    <el-form :model="datas.submitForm" class="formBox" label-width="200px">
      <el-col :span="20" v-for="(item, index) in rowDatas" :key="index">
        <el-form-item :label="index + '：'">
          <div class="value">【{{ item }}】</div>
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

interface Datas {
  title: String
  submitForm?: any
  loading: Boolean
}
interface Props {
  logDetails: any
}
const { logDetails } = defineProps<Props>()
let data = { ...logDetails }
const emit = defineEmits(['success', 'close'])
console.log(data)
const rowDatas = JSON.parse(data.rawData)
// const rowDatas = JSON.parse('string');
console.log(rowDatas, 'rowDatas')
let datas: Datas = reactive({
  title: $t('lang.flowLog.sourceLog'),
  loading: false
})
const dialogVisible = ref(true)
const close = () => {
  emit('close')
}
  // const formatDatas = (data: any) => {
  //     let Obj = JSON.parse(data)
  //     let str = ''
  //     for (let k in Obj) {
  //         str += `${k}:${Obj[k]}  `
  //     }
  //     console.log(str, 'data.rawData');
  //     return str
  // }
  // formatDatas(data.rawData)
</script>

<style scoped lang="less">
.formBox {
  height: 600px;
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
  background-color: rgba(0, 0, 0, 0.30);
}
</style>
