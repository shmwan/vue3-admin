<template>
  <div class="container">
    <el-row class="containerTop" :gutter="10" justify="space-between">
      <el-col :span="6" :lg="6">
        <el-row :gutter="10">
          <el-col :span="8" :lg="8" :xl="6"><img src="@/assets/matter/Chart.png" /></el-col>
          <el-col :span="12" class="rowText">
            <div>
              <span class="rowNum">{{ totalNum.totalNum }}</span>次
            </div>
            <p>{{ $t('lang.matterWeigh.accomplishWeigh') }}</p>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="6" :lg="6">
        <el-row>
          <el-col :span="8" :lg="8" :xl="6"><img src="@/assets/matter/Tick.png" /></el-col>
          <el-col :span="12" class="rowText">
            <div>
              <span class="rowNum">{{ totalNum.passNum }}</span>次
            </div>
            <p>{{ $t('lang.matterWeigh.weighPass') }}</p>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="6" :lg="6">
        <el-row>
          <el-col :span="8" :lg="8" :xl="6"><img src="@/assets/matter/Close.png" /></el-col>
          <el-col :span="12" class="rowText">
            <div>
              <span class="rowNum">{{ totalNum.unusualNum }}</span>次
            </div>
            <p>{{ $t('lang.matterWeigh.weighError') }}</p>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="6" :lg="6">
        <el-row>
          <el-col :span="8" :lg="8" :xl="6">
            <div ref="main" style="width: 100%; height: 100%"></div>
          </el-col>
          <el-col :span="12" class="rowText">
            <div>
              <span class="rowNum">{{ totalNum.passRate }}</span>%
            </div>
            <p>{{ $t('lang.matterWeigh.weighPassRate') }}</p>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-row class="containerCenter" justify="space-between" :gutter="10">
      <el-col :span="12">
        <el-card class="box-card">
          <template #header>
            <div class="card-header">
              <div style="display:flex">
                <span style="flex:1">{{ $t('lang.matterWeigh.matterWeigh') }}</span>
                <div style="flex:2;display:flex;justify-content: flex-end;align-items: center;">
                  <span>{{ $t('lang.matterWeigh.weighDevice') }}</span>
                  <el-select v-model="value" style="margin-left: 20px;" placeholder="Select" @change="changeDevice">
                    <el-option v-for="item in deviceList" :key="item.sn" :label="item.name" :value="item.sn" />
                  </el-select>
                </div>
              </div>
              <!-- <el-row justify="space-between">
                <el-col :span="10" :lg="12" :xl="14"><span>{{ $t('lang.matterWeigh.matterWeigh') }}</span></el-col>
                <el-col :span="10" :lg="12" :xl="8">
                  <span>{{ $t('lang.matterWeigh.weighDevice') }}
                  </span>
                  <el-select v-model="value" style="margin-left: 20px; width: 60%" placeholder="Select"
                    @change="changeDevice">
                    <el-option v-for="item in deviceList" :key="item.sn" :label="item.name" :value="item.sn" />
                  </el-select></el-col>
              </el-row> -->
            </div>
          </template>
          <el-button color="#4F71FF" @click="openMore">
            <i class="share" />
            <span style="
                              margin-left: 10px;
                              color: #fff;
                              font-size: 12px;
                              font-weight: 400;
                            ">{{ $t('lang.matterWeigh.weighMore') }}</span>
          </el-button>
          <p class="card-text">
            ({{ $t('lang.matterWeigh.weighMoreMessage') }})
          </p>
          <div class="card-content">
            <el-row justify="space-between" style="margin-top:10px">
              <el-col :span="12" :lg="24">{{ $t('lang.matterWeigh.matterPagId') }} : {{ formData.form.pagId }}</el-col>
            </el-row>
            <el-row justify="space-between" style="margin-top:10px">
              <el-col :span="12" :lg="24">{{ $t('lang.matterWeigh.matterTime') }}: {{ formData.form.weighTime }}</el-col>
            </el-row>
            <el-row justify="space-between" style="margin-top:30px">
              <el-col :span="17"> <el-row justify="space-between">
                  <el-col :span="8" class="card-content-title">{{ $t('lang.matterWeigh.barcode') }}：<br>
                    <p>{{ formData.form.grossWeight }}</p>kg
                  </el-col>
                  <el-col :span="8" class="card-content-title">{{ $t('lang.matterWeigh.actualWeight') }}：<br>
                    <p>{{ formData.form.actualWeight }}</p>kg
                  </el-col>
                  <el-col :span="8" class="card-content-title">{{ $t('lang.matterWeigh.quantity') }}：<br>
                    <p>{{ formData.form.quantity }}</p>{{ $t('lang.matterWeigh.unit') }}
                  </el-col>
                </el-row>
                <div class="card-content-result">
                  {{ $t('lang.matterWeigh.result') }}：
                  <span style="color: #66cc00;">{{ checkStatus }}</span>，{{ $t('lang.matterWeigh.resultEnd') }}
                </div>
              </el-col>
              <el-col :span="7"><img class="cargo-img" src="@/assets/matter/cargoGif.png" /></el-col>
            </el-row>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="box-card">
          <template #header>
            <div class="card-header">
              <span>{{ $t('lang.matterWeigh.matterVideo') }}</span>
            </div>
          </template>
          <div class="card-video">
            <VideoPlayer :video-url="videoUrl" :live="true"></VideoPlayer>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row class="containerCenter" justify="space-between">
      <el-col :span="24">
        <el-card class="box-card">
          <template #header>
            <div class="card-header">
              <el-row justify="space-between">
                <el-col :span="12" :md="8" :lg="11" :xl="12"><span>{{ $t('lang.matterWeigh.matterRecheck')
                }}</span></el-col>
                <el-col :span="12" :md="16" :lg="13" :xl="12">
                  <el-input v-model="searchForm.matter" style="width: 300px; margin-right: 20px" clearable
                    :placeholder="$t('lang.matterWeigh.matterRecheckMessage')" />
                  <el-button type="primary" :icon="Search" @click="searchData">{{
                    $t('lang.matterWeigh.query') }}</el-button>
                  <el-select v-model="searchForm.deviceCode" style="margin-left: 20px;width: 30%;" placeholder="请选择"
                    @change="searchData">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select></el-col>
              </el-row>
            </div>
          </template>
          <el-table :data="datas.data" table-layout="fixed" max-height="270">
            <el-table-column type="index"> </el-table-column>
            <el-table-column prop="weighTime" :label="$t('lang.matterWeigh.weighTime')" />
            <el-table-column prop="matterCode" :label="$t('lang.matterWeigh.matterCode')" />
            <el-table-column prop="pagId" label="PAG ID" />
            <el-table-column prop="checkStatusStr" :label="$t('lang.matterWeigh.matterStatus')" />
            <el-table-column :label="$t('lang.matterWeigh.operate')">
              <template #default="scope">
                <el-button type="primary" round @click="recheckDialog(scope.row)">{{ $t('lang.matterWeigh.recheck')
                }}</el-button>
              </template>
            </el-table-column>
          </el-table>
          <table-page :pageSize="searchForm.pageSize" :pageTotal="datas.total" @pageFunc="handleTableChange">
          </table-page>
        </el-card>
      </el-col>
    </el-row>
    <!-- 多件称重 -->
    <el-dialog :title="$t('lang.matterWeigh.weighMore')" v-model="dialogVisible" width="45%">
      <el-divider style="margin-top: -10px; margin-bottom: 15px"></el-divider>
      <el-row type="flex">
        <el-col :span="12" class="dialog-title">
          <span style="width: 2px; border: 2px solid #5473e8; margin-right: 20px"></span>
          {{ $t('lang.matterWeigh.weighMoreMsg') }}
        </el-col>
      </el-row>
      <el-row type="flex" :gutter="20" style="margin-top: 20px">
        <el-col :span="7" :md="7" :lg="6" :xl="6" :sm="8">
          <div class="dialog-text">{{ $t('lang.matterWeigh.weighMoreLabel') }}：</div>
        </el-col>
        <el-col :span="6" :pull="2">
          <el-input v-model="multipleExternalWeight"
            :placeholder="$t('lang.matterWeigh.multipleExternalWeight')"></el-input>
        </el-col>
        <el-col :span="4" :pull="2">
          <div class="dialog-text">KG</div>
        </el-col>
      </el-row>
      <el-row type="flex" :gutter="20" style="margin-top: 30px">
        <el-col :span="12" class="dialog-title">
          <span style="width: 2px; border: 2px solid #5473e8; margin-right: 20px"></span>
          {{ $t('lang.matterWeigh.matterScan') }}
        </el-col>
      </el-row>
      <div style="
                        background-color: #fafafa;
                        padding: 20px;
                        border-radius: 2px;
                        margin: 20px;
                      ">
        <el-row type="flex" :gutter="20" style="margin-top: 20px" v-for="( item, index ) in  matterList ">
          <el-col :span="2">
            <div class="dialog-data">{{ index }}</div>
          </el-col>
          <el-col :span="10">
            <div class="dialog-data">{{ item.matterCode }}( {{ $t('lang.matterWeigh.matterCode') }})</div>
          </el-col>
          <el-col :span="12">
            <div class="dialog-data">{{ item.pagId }}(PAG ID)</div>
          </el-col>
        </el-row>
      </div>
      <template #footer>
        <span class="dialog-footer" style="text-align: center">
          <el-button @click="cancelMatter">{{ $t('lang.matterWeigh.cancel') }}</el-button>
          <el-button type="primary" @click="startWeigh">{{ $t('lang.matterWeigh.startWeigh') }}</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 重复称重提示 -->
    <el-dialog :title="$t('lang.matterWeigh.weighAgin')" v-model="messageVisible" width="35%">
      <el-divider style="margin-top: -10px; margin-bottom: 15px"></el-divider>
      <el-row type="flex" :gutter="20" style="margin-top: 20px">
        <el-col :span="2">
          <img src="@/assets/matter/msg.png" />
        </el-col>
        <el-col :span="20">
          <div class="message-text">该物料 (PAG ID：{{ formData.form.pagId }}， 料号：{{ formData.form.matterCode }} ) ，已于 {{
            formData.form.lastWeighTime
          }} 在 {{ formData.form.lastDeviceName }} 设备上称重,称重结果为
            <span v-if="formData.form.lastStatus > 2" style="color:red">异常</span>
            <span v-if="formData.form.lastStatus > 2">, 复核结果为<span v-if="formData.form.lastStatus == 3">:
                复核可正常入库</span><span v-if="formData.form.lastStatus == 4">: 复核异常不可入库</span><span
                v-if="formData.form.lastStatus == 5">: 复核异常可入库</span></span>
            <span v-if="formData.form.lastStatus == 1">正常</span><span v-if="formData.form.lastStatus == 2"
              style="color:red">异常</span>
            <div v-if="formData.form.lastStatus == 2">请至复核列表进行复核及处置。点击<el-button text type="success"
                @click="recheckDialog()">此处</el-button>可进行复核处理。</div>
            <div v-if="formData.form.lastStatus == 1">本次称重结果为 <span
                v-if="formData.form.currentStatus == 1">正常，已生成到货单。</span><span
                v-if="formData.form.currentStatus == 2"><span style="color:red">异常</span>，请与仓库联系！</span></div>
          </div>
        </el-col>
      </el-row>
      <template #footer>
        <span class="dialog-footer" style="text-align: center">
          <el-button @click="messageVisible = false">关 闭</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 称重异常提示 本次称重异常 -->
    <el-dialog title="称重异常提示" v-model="errorVisible" width="35%">
      <el-divider style="margin-top: -10px; margin-bottom: 15px"></el-divider>
      <el-row type="flex" :gutter="20" style="margin-top: 20px">
        <el-col :span="2">
          <img src="@/assets/matter/msg.png" />
        </el-col>
        <el-col :span="20" v-if="deviceStatus == 0">
          <div class="message-text">该物料 (PAG ID：{{ formData.form.pagId }}， 料号{{ formData.form.matterCode }} )
            ，称重 <span v-if="formData.form.currentStatus == 2"><span
                style="color:red">异常</span></span>，您可以将物料先放到复核区域，点击"关闭"后，继续称重其他物料。
            <!-- <div>也可以至复核页面进行复核处置，点击此处将跳转至复核页</div> -->
            <!-- 说明：当前提示页关闭后，才能以作后续物料称重。 -->
          </div>
        </el-col>
        <el-col :span="20" v-if="deviceStatus == 1">
          <div class="message-text">称重
            <span v-if="formData.form.currentStatus == 2"><span
                style="color: red">异常</span></span>，您可以将物料先放到复核区域，点击"关闭"后，继续称重其他物料。
            <!-- <div>也可以至复核页面进行复核处置，点击此处将跳转至复核页</div> -->
            <!-- 说明：当前提示页关闭后，才能以作后续物料称重。 -->
          </div>
        </el-col>
      </el-row>
      <template #footer>
        <span class="dialog-footer" style="text-align: center">
          <el-button @click="closeErrorDialog()">关 闭 </el-button>
        </span>
      </template>
    </el-dialog>
    <!--物料复核 -->
    <el-dialog title=" 物料复核" v-model="recheckVisible" width="50%">
      <el-divider style="margin-top: -10px; margin-bottom: 15px"></el-divider>
      <el-form ref="ruleFormRef" :model="datas.submitForm" label-width="100px" :rules="rules">
        <el-row justify="center">
          <el-col :span="10">
            <el-form-item :label="$t('lang.matterWeigh.matterName')">
              {{ recheckForm.matterName }}
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item :label="$t('lang.matterWeigh.matterCode')">
              {{ recheckForm.matterCode }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row justify="center">
          <el-col :span="10">
            <el-form-item :label="$t('lang.matterWeigh.supplierName')">
              {{ recheckForm.supplierName }}
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item :label="$t('lang.matterWeigh.matterType')">
              {{ recheckForm.matterTypeStr }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row justify="center">
          <el-col :span="10">
            <el-form-item :label="$t('lang.matterWeigh.deliveryNoteNumber')">
              {{ recheckForm.deliveryNoteNumber }}
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item :label="$t('lang.matterWeigh.pagId')">
              {{ recheckForm.pagId }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row justify="center">
          <el-col :span="10">
            <el-form-item :label="$t('lang.matterWeigh.weighTime')">
              {{ recheckForm.weighTime }}
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item :label="$t('lang.matterWeigh.weighDevice')">
              {{ recheckForm.deviceName }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row justify="center">
          <el-col :span="10">
            <el-form-item :label="$t('lang.matterWeigh.weighResult')">
              <!-- <el-button style="margin-left: 10px" type="success" :icon="Picture">查看照片</el-button> -->
              <el-image style="width: 100px; height: 100px;margin-left:30px" :src="url" :zoom-rate="1.2"
                :preview-src-list="srcList" :initial-index="4" fit="cover" />
            </el-form-item>
          </el-col>
          <el-col :span="10"></el-col>
        </el-row>
        <el-row justify="center">
          <el-col :span="6">
            <el-form-item :label="$t('lang.matterWeigh.barCode')">
              {{ recheckForm.grossWeight }}kg
            </el-form-item>
          </el-col>
          <el-col :span="6" style="color: red">
            <el-form-item :label="$t('lang.matterWeigh.actualWeight')">
              <span> {{ recheckForm.actualWeight }}kg</span>
            </el-form-item></el-col>
          <el-col :span="20">
            <el-form-item label="异常原因">
              <span v-if="recheckForm.multipleWeighTag == 1">{{ $t('lang.matterWeigh.weighMore') }}，</span>{{
                $t('lang.matterWeigh.weighErrorMsg') }}{{
    recheckForm.weightLowerLimit
  }}g~+{{
  recheckForm.weightSuperiorLimit
}}g）
            </el-form-item>
          </el-col>
        </el-row>
        <el-row justify="center">
          <el-col :span="9">
            <el-form-item :label="$t('lang.matterWeigh.checkUserNo')">
              <el-input style="width: 100%" v-model="datas.submitForm.checkUserNo" />
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item :label="$t('lang.matterWeigh.checkUserName')">
              <el-input style="width: 100%" v-model="datas.submitForm.checkUserName" />
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-button style="margin-left: 10px" type="success" @click="checkUser(
              datas.submitForm.checkUserNo,
              datas.submitForm.checkUserName
            )
              " :icon="Check">{{ $t('lang.matterWeigh.check') }}</el-button>
          </el-col>
        </el-row>
        <el-row justify="center">
          <el-col :span="10">
            <el-form-item :label="$t('lang.matterWeigh.checkResult')" prop="status">
              <el-select :disabled="identity" v-model="datas.submitForm.status" placeholder="Select">
                <el-option v-for="  item   in   resultOptions  " :key="item.value" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10"></el-col>
        </el-row>
        <el-row justify="center">
          <el-col :span="20">
            <el-form-item :label="$t('lang.matterWeigh.checkRemark')" prop="checkRemark">
              <el-input :disabled="identity" v-model="datas.submitForm.checkRemark" :rows="4" type="textarea"
                :placeholder="$t('lang.matterWeigh.checkRemarkPla')" />
            </el-form-item>
          </el-col>
          <el-col :span="10"></el-col>
        </el-row>
      </el-form>
      <template #footer>
        <span class="dialog-footer" style="text-align: center">
          <el-button @click="resetForm(ruleFormRef)">{{ $t('lang.matterWeigh.cancel') }}</el-button>
          <el-button type="primary" @click="recheck(ruleFormRef)">{{ $t('lang.matterWeigh.checkOperate') }}</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import { ElMessage, ElMessageBox, FormRules, FormInstance } from 'element-plus'
import { Search, Check, Picture } from '@element-plus/icons-vue'
//  按需引入 echarts
import * as echarts from 'echarts'
import SocketStomp from '@/utils/socket'
import {
  ref,
  onMounted,
  getCurrentInstance,
  watch,
  reactive,
  watchEffect,
  onUnmounted,
  computed
} from 'vue'

import TablePage from '@/components/common/ElementPage.vue'
import { useScoketData } from '@/stores/scoket'
import VideoPlayer from '@/components/video-player/VideoPlayer.vue'
let videoUrl = $ref('')
let url = ref('')
let srcList: any = ref([])
const { proxy } = getCurrentInstance()
const $t = proxy.$t
const ruleFormRef = ref<FormInstance>()
const rules = reactive<FormRules>({
  status: [
    {
      required: true,
      message: '复核结果不能为空',
      trigger: 'blur'
    }
  ],
  checkRemark: [
    {
      required: true,
      message: '复核备注不能为空',
      trigger: 'blur'
    }
  ],
  desc: [
    { required: true, message: 'Please input activity form', trigger: 'blur' },
  ],
})
const ruleForm = reactive({
  desc: '',
})
let value: any = $ref('') // 当前选择设备
const main = ref() // 使用ref创建虚拟DOM引用，使用时用main.value
let form: any = reactive({})
let formData: any = reactive({
  form: {},
});
let deviceStatus = ref(0) // 	0:非多件称重，1:多件称重
let dialogVisible = ref(false) // 多件称重
let messageVisible = ref(false) // 重复称重
let errorVisible = ref(false) // 称重异常
let identityVisible = ref(false)
let identity = ref(true)
// let { deviceList } = config() // 设备列表
let deviceList = $ref([])// 设备列表
// let deviceList = ref([
//   {
//     value: '001001',
//     label: '001001'
//   },
//   {
//     value: '大件称重',
//     label: '大件称重'
//   },
//   {
//     value: '中小件称重',
//     label: '中小件称重'
//   }
// ])
let multipleExternalWeight = ref('') // 外包装重量
const resultOptions = [
  {
    value: 3,
    label: '复核可正常入库'
  },
  {
    value: 4,
    label: '复核异常不可入库'
  },
  {
    value: 5,
    label: '复核异常可入库'
  }
]
onMounted(() => {
  // 获取称重设备列表
  let params = {
    type: 'weight'
  }
  proxy?.$api.matter.getDeviceList(params).then((res: any) => {
    if (res.code == 200) {
      deviceList = res.data
      value = deviceList[0].sn
      getChannel(value)// 获取直播通道ID
      proxy?.$api.matter.getDeviceStatus(value).then((res: any) => {
        let resStatus = res.data.status == 0 ? '单件称重' : '多件称重' // 机器状态
        let currentStatus = deviceStatus.value == 0 ? '单件称重' : '多件称重' // 页面状态
        // deviceStatus 0:非多件称重，1:多件称重
        if (deviceStatus.value != res.data.status) {
          ElMessageBox.confirm(
            `当前设备为${resStatus}，是否要切换至${currentStatus}?`,
            '提示',
            {
              cancelButtonText: '关闭',
              showConfirmButton: false,
              type: 'warning',
            },
          ).then(() => {
          })
            .catch(() => {
            })
        }
      })
    }
  })
  searchTotalData()
  init()
  // disconnect
  Socket.init()

})
let totalNum: any = ref({
  passNum: 0, //通过数量
  totalNum: 0, //称重总数
  unusualNum: 0, //异常数量
  passRate: 0 // 通过率
})
// 切换设备
const changeDevice = (params: any) => {
  getChannel(params)
}
// 获取直播通道ID
const getChannel = (data: any) => {
  let channelParams = {
    type: "2",
    sns: [data]
  }
  proxy?.$api.matter.getChannelList(channelParams).then((res: any) => {
    if (res.code == 200) {
      getVideoUrl(res.data[0].channelIds[0]) // 根据通道ID获取直播流地址
    }
  })

}
//获取直播流地址
const getVideoUrl = (channelId: String) => {
  let params = {
    channelId: channelId,
  }
  proxy?.$api.matter.getVideoUrl(params).then((res: any) => {
    if (res.code == 200) {
      videoUrl = res.data[0].address
    }
  })
}
// 查询统计数据
const searchTotalData = () => {
  proxy?.$api.matter
    // { deviceCode: value }
    .getWeighToday()
    .then((res: any) => {
      totalNum.value = res.data
      if (totalNum.value.passNum == 0 || totalNum.value.totalNum == 0) {
        totalNum.value.passRate = 0
      } else if (totalNum.value.passNum != 0 && totalNum.value.totalNum != 0) {
        totalNum.value.passRate = (
          (totalNum.value.passNum / totalNum.value.totalNum) *
          100
        ).toFixed(2)
      }
      init()
    })
}
const stores = useScoketData()
const baseScoket = config().baseScoket
const Socket = new SocketStomp(baseScoket, '/matter/msg/weigh')

const data = computed(() => {
  return stores.getScoketData
})
let matterList: any = reactive([])
// 同一个消息无法再次触发
watch(
  () => data.value,
  (data) => {
    console.log(data, "value");
    if (data) {
      checkMatter(data);
      searchTotalData()
    }
  },
  { immediate: false, deep: true }
);
let checkStatus = $ref('免检')
function checkMatter(data: any) {
  let item = eval("(" + data + ")")
  console.log("----------------checkMatter---------------------")
  console.log(item)
  // deviceStatus.value 0:单件 1:多件
  // lastStatus 上次称重状态 0:无，1:正常，2:异常 3:复核可正常入库，4:复核异常不可入库，5:复核异常可入库
  // currentStatus 本次称重状态 1:正常，2:异常
  if (item.currentDeviceCode == value) { // 判断推送消息是当前设备
    if (item.errorMsg == '') { // 没有异常消息
      console.log("🚀 ~ file: matter.vue:624 ~ checkMatter ~ deviceStatus.value:", deviceStatus.value)
      if (deviceStatus.value == 0) { // 单件称重
        formData.form = JSON.parse(JSON.stringify(item));
        formData.form.grossWeight = item.grossWeight / 1000
        formData.form.actualWeight = item.actualWeight / 1000
        if (formData.form.lastStatus != 0) { // 重复称重
          messageVisible.value = true;
        } else if (formData.form.lastStatus == 0 && formData.form.currentStatus == 2) { //本次称重异常
          errorVisible.value = true; // 称重异常提示
        }
      } else if (deviceStatus.value == 1 && item.lastStatus == 0) { // 多件称重
        matterList.push(item)
      } else if (deviceStatus.value == 1 && item.lastStatus == 1) { // 多件重复称重
        ElMessageBox.confirm(
          `重复称重`,
          '提示',
          {
            cancelButtonText: '关闭',
            showConfirmButton: false,
            type: 'warning',
          },
        )
      }
      if (formData.form.matterCode) {
        // materialNumber    string   料号   必需
        // materialCategory   string   物料类别   必需
        let params = {
          materialNumber: formData.form.matterCode,
          materialCategory: formData.form.productClassification
        }
        proxy?.$api.matter.getCheckLevel(params).then((res: any) => {
          if (res.code == 200) {
            checkStatus = res.data.description
          }
        })
      }
    } else {
      // ElMessage({
      //   message: `称重异常`,
      //   type: 'warning',
      // })
      ElMessageBox.confirm(
        item.errorMsg,
        '提示',
        {
          cancelButtonText: '关闭',
          showConfirmButton: false,
          type: 'warning',
        }
      ).then(() => {
      })
        .catch(() => {
        })
    }

  }
}
// 待复核列表称重设备下拉框
const options: any = [
  {
    value: '当前设备',
    label: '当前设备'
  },
  {
    value: '',
    label: '全部设备'
  }
]
// 多件称重弹框
function openMore() {
  formData.form = {}
  dialogVisible.value = true
  deviceStatus.value = 1
  let param = {
    deviceCode: value,
    status: 1
  }
  proxy?.$api.matter.updateDeviceStatus(param).then((res: any) => { })
}
function cancelMatter() {
  dialogVisible.value = false
  deviceStatus.value = 0
  matterList = []
  let param = {
    deviceCode: value,
    status: deviceStatus.value
  }
  proxy?.$api.matter.updateDeviceStatus(param).then((res: any) => { })
}
let recheckVisible = ref(false)
let recheckForm: any = $ref({})
// 复核弹框
function recheckDialog(row?: any) {
  srcList.value = []
  let id = ''
  if (row) {
    id = row.id
  } else {
    id = formData.form.lastWeighId
  }
  proxy.$api.matter.weightInfo(id).then((res: any) => {
    if (res.code == 200) {
      recheckForm = { ...res.data }
      recheckForm.actualWeight = recheckForm.actualWeight / 1000
      recheckForm.grossWeight = recheckForm.grossWeight / 1000
      url.value = config().imgBaseUrl + recheckForm.img
      recheckForm.scanImg = config().imgBaseUrl + recheckForm.scanImg
      srcList.value.push(url.value)
      srcList.value.push(recheckForm.scanImg)
      console.log(srcList.value)
    } else {
      ElMessage({
        message: res.message + '!',
        type: 'error'
      })
    }
  })
  recheckVisible.value = true
}
const init = () => {
  // 基于准备好的dom，初始化echarts实例
  var myChart = echarts.init(main.value, 'null')
  var option = {
    series: [
      {
        type: 'gauge',
        min: 0,
        max: 100,
        splitNumber: {
          show: false
        },
        progress: {
          show: true,
          width: 5,
          itemStyle: {
            color: '#4F71FF'
          }
        },
        axisLabel: {
          show: false,
          color: '#fff'
        },
        axisLine: {
          lineStyle: {
            width: 5,
            color: [
              [0.6, '#F0F3F8'],
              [0.8, '#F0F3F8'],
              [1, '#F0F3F8']
            ]
          }
        },
        // splitLine: {
        //     lineStyle: {
        //         color: '#4F71FF',
        //     },
        // },
        splitLine: {
          // 分隔线
          length: 10, // 属性length控制线长
          lineStyle: {
            // 属性lineStyle（详见lineStyle）控制线条样式
            color: '#4F71FF'
          }
        },
        axisTick: {
          show: false
        },
        pointer: {
          // 指针
          shadowColor: 'auto',
          //默认透明
          shadowBlur: 10,
          length: '50%',
          width: 1
        },
        // itemStyle: {
        //     color: '#4F71FF',
        //     borderColor: '#4F71FF',
        //     borderWidth: 2
        // },
        // anchor: {
        //     show: true,
        //     showAbove: true,
        //     size: 6,
        //     itemStyle: {
        //         borderWidth: 1,
        //         borderColor: '#4F71FF'
        //     }
        // },
        itemStyle: {
          color: '#4F71FF',
          borderColor: '#4F71FF',
          borderWidth: 1
        },
        anchor: {
          show: true,
          showAbove: true,
          size: 5,
          itemStyle: {
            borderWidth: 2,
            borderColor: '#4F71FF'
          }
        },
        detail: {
          formatter: '{value} %'
        },
        data: [
          {
            value: totalNum.value.passRate,
            title: {
              color: '#4F71FF'
              // 标题颜色
            },
            detail: {
              show: false
            }
          }
        ]
      }
    ]
  }
  // 使用刚指定的配置项和数据显示图表。
  myChart.setOption(option)
}
let datas: any = reactive({
  loading: false,
  data: [],
  total: 0,
  submitForm: {
    ids: null,
    checkUserName: '',
    checkUserNo: '',
    checkRemark: '',
    status: 3
  }
})
interface SearchFroms {
  matter: string
  pageNo: number
  pageSize: number
  businessType: string
  weighEndTime: string
  weighStartTime: string | null
  deviceCode: string
}
let searchForm: SearchFroms = reactive({
  matter: '', // 料号或者物料名称
  pageNo: 1,
  pageSize: 10,
  businessType: '1', //业务类型 1:待复核
  weighEndTime: '', // 称重结束时间
  weighStartTime: '', // 称重开始时间
  deviceCode: '' // 当前设备
})

function closeErrorDialog() {
  errorVisible.value = false;
  searchData()
}
// 查询数据待复核列表
const searchData = () => {
  datas.loading = true
  let params = {
    ...searchForm
  }
  if (params.deviceCode == '当前设备') {
    params.deviceCode = value
  } else if (params.deviceCode == '全部设备') {
    params.deviceCode = ''
  }
  proxy?.$api.matter.getWeighList(params).then((res: any) => {
    let data = res.data.records
    datas.loading = false
    datas.data = data
    datas.total = res.data.total
  })
}
searchData()
/**
 *分页切换
 * @param {} pag
 * @param {*} filters
 * @param {*} sorter
 */
const handleTableChange = (pag: any, filters: any) => {
  searchForm.pageNo = pag.pageNo
  searchForm.pageSize = pag.pageSize
  searchData()
}
// 物料复核
const recheck = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (!valid) return
    datas.submitForm.ids = [recheckForm.id]
    proxy?.$api.matter.matterCheck(datas.submitForm).then((res: any) => {
      if (res.code == 200) {
        ElMessage({
          message: res.message + '!',
          type: 'success'
        })
        resetForm(formEl)
        searchData()
      } else {
        ElMessage({
          message: res.message + '!',
          type: 'error'
        })
      }
    })
  })
}
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  recheckVisible.value = false
  formEl.resetFields()
  datas.submitForm.checkUserNo = ''
  datas.submitForm.checkUserName = ''
}
function checkUser(no: any, userName: any) {
  if (no && userName) {
    proxy?.$api.matter
      .empinfo({ empno: no, fname: userName })
      .then((res: any) => {
        if (res.data) {
          identity.value = false
        } else {
          identity.value = true
          ElMessage({
            message: '用户不存在！',
            type: 'error'
          })
        }
      })
  } else {
    ElMessage({
      message: '用请输入员工编号，员工名称！',
      type: 'error'
    })
  }
}
// 开始称重
function startWeigh() {
  let list: any = []
  let pagIdList: any = []
  matterList.map((item: any) => {
    list.push(item.weighId)
    pagIdList.push(item.pagId)
  })
  let param = {
    deviceCode: value,
    multipleExternalWeight: multipleExternalWeight.value,
    weighIdList: list
  }
  if (list.length > 0) {
    proxy?.$api.matter.multipleWeigh(param).then((res: any) => {
      formData.form = res.data
      formData.form.pagId = pagIdList.join(",")
      formData.form.grossWeight = res.data.grossWeight / 1000
      formData.form.actualWeight = res.data.actualWeight / 1000
      dialogVisible.value = false
      if (res.data.currentStatus == 2) {
        errorVisible.value = true;
      }
    })
  }
}
onUnmounted(() => {
  if (Socket) {
    Socket.disconnect();
  }
})
</script>
<style lang="less" scoped>
.container {
  font-family: PingFangSC-Regular, PingFang SC;
}

.containerTop {
  padding: 30px;
  background-color: #fff;

  .rowText {
    display: flex;
    flex-direction: column;
    align-content: space-around;
    align-items: flex-start;
    justify-content: center;
    padding: 10px;
  }

  .rowNum {
    font-size: 42px;
    font-weight: 400;
    color: #1a1d2a;
    line-height: 32px;
  }

  p {
    font-size: 14px;
    font-weight: 400;
    color: #666666;
    line-height: 32px;
  }
}

.containerCenter {
  margin-top: 30px;
}

.page-pro-pagination {
  margin-top: 10px;
  padding: 0 20px 20px;
  background: #fff;
  justify-content: flex-end;

  :last-child {
    margin-right: 0;
  }
}

.card-text {
  display: inline-block;
  margin-left: 20px;
  font-size: 14px;
  font-weight: 400;
  color: #40476e;
  line-height: 22px;
}

.box-card {
  height: 450px;

  span {
    font-size: 16px;
    font-weight: 400;
    color: #1c1e20;
    line-height: 25px;
  }
}

.card-content {
  margin-top: 35px;
  font-size: 14px;
  font-weight: 400;
  color: #40476e;
  line-height: 22px;

  .card-content-result {
    margin-top: 50px;
    font-size: 14px;
    font-weight: 400;
    color: #40476e;
    line-height: 22px;
  }

  .card-content-title {
    font-size: 14px;
    font-weight: 400;
    color: #666666;
    line-height: 22px;

    p {
      display: inline-block;
      font-size: 32px;
      font-weight: 400;
      color: #4f71ff;
      line-height: 50px;
      letter-spacing: 1px;
    }
  }
}

.cargo-img {
  width: 188px;
  height: 188px;
}

.dialog-title {
  font-size: 16px;
  font-weight: 400;
  color: #333c4f;
  line-height: 22px;
}

.dialog-text {
  font-size: 14px;
  font-weight: 400;
  color: #666666;
  line-height: 32px;
}

.dialog-data {
  font-size: 14px;
  font-weight: 400;
  color: #40476e;
  line-height: 20px;
}

.message-text {
  font-size: 14px;
  font-weight: 400;
  color: #1a1d2a;
  line-height: 32px;
}

.share {
  background: url('@/assets/matter/share.png') center no-repeat; // 注意此处的url，在这里引入自己的图片
  font-size: 16px;
  background-size: cover;
}

.share:before {
  content: '替';
  font-size: 16px;
  visibility: hidden;
}

.card-video {
  width: 740px;
  height: 355px;
}

.card-header {
  height: 25px;
}
</style>