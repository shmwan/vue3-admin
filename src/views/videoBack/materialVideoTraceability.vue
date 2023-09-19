<template>
  <div class="material-video-traceability" v-loading="loading">
    <div class="query-form">
      <el-card>
        <el-form :model="queryForm" ref="queryFormRef">
          <el-row :gutter="20">
            <el-col :span="3">
              <el-form-item prop="matterCategory">
                <el-select v-model="queryForm.matterCategory">
                  <el-option value="1" label="厂内物料流转：物料出库>>线体上料">
                  </el-option>
                  <el-option
                    value="2"
                    label="物料到货确认：物料到货清点>>物料入库"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item prop="rawDataKeyword">
                <el-input
                  v-model="queryForm.rawDataKeyword"
                  placeholder="请输入关键字"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item prop="matterCode">
                <el-input
                  v-model="queryForm.matterCode"
                  placeholder="请输入物料编号"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item prop="supplierKeyword">
                <el-input
                  v-model="queryForm.supplierKeyword"
                  placeholder="请输入供应商名称"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item prop="pagIds">
                <el-input
                  v-model="queryForm.pagIds"
                  placeholder="输入PAGID"
                  clearable
                />
              </el-form-item>
            </el-col>
            <template v-if="queryForm.matterCategory === '1'">
              <el-col :span="3">
                <el-form-item prop="receiveMatterNumber">
                  <el-input
                    v-model="queryForm.receiveMatterNumber"
                    placeholder="请输入领料单号"
                    clearable
                  />
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item prop="lineCode">
                  <el-select
                    v-model="queryForm.lineCode"
                    placeholder="请输入线体标识"
                    clearable
                  >
                    <el-option
                      v-for="item in lineCodeDictList"
                      :key="item.lineCode"
                      :label="item.lineCode"
                      :value="item.lineCode"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </template>
            <template v-if="queryForm.matterCategory === '2'">
              <el-col :span="3">
                <el-form-item prop="giveMatterNumber">
                  <el-input
                    v-model="queryForm.giveMatterNumber"
                    placeholder="请输入送货单号"
                    clearable
                  />
                </el-form-item>
              </el-col>
            </template>
            <el-col :span="6">
              <el-form-item prop="time">
                <el-date-picker
                  v-model="queryForm.time"
                  type="daterange"
                  start-placeholder="送货单更新开始时间"
                  end-placeholder="送货单更新结束时间"
                  value-format="YYYY-MM-DD HH:mm:ss"
                  :disabled-date="disabledDate"
                  @change="onDatePickerChange"
                />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item>
                <el-button
                  type="primary"
                  @click="onQuery"
                  :icon="Search"
                  :disabled="disabledOperate"
                >
                  查询
                </el-button>
                <el-button @click="onReset" :icon="Refresh"> 重置 </el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
    </div>
    <el-card class="associated-material-wrapper" v-if="isManual">
      <span class="associated-material-label">
        关联物料(<el-text type="primary">{{
          associatedMatterList.length
        }}</el-text
        >)
      </span>
      <el-scrollbar always>
        <div
          class="associated-material"
          v-if="!isManual || isAssociatedMaterialEmpty"
        >
          <div
            class="associated-material-item"
            v-for="item in associatedMatterList"
            :key="item.matterCode"
            :label="item.matterCode"
            :class="{ active: item.matterCode === currentMatterCode }"
            @click="onMatterClick(item)"
          >
            <div class="material-code">{{ item.matterCode }}</div>
            <!-- <div class="material-name">
              <el-tooltip :content="item.matterName">
                {{ item.matterName }}
              </el-tooltip>
            </div> -->
          </div>
        </div>
        <el-empty v-else description="暂无数据" />
      </el-scrollbar>
    </el-card>
    <el-card class="associated-video-wrapper" v-if="isCategoryEmpty">
      <template #header>
        <span>
          关联视频(<el-text type="primary">
            {{ associatedVideoList.length }} </el-text
          >)
        </span>
        <el-button type="primary" @click="onOpenDialogAutoConnect">
          自动拼接下载视频
        </el-button>
        <el-button type="primary" @click="onOpenDialog">
          拼接下载视频
        </el-button>
        <span>
          *单个视频选择时间范围最大为
          {{ maxSelectedOneTime / 60 / 1000 }} 分钟,勾选视频数量最大支持{{
            maxSelected
          }}
          个，拼接视频总时长最大支持
          {{ Math.floor(maxConnectTime / (60 * 60 * 1000)) }} 小时！
        </span>
      </template>
      <div class="selected-amount">
        <div>
          已选
          <el-text type="primary">
            {{ selectedAssociatedVideo.length }}
          </el-text>
          个视频
        </div>
        <el-link type="primary" :underline="false" @click="onClearSelected">
          清空
        </el-link>
      </div>
      <div class="associated-video-body">
        <div class="associated-video-timeline">
          <el-scrollbar>
            <div class="associated-video-nav">
              <div
                class="associated-video-nav-item"
                v-for="item in categoryList"
                :key="item.id"
                :class="{ current: item.id === currentCategory.id }"
                @click="onCategoryClick(item)"
              >
                {{ item.label }}
              </div>
            </div>
          </el-scrollbar>
          <el-checkbox-group
            v-model="selectedAssociatedVideo"
            v-if="isAssociatedVideoEmpty"
          >
            <div class="associated-video is-timeline">
              <div
                class="associated-video-item-wrapper"
                v-for="outerItem in associatedVideoList"
                :key="outerItem.id"
                :class="{
                  current: outerItem.id === currentAssociatedVideoOuterItem.id
                }"
              >
                <el-tabs type="border-card">
                  <el-tab-pane
                    v-for="item in outerItem.children"
                    :key="item.uniqueId"
                  >
                    <template #label>
                      <span @click="onAssociatedVideoClick(item, outerItem)">
                        {{ item.channelName }}
                      </span>
                    </template>
                    <div class="associated-video-item">
                      <div class="associated-video-item-operate">
                        <div class="operate-body">
                          <div class="operate-left">
                            <el-checkbox
                              :disabled="!item.channelId"
                              :label="item.uniqueId"
                              @change="
                                val => onAssociatedVideoChange(val, item)
                              "
                            >
                              <!-- <el-tooltip
                                :content="item.circulationProcessStr"
                                placement="top"
                              >
                                {{ item.circulationProcessStr }}
                              </el-tooltip> -->
                            </el-checkbox>
                          </div>
                          <!-- v-if="item.timeRangeVisble" -->
                          <div
                            class="operate-right"
                            v-show="item.timeRangeVisble"
                          >
                            <div class="label">视频范围：</div>
                            <el-time-picker
                              v-model="item.connectTimeRange"
                              is-range
                              start-placeholder="开始时间"
                              end-placeholder="结束时间"
                              value-format="x"
                              @change="val => onTimePickerSubmit(val, item)"
                              :clearable="false"
                            />
                          </div>
                        </div>
                      </div>
                      <div class="associated-video-item-container">
                        <div class="associated-video-item-cover">
                          <img :src="item.imageUrl" alt="" />
                          <el-icon
                            @click="onAssociatedVideoClick(item, outerItem)"
                          >
                            <i-ep-videoPlay />
                          </el-icon>
                        </div>
                      </div>
                    </div>
                  </el-tab-pane>
                </el-tabs>
                <div class="circulation-time">
                  <span>
                    {{ outerItem.circulationTime }}
                  </span>
                </div>
                <div class="circulation-process">
                  {{ outerItem.circulationProcessStr }}
                </div>
              </div>
            </div>
          </el-checkbox-group>
        </div>
        <!-- v-if="currentAssociatedVideo.videoUrl" -->
        <div class="associated-video-player-warpper">
          <el-affix target=".associated-video-body" :offset="90">
            <div class="associated-video-player">
              <div class="associated-video-player-title">
                {{ currentAssociatedVideo.channelName }}
              </div>
              <div class="associated-video-player-container">
                <VideoPlayer
                  v-if="
                    isAssociatedVideoEmpty && !!currentAssociatedVideo.videoUrl
                  "
                  :video-url="currentAssociatedVideo.videoUrl"
                  :live="false"
                  :loop="false"
                ></VideoPlayer>
              </div>
              <div class="associated-video-item-description">
                <el-descriptions :column="3">
                  <el-descriptions-item
                    v-for="iitem in currentAssociatedVideo.currentCirculationProcess"
                    :key="iitem.value"
                    :label="iitem.label"
                  >
                    <template v-if="iitem.value">
                      <span
                        class="el-tooltip__trigger"
                        v-if="iitem.value.length < 18"
                      >
                        {{ iitem.value }}</span
                      >
                      <el-tooltip
                        v-else
                        :content="iitem.value + ''"
                        placement="top"
                      >
                        {{ iitem.value }}
                      </el-tooltip>
                    </template>
                    <span v-else> -- </span>
                  </el-descriptions-item>
                </el-descriptions>
              </div>
            </div>
          </el-affix>
        </div>
      </div>
    </el-card>
    <pro-dialog
      v-model="dialogVisible"
      title="视频拼接下载流程指引："
      @on-submit="onSubmit"
      @on-cancel="onCancel"
    >
      <el-alert title="" type="info" :closable="false">
        <p>第1步：勾选想要下载的视频 >></p>
        <p>第2步：提交请求拼接视频文件 >></p>
        <p>第3步：前往下载中心查看视频拼接处理进度，处理完成后 >></p>
        <p>第4步：点击下载视频文件</p>
      </el-alert>
      <el-result icon="info">
        <template #title>
          已勾选：
          <el-text type="primary">
            {{ selectedVideoList.length }}
          </el-text>
          个视频文件，预计时长：<el-text type="danger">
            {{ formatterDurationAmount }}
          </el-text>
          ，视频拼接处理需要一定时间，是否确认？
        </template>
      </el-result>
    </pro-dialog>
    <pro-dialog
      v-model="dialogVisibleAutoConnect"
      title="自动拼接下载"
      @on-submit="onSubmitAutoConnect"
      @on-cancel="onCancelAutoConnect"
      class="auto-connect-dialog"
      :immediateUpdate="false"
    >
      <div class="auto-connect-dialog-container">
        <div class="auto-connect-title-tips">
          *系统自动选择距离物料事件发生位置最近的摄像头进行视频检索拼接
        </div>
        <div class="auto-connect-tips">
          共包含：<b> {{ associatedVideoList.length }} </b>
          个视频文件，预计总时长
          <b> {{ formatterAutoConnectAmount }} </b>
          ，视频拼接处理需要一定时间，是否确认？
        </div>
        <div class="auto-connect-body">
          <div class="slider-label">下载片段时长设置(秒)：</div>
          <div class="slider-content-wrapper">
            <div class="slider-content">
              <div
                class="slider-tooltip-item start-slider-tooltip"
                :style="startStyle"
              >
                <span class="slider-tooltip-text">
                  {{ formatTooltip(autoConnectTime[0]) }}
                </span>
              </div>
              <div
                class="slider-tooltip-item end-slider-tooltip"
                :style="endStyle"
              >
                <span class="slider-tooltip-text">
                  {{ formatTooltip(autoConnectTime[1]) }}
                </span>
              </div>
              <el-slider
                ref="sliderContent"
                v-model="autoConnectTime"
                range
                :max="finalTime"
                :marks="sliderMarks"
                :format-tooltip="formatTooltip"
                :show-tooltip="false"
              />
            </div>
          </div>
        </div>
      </div>
    </pro-dialog>
  </div>
</template>

<script setup lang="ts">
  import { Search, Refresh } from '@element-plus/icons-vue'
  import VideoPlayer from '@/components/video-player/VideoPlayer.vue'
  import proDialog from '@/components/pro-dialog.vue'
  let {
    materialVideoTraceability: {
      maxPlayTime,
      maxSelected,
      maxSelectedOneTime,
      maxConnectTime,
      compatibilityTime
    }
  } = config()
  import materialVideoTraceabilityDefault from '@/assets/matter/materialVideoTraceability-default.png'
  import DateUtils from '@/utils/dateUtils.js'
  const { proxy } = getCurrentInstance()
  let router = useRouter()
  let startTime = new Date(new Date(new Date().toLocaleDateString()).getTime())
  let endTime = new Date(
    new Date(new Date().toLocaleDateString()).getTime() +
      24 * 60 * 60 * 1000 -
      1
  )
  let loading = $ref(false)
  let queryFormRef = $ref(null)
  let matterCirculation = $ref([7, 4, 5, 9, 10])
  let arrivalConfirmation = $ref([1, 2, 3])
  let queryForm = $ref({
    matterCategory: '1',
    // matterCategory: '2',
    circulationProcessList: matterCirculation,
    // circulationProcessList: arrivalConfirmation,
    rawDataKeyword: '',
    // 物料编号
    matterCode: '',
    // 供应商
    supplierKeyword: '',
    // 包装编号
    pagIds: '',
    // 领料单号
    receiveMatterNumber: '',
    // 线体标识
    lineCode: '',
    // 送货单号
    giveMatterNumber: '',
    // 时间范围
    time: [
      DateUtils.format(startTime, 'yyyy-MM-dd hh:mm:ss'),
      DateUtils.format(endTime, 'yyyy-MM-dd hh:mm:ss')
    ]
  })
  let circulationProcessList = $computed(() => {
    return queryForm.matterCategory === '1'
      ? matterCirculation
      : arrivalConfirmation
  })
  let isManual = $ref(false)
  // 最近三个月
  let latest3Month = new Date().setTime(
    new Date().getTime() - 3600 * 1000 * 24 * 30 * 3
  )

  let disabledDate = (time: Date) => {
    return time.getTime() < latest3Month || time.getTime() > Date.now()
  }
  let disabledOperate = $ref(true)
  watch(queryForm, newVal => {
    let { time, matterCategory, circulationProcessList, ...rest } = newVal
    if (Object.values(rest).some(item => item !== '')) {
      disabledOperate = false
    } else {
      disabledOperate = true
    }
  })

  let onDatePickerChange = val => {
    val[1] = val[1].replace('00:00:00', '23:59:59')
    queryForm.time = val
  }

  let currentMatterCode = $ref('')
  let associatedMatterList = $ref([])
  let isAssociatedMaterialEmpty = $computed(
    () => associatedMatterList.length !== 0
  )

  watch(
    () => queryForm.matterCategory,
    newVal => {
      associatedMatterList = []
      associatedVideoList = []
      selectedAssociatedVideo = []
      currentMatterCode = ''
    }
  )
  let onMatterClick = item => {
    currentMatterCode = item.matterCode
    if (queryForm.matterCategory === '1') {
      onQueryLineCode()
    } else {
      onQuerySupplier()
    }
  }

  let onQuery = () => {
    getTraceabilityStockList()
  }
  let getTraceabilityStockList = () => {
    loading = true
    let params = {
      circulationProcessList: circulationProcessList,
      rawDataKeyword: queryForm.rawDataKeyword,
      matterCode: queryForm.matterCode,
      supplierKeyword: queryForm.supplierKeyword,
      pagIds: queryForm.pagIds,
      lineCode: queryForm.lineCode,
      receiveMatterNumber: queryForm.receiveMatterNumber,
      giveMatterNumber: queryForm.giveMatterNumber,
      startTime: queryForm.time[0],
      endTime: queryForm.time[1],
      pageSize: 99999
    }
    proxy.$api.materialVideoTraceability
      .getTraceabilityStockList(params)
      .then((res: any) => {
        associatedMatterList = res.data.records
        isManual = true
        if (!associatedMatterList.length) {
          lineCodeList = []
          supplierList = []
        } else {
          associatedVideoList = []
          selectedAssociatedVideo = []
          currentMatterCode = associatedMatterList[0].matterCode

          if (queryForm.matterCategory === '1') {
            onQueryLineCode()
          } else {
            onQuerySupplier()
          }
        }
      })
      .finally(() => {
        loading = false
      })
  }
  onMounted(async () => {
    // getTraceabilityStockList()
    getLineCodeListDict()
  })
  let currentCategory = $ref('')

  let lineCodeList = $ref([])
  let onQueryLineCode = () => {
    loading = true
    let params = {
      circulationProcessList: circulationProcessList,
      rawDataKeyword: queryForm.rawDataKeyword,
      // 物料编号
      matterCode: currentMatterCode,
      // 供应商
      supplierKeyword: queryForm.supplierKeyword,
      // 包装编号
      pagIds: queryForm.pagIds,
      // 领料单号
      receiveMatterNumber: queryForm.receiveMatterNumber,
      // 线体标识
      lineCode: queryForm.lineCode,

      startTime: queryForm.time[0],
      endTime: queryForm.time[1],
      pageSize: 99999
    }
    proxy.$api.materialVideoTraceability
      .getTraceabilityStockLineCodeList(params)
      .then((res: any) => {
        lineCodeList = res.data.map((item, index) => ({
          id: item + '-' + index,
          label: item
        }))
        currentCategory = lineCodeList[0] || ''
      })
      .finally(() => {
        loading = false
      })
  }
  let supplierList = $ref([])
  let onQuerySupplier = () => {
    loading = true
    let params = {
      circulationProcessList: circulationProcessList,
      rawDataKeyword: queryForm.rawDataKeyword,
      matterCode: currentMatterCode,
      supplierKeyword: queryForm.supplierKeyword,
      pagIds: queryForm.pagIds,
      giveMatterNumber: queryForm.giveMatterNumber,
      startTime: queryForm.time[0],
      endTime: queryForm.time[1],
      pageSize: 99999
    }
    proxy.$api.materialVideoTraceability
      .getTraceabilityStockSupplierList(params)
      .then((res: any) => {
        supplierList = res.data.map((item, index) => ({
          id: item + '-' + index,
          label: item
        }))
        currentCategory = supplierList[0] || ''
      })
      .finally(() => {
        loading = false
      })
  }

  let onReset = () => {
    queryFormRef.resetFields()
    associatedMatterList = []
    associatedVideoList = []
    lineCodeList = []
    supplierList = []
    selectedAssociatedVideo = []
    currentMatterCode = ''
    isManual = false
  }
  let selectedAssociatedVideo = $ref([])
  let onClearSelected = () => {
    selectedAssociatedVideo.length = 0
    computedDownLoadStatus()
  }

  let categoryList = $computed(() => {
    return queryForm.matterCategory === '1' ? lineCodeList : supplierList
  })
  let isCategoryEmpty = $computed(() => categoryList.length !== 0)
  let onCategoryClick = item => {
    currentCategory = item
  }
  watch(
    () => currentCategory,
    newVal => {
      if (!newVal) return
      getAssociatedVideoList(newVal)
    }
  )
  let lineCodeDictList = $ref([])
  let getLineCodeListDict = () => {
    proxy.$api.materialVideoTraceability.getLineCodeList().then((res: any) => {
      lineCodeDictList = res.data
    })
  }

  let currentAssociatedVideoOuterItem = $ref('')
  let currentAssociatedVideo = $ref('')
  watch(
    () => currentAssociatedVideo.uniqueId,
    newVal => {
      if (!newVal) return
      onGetVideoInfo(currentAssociatedVideo)
    }
  )
  let onAssociatedVideoClick = (item, outerItem) => {
    currentAssociatedVideo = item
    currentAssociatedVideoOuterItem = outerItem
  }
  let associatedVideoList = $ref([])
  let isAssociatedVideoEmpty = $computed(() => associatedVideoList.length !== 0)
  let getAssociatedVideoList = val => {
    loading = true
    let params = {
      circulationProcessList: circulationProcessList,
      rawDataKeyword: queryForm.rawDataKeyword,
      // 物料编号
      matterCode: currentMatterCode,
      // 供应商
      supplierKeyword: queryForm.supplierKeyword,
      // 包装编号
      pagIds: queryForm.pagIds,
      // 领料单号
      receiveMatterNumber: queryForm.receiveMatterNumber,
      // 线体标识
      lineCode: queryForm.lineCode,
      // 送货单号
      giveMatterNumber: queryForm.giveMatterNumber,

      startTime: queryForm.time[0],
      endTime: queryForm.time[1]
    }
    if (queryForm.matterCategory === '1') {
      params.lineCode = val.label
      params.receiveMatterNumber = queryForm.receiveMatterNumber
    } else {
      params.supplierKeyword = val.label
    }
    proxy.$api.materialVideoTraceability
      .getAssociatedVideoList(params)
      .then((res: any) => {
        associatedVideoList = res.data
        // 转换为树结构
        associatedVideoList = associatedVideoList.reduce((pre, acc) => {
          let channelIds = acc.videoDeviceInfos || []
          acc.children = []
          if (channelIds.length) {
            channelIds.forEach((item, index) => {
              acc.children.push({
                uniqueId: acc.id + '-' + item.channelId,
                channelId: item.channelId,
                imageUrl: item.imageUrl || materialVideoTraceabilityDefault,
                id: acc.id,
                matterCode: acc.matterCode,
                circulationProcess: acc.circulationProcess,
                circulationProcessStr: acc.circulationProcessStr,
                circulationProcessType: acc.circulationProcessType,
                circulationTime: acc.circulationTime,
                unifiedCategory: JSON.parse(acc.unifiedCategory),
                lineCode: acc.lineCode,
                supplierCode: acc.supplierCode,
                channelName: '摄像头' + (index + 1)
              })
            })
          } else {
            acc.children = [
              {
                uniqueId: acc.id,
                channelId: '',
                imageUrl: materialVideoTraceabilityDefault,
                id: acc.id,
                matterCode: acc.matterCode,
                circulationProcess: acc.circulationProcess,
                circulationProcessStr: acc.circulationProcessStr,
                circulationProcessType: acc.circulationProcessType,
                circulationTime: acc.circulationTime,
                unifiedCategory: JSON.parse(acc.unifiedCategory),
                lineCode: acc.lineCode,
                supplierCode: acc.supplierCode,
                channelName: '无摄像头'
              }
            ]
          }
          pre.push(acc)
          return pre
        }, [])
        // 每个节点属性整理
        associatedVideoList = associatedVideoList.map(outerItem => {
          outerItem.children = outerItem.children.map(item => {
            let unifiedCategory = item.unifiedCategory || {}

            let currentCirculationProcess = []

            if (item.circulationProcess === 1) {
              // 1:到货清点,
              // 单号:
              // 料号:
              // 供应商:
              // 数量:
              // 面单重量:
              // 实际重量:
              currentCirculationProcess = [
                {
                  label: '单号',
                  value: unifiedCategory.deliveryNoteNumber
                },
                {
                  label: '料号',
                  value: unifiedCategory.matterCode
                },
                {
                  label: '供应商',
                  value: unifiedCategory.supplierName
                },
                {
                  label: '数量',
                  value: unifiedCategory.quantity
                },
                {
                  label: '面单重量',
                  value: unifiedCategory.grossWeight
                },
                {
                  label: '实际重量',
                  value: unifiedCategory.actualWeight
                }
              ]
            } else if (item.circulationProcess === 2) {
              // 2: 物料质检,
              // 单号:
              // 料号:
              // 供应商:
              // 数量:
              // 面单重量:
              // 实际重量:
              // 包装号:
              currentCirculationProcess = [
                {
                  label: '单号',
                  value: unifiedCategory.qualityCheckNumber
                },
                {
                  label: '料号',
                  value: unifiedCategory.productionNo
                },
                {
                  label: '供应商',
                  value: item.supplierName
                },
                {
                  label: '数量',
                  value: unifiedCategory.checkAmount
                },
                {
                  label: '面单重量',
                  value: unifiedCategory.receiptNumber
                },
                {
                  label: '实际重量',
                  value: unifiedCategory.purchaseNumber
                },
                {
                  label: '包装号',
                  value: unifiedCategory.qmsCheckDate
                }
              ]
            } else if (item.circulationProcess === 3) {
              // 3: 物料仓库入库,

              // 送货单号
              // 料号
              // 库位
              // 储位
              // 数量
              // 商名称
              // PAGID
              // 时间

              currentCirculationProcess = [
                {
                  label: '送货单号',
                  value: unifiedCategory.sourceCode
                },
                {
                  label: '料号',
                  value: unifiedCategory.materialCode
                },
                {
                  label: '库位',
                  value: unifiedCategory.warehouseCode
                },
                {
                  label: '储位',
                  value: unifiedCategory.locationCode
                },
                {
                  label: '数量',
                  value: unifiedCategory.qty
                },
                {
                  label: '供应商名称',
                  value: unifiedCategory.vendorName
                },
                {
                  label: 'PAGIDS',
                  value: unifiedCategory.pagId
                }
                // {
                //   label: '时间',
                //   value: unifiedCategory.createDate
                // }
              ]
            } else if (item.circulationProcess === 4) {
              // 4: 厂内物料配送,
              // 领料单号
              // 领料数量
              // 料号
              // 产线
              // PAGIDS
              // 时间
              currentCirculationProcess = [
                {
                  label: '领料单',
                  value: unifiedCategory.matterBill
                },
                {
                  label: '领料数量',
                  value: unifiedCategory.amount
                },
                {
                  label: '料号',
                  value: unifiedCategory.materialNumber
                },
                {
                  label: '产线',
                  value: unifiedCategory.lineCode
                },
                {
                  label: 'PAGIDS',
                  value: unifiedCategory.pagIds
                },
                {
                  label: '车辆编号',
                  value: unifiedCategory.carId
                },
                {
                  label: '任务编号',
                  value: unifiedCategory.taskId
                }
                // {
                //   label: '时间',
                //   value: unifiedCategory.recordTime
                // }
              ]
            } else if (item.circulationProcess === 5) {
              // 5: 生产用料上料
              // 产线
              // 机台
              // 料号
              // 数量
              // 包装编号
              // 时间
              currentCirculationProcess = [
                {
                  label: '产线',
                  value: unifiedCategory.lineCode
                },
                {
                  label: '机台',
                  value: unifiedCategory.machineNo
                },
                {
                  label: '料号',
                  value: unifiedCategory.materialNumber
                },
                {
                  label: '数量',
                  value: unifiedCategory.amount
                },
                {
                  label: '包装编号',
                  value: unifiedCategory.packageNo
                }
                // {
                //   label: '时间',
                //   value: unifiedCategory.recordTime
                // }
              ]
            } else if (item.circulationProcess === 6) {
            } else if (item.circulationProcess === 7) {
              // 7: 物料仓库出库,
              // 领料单号
              // 料号
              // 库位
              // 储位
              // 数量
              // 产线
              // PAGID
              // 时间

              currentCirculationProcess = [
                {
                  label: '领料单号',
                  value: unifiedCategory.sourceCode
                },
                {
                  label: '料号',
                  value: unifiedCategory.materialCode
                },
                {
                  label: '库位',
                  value: unifiedCategory.warehouseCode
                },
                {
                  label: '储位',
                  value: unifiedCategory.locationCode
                },
                {
                  label: '数量',
                  value: unifiedCategory.qty
                },
                {
                  label: '产线',
                  value: unifiedCategory.lineCode
                },
                {
                  label: 'PAGIDS',
                  value: unifiedCategory.pagId
                }
                // {
                //   label: '时间',
                //   value: unifiedCategory.createDate
                // }
              ]
            } else if (item.circulationProcess === 8) {
              // 8: 生产用料过站,
              // 产线
              // 工站
              // SN号
              // 料号
              // 时间
              currentCirculationProcess = [
                {
                  label: '产线',
                  value: unifiedCategory.lineCode
                },
                {
                  label: '工站',
                  value: unifiedCategory.machineNo
                },
                {
                  label: 'SN号',
                  value: unifiedCategory.sn
                },
                {
                  label: '料号',
                  value: unifiedCategory.materialCode
                }
                // {
                //   label: '时间',
                //   value: unifiedCategory.recordTime
                // }
              ]
            } else if (item.item.circulationProcess === 9) {
              // 9: 生产用料叫料,
              // 领料单号:
              // 料号:
              // 领料产线:
              // 领料数量:
              currentCirculationProcess = [
                {
                  label: '领料单号',
                  value: unifiedCategory.matterBill
                },
                {
                  label: '料号',
                  value: unifiedCategory.materialNumber
                },
                {
                  label: '领料产线',
                  value: unifiedCategory.lineCode
                },
                {
                  label: '领料数量',
                  value: unifiedCategory.amount
                }
              ]
            } else if (item.circulationProcess === 10) {
              // 10: 物料发料单,
              // 领料单号:
              // 料号:
              // 领料产线:
              // 领料数量:
              // 机台工站标识
              // 记录时间
              currentCirculationProcess = [
                {
                  label: '叫料单号',
                  value: unifiedCategory.matterBill
                },
                {
                  label: '料号',
                  value: unifiedCategory.materialNumber
                },
                {
                  label: '领料产线',
                  value: unifiedCategory.lineCode
                },
                {
                  label: '领料数量',
                  value: unifiedCategory.amount
                },
                {
                  label: '机台工站标识',
                  value: unifiedCategory.machineNo
                }
                // {
                //   label: '记录时间',
                //   value: unifiedCategory.recordTime
                // }
              ]
            }
            item.circulationTime = item.circulationTime
            item.videoUrl = ''
            item.currentCirculationProcess = currentCirculationProcess
            item.circulationProcessType = item.circulationProcessType
            item.unifiedCategory = unifiedCategory
            item.timeRangeVisble = false
            item.connectTimeRange = ['', '']
            return item
          })
          return outerItem
        })
        currentAssociatedVideoOuterItem = associatedVideoList[0] || ''
        currentAssociatedVideo =
          (associatedVideoList[0] && associatedVideoList[0].children[0]) || ''
      })
      .finally(() => {
        loading = false
      })
  }
  let flatAssociatedVideoList = $computed(() => {
    let flatAssociatedVideoList = []
    associatedVideoList.forEach(item => {
      if (item.children && item.children.length > 0) {
        flatAssociatedVideoList = flatAssociatedVideoList.concat(item.children)
      }
    })
    return flatAssociatedVideoList
  })
  let disabledDownload = $ref(true)
  let selectedVideoList = $ref([])
  let durationAmount = $computed(() => {
    return selectedVideoList.reduce((pre, acc) => {
      return pre + acc.duration
    }, 0)
  })
  let formatterDurationAmount = $computed(() => {
    let Hour = Math.floor(durationAmount / (60 * 60 * 1000))
    let Minute = Math.floor((durationAmount % (60 * 60 * 1000)) / (60 * 1000))
    let Second = Math.floor(
      ((durationAmount % (60 * 60 * 1000)) % (60 * 1000)) / 1000
    )
    return `${Hour}小时${Minute}分${Second}秒`
  })
  let computedDownLoadStatus = () => {
    selectedVideoList = flatAssociatedVideoList.filter(item => {
      return selectedAssociatedVideo.includes(item.uniqueId)
    })
    if (
      selectedAssociatedVideo.length >= maxSelected ||
      durationAmount >= maxConnectTime ||
      selectedVideoList.length === 0
    ) {
      disabledDownload = true
    } else {
      disabledDownload = false
    }
  }
  let currentSelectedVideo = $ref({})
  let timeRange = $ref([])
  let onAssociatedVideoChange = async (val, item) => {
    if (val && item.connectTimeRange[0] === '') {
      timeRange = await onGetVideoTimeRange(item)
      currentSelectedVideo = { ...item }
      computedDownLoadStatus()
    } else {
      currentSelectedVideo = { ...item }
      computedDownLoadStatus()
    }
    item.timeRangeVisble = val
  }
  let onTimePickerSubmit = (val, item) => {
    let rest = item.connectTimeRange[1] - item.connectTimeRange[0]
    if (rest >= maxSelectedOneTime) {
      ElMessage({
        message: '选择时间范围最大为30分钟,请重新选时间范围。',
        type: 'warning',
        duration: 5000
      })
      item.connectTimeRange = currentSelectedVideo.connectTimeRange
    } else {
      item.duration = val[1] - val[0]
    }
    computedDownLoadStatus()
  }

  let onGetVideoInfo = async item => {
    if (!item.channelId) {
      ElMessage({
        message: '视频不存在',
        type: 'warning'
      })
      return
    }
    associatedVideoList = associatedVideoList.map(innerItem => {
      innerItem.videoUrl = ''
      return innerItem
    })
    // 如果直接点击视频
    if (!item.connectTimeRange[0] && !item.connectTimeRange[1]) {
      timeRange = await onGetVideoTimeRange(item)
    }
    let back_url = await onGetVideoUrl({ timeRange, item })
    item.videoUrl = back_url
  }
  let formatterProcessTime = time => {
    // 开始
    let startTime = new Date(time).getTime()
    // 最终开始时间
    let finalStartTime = (startTime - compatibilityTime * 1000) / 1000
    let endTime = (new Date(time).getTime() + maxPlayTime) / 1000
    return {
      startTime: finalStartTime,
      endTime
    }
  }
  let onGetVideoTimeRange = item => {
    return new Promise((resolve, reject) => {
      // loading = true
      // let halfTime = Math.floor(maxPlayTime / 2)
      let startTime = 0
      let endTime = 0
      let currentProcessTime = {}
      currentProcessTime = formatterProcessTime(item.circulationTime)
      startTime = currentProcessTime.startTime
      endTime = currentProcessTime.endTime
      item.connectTimeRange = [startTime * 1000, endTime * 1000]
      item.duration = item.connectTimeRange[1] - item.connectTimeRange[0]
      let params = {
        channelId: item.channelId,
        startTime: startTime,
        endTime: endTime
      }
      proxy.$api.materialVideoTraceability
        .getTimeRange(params)
        .then((res: any) => {
          resolve((res.data && res.data[0]) || [{ nStart: 0, nEnd: 0 }])
        })
        .finally(() => {
          // loading = false
        })
    })
  }
  let onGetVideoUrl = ({ timeRange, item }) => {
    return new Promise((resolve, reject) => {
      let params = {
        channelId: item.channelId,
        nStart: timeRange.nStart,
        nEnd: timeRange.nEnd
      }
      proxy.$api.materialVideoTraceability
        .getVideoUrl(params)
        .then((res: any) => {
          resolve(res.data.back_url)
        })
    })
  }

  let dialogVisible = $ref(false)
  let onOpenDialog = () => {
    if (selectedVideoList.length === 0) {
      ElMessage({
        message: '请选择视频',
        type: 'warning'
      })
      return
    }
    if (selectedAssociatedVideo.length >= maxSelected) {
      ElMessage({
        message: '选择的视频大于了' + maxSelected,
        type: 'warning'
      })
      return
    }
    if (durationAmount >= maxConnectTime) {
      ElMessage({
        message:
          '选择的视频时长大于了' + maxConnectTime / (60 * 60 * 1000) + '小时',
        type: 'warning'
      })
      return
    }
    dialogVisible = true
  }

  let onConnectVideo = () => {
    let params = selectedVideoList.map(item => ({
      channelId: item.channelId,
      matterCode: item.matterCode,
      startTime: item.connectTimeRange[0],
      endTime: item.connectTimeRange[1],
      attributeList: item.currentCirculationProcess.reduce((pre, acc) => {
        pre.push({
          [acc.label]: acc.value
        })
        return pre
      }, []),
      circulationProcess: item.circulationProcess,
      circulationTime: item.circulationTime,
      lineCode: item.lineCode,
      supplierCode: item.supplierCode
    }))
    proxy.$api.materialVideoTraceability
      .connectSelectedVideo(params)
      .then((res: any) => {
        dialogVisible = false
        ElMessageBox.confirm(
          '视频拼接处理请求已提交，稍后可前往下载中心查看视频文件处理进度，完成下载。',
          '提示',
          {
            confirmButtonText: '立即前往',
            cancelButtonText: '稍后前往',
            type: 'warning'
          }
        )
          .then(() => {
            router.push({
              path: '/materialDownload'
            })
          })
          .catch(() => {})
      })
  }
  let onSubmit = () => {
    onConnectVideo()
  }
  let onCancel = () => {
    dialogVisible = false
  }

  let dialogVisibleAutoConnect = $ref(false)
  let onOpenDialogAutoConnect = () => {
    dialogVisibleAutoConnect = true
  }

  let maxPlayTimeSecond = maxPlayTime / 1000
  let finalTime = maxPlayTimeSecond + compatibilityTime

  let autoConnectTime = $ref([0, finalTime])
  let happenTime = finalTime - maxPlayTimeSecond
  let sliderMarks = $ref({
    0: {
      label: '录像片段开始时间'
    },
    [happenTime]: {
      label: '物料事件发生时间',
      style: {
        color: '#FAAD14'
      }
    },
    [finalTime]: {
      label: '录像片段结束时间'
    }
  })
  let formatTooltip = val => {
    if (val == compatibilityTime) {
      return '0'
    } else {
      if (val < compatibilityTime) {
        return compatibilityTime - val
      } else {
        return val - compatibilityTime
      }
    }
  }

  let startStyle = $computed(() => {
    let left = (autoConnectTime[0] / finalTime) * 100
    return {
      left: `${left}%`
    }
  })
  let endStyle = $computed(() => {
    let left = (autoConnectTime[1] / finalTime) * 100
    return {
      left: `${left}%`
    }
  })

  let gapTime = $computed(() => {
    return (autoConnectTime[1] - autoConnectTime[0]) * 1000
  })
  let autoConnectAmount = $computed(() => {
    return gapTime * associatedVideoList.length
  })
  let formatterAutoConnectAmount = $computed(() => {
    let Hour = Math.floor(autoConnectAmount / (60 * 60 * 1000)) || 0
    let Minute =
      Math.floor((autoConnectAmount % (60 * 60 * 1000)) / (60 * 1000)) || 0
    let Second =
      Math.floor(
        ((autoConnectAmount % (60 * 60 * 1000)) % (60 * 1000)) / 1000
      ) || 0
    return `${Hour}小时${Minute}分${Second}秒`
  })
  let onSubmitAutoConnect = () => {
    let after = autoConnectTime[1] - compatibilityTime
    let front =
      autoConnectTime[0] < compatibilityTime
        ? compatibilityTime - autoConnectTime[0]
        : -(autoConnectTime[0] - compatibilityTime)
    let params = {
      front,
      after,
      circulationProcessList: circulationProcessList,
      rawDataKeyword: queryForm.rawDataKeyword,
      // 物料编号
      matterCode: currentMatterCode,
      // 供应商
      supplierKeyword: queryForm.supplierKeyword,
      // 包装编号
      pagIds: queryForm.pagIds,
      // 领料单号
      receiveMatterNumber: queryForm.receiveMatterNumber,
      // 线体标识
      lineCode: queryForm.lineCode,
      // 送货单号
      giveMatterNumber: queryForm.giveMatterNumber,
      endTime: queryForm.time[1],
      startTime: queryForm.time[0],
      max_PAGE_SIZE: 0,
      pageNo: 0,
      pageSize: 0
    }
    proxy.$api.materialVideoTraceability
      .automaticConnectSelectedVideo(params)
      .then(res => {
        dialogVisibleAutoConnect = false
        ElMessageBox.confirm(
          '视频拼接处理请求已提交，稍后可前往下载中心查看视频文件处理进度，完成下载。',
          '提示',
          {
            confirmButtonText: '立即前往',
            cancelButtonText: '稍后前往',
            type: 'warning'
          }
        )
          .then(() => {
            router.push({
              path: '/materialDownload'
            })
          })
          .catch(() => {})
      })
  }
  let onCancelAutoConnect = () => {
    dialogVisibleAutoConnect = false
  }
</script>

<style lang="less" scoped>
  .material-video-traceability {
    font-size: 14px;
    .query-form {
      :deep(.el-card) {
        .el-card__body {
          padding-bottom: 0;
        }
      }
    }
    .el-card {
      margin-bottom: 10px;
    }
    :deep(.el-card.associated-material-wrapper) {
      .el-card__body {
        padding: 0 20px;
        display: flex;
        align-items: center;
        gap: 20px;
      }
      .associated-material-label {
        white-space: nowrap;
      }
      .el-scrollbar__view {
        padding: 10px 10px;
      }
    }
    .associated-material {
      display: flex;
      gap: 40px;

      .associated-material-item {
        padding: 6px 20px;
        background-color: #e9ebf6;
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.3s;
        display: flex;
        align-items: center;
        .material-code {
          flex-shrink: 0;
        }
        .material-name {
          width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          word-wrap: break-word;
          :deep(.el-tooltip__trigger) {
            display: block;
            width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            word-wrap: break-word;
          }
        }

        &.active {
          background-color: #409eff;
          box-shadow: 0px 0px 8px 0px #409eff;
          color: #fff;
        }
      }
    }

    .associated-video-wrapper {
      :deep(.el-card__header) {
        display: flex;
        gap: 20px;
        align-items: center;
        position: relative;
        padding: 10px 20px;
        .change-layout {
          position: absolute;
          right: 70px;
          font-size: 20px;

          .el-button {
            border: none;

            &.current {
              background-color: #ecf5ff;
              color: #409eff;
            }
          }
        }
      }

      .selected-amount {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: #d9ecff;
        border-radius: 4px;
        border: 1px solid #79bbff;
        padding: 10px 30px;
      }
      .associated-video-body {
        display: flex;
        gap: 20px;
        align-items: flex-start;
        .associated-video-timeline {
          width: 640px;
          flex-shrink: 0;
          position: relative;
          .associated-video-nav {
            display: flex;
            gap: 15px;
            border-bottom: 1px solid #c8c8c8;

            .associated-video-nav-item {
              padding: 10px 10px;
              cursor: pointer;
              position: relative;
              transition: all 0.3s;
              &.current {
                color: #1890ff;
                &::after {
                  content: '';
                  width: 100%;
                  height: 4px;
                  background-color: #1890ff;
                  position: absolute;
                  bottom: -1px;
                  left: 0;
                }
              }
            }
          }
        }
        .associated-video-player-warpper {
          width: 100%;
        }
        .associated-video-player {
          margin-top: 10px;
          flex: 1;
          background: #fbfcfe;
          box-shadow: 0px 9px 9px 0px rgba(57, 57, 57, 0.16);
          border-radius: 10px;
          .associated-video-player-title {
            padding: 10px 30px 0;
            font-size: 16px;
            color: #5d5d5d;
            line-height: 42px;
          }
          .associated-video-player-container {
            margin: 0px 30px;
            height: 500px;
            box-shadow: 0px 0px 9px 0px rgba(29, 34, 39, 0.26);
            border-radius: 5px;
            overflow: hidden;
          }

          .associated-video-item-description {
            :deep(.el-descriptions) {
              .el-descriptions__body {
                background: transparent;

                .el-descriptions__table {
                  border-collapse: separate;
                  border-spacing: 30px 20px;
                }
                .el-descriptions__cell {
                  padding: 10px 30px;
                  border-left: 4px solid #1890ff;
                  border-radius: 4px 0px 0px 4px;
                  background: #e2f0fe;
                }
              }
              .el-descriptions__label {
                color: #999;
                flex-shrink: 0;
              }
              .el-descriptions__content {
                color: #1a1d2a;
                width: 150px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                .el-tooltip__trigger {
                  width: 100%;
                }
              }
            }
          }
        }
      }
      .associated-video {
        margin-top: 25px;
        display: flex;
        gap: 20px 19px;
        flex-wrap: wrap;

        .associated-video-item-wrapper {
          width: 360px;
          transition: all 0.3s;
          box-shadow: 0px 0px 16px 0px rgba(73, 77, 80, 0.19);
          &.current {
            box-shadow: 0px 0px 13px 0px rgba(24, 144, 255, 0.41);
            .el-tabs {
              border: 1px solid #1890ff;
            }
          }
          :deep(.el-tabs) {
            .el-tabs__content {
              padding: 0;
            }
          }

          .associated-video-item {
            background: #ffffff;
            border-radius: 4px;
            padding: 10px;
            font-size: 14px;
          }

          .associated-video-item-operate {
            display: flex;
            flex-direction: column;
            margin-bottom: 10px;

            .operate-body {
              display: flex;
              justify-content: space-between;
              align-items: center;
            }

            .operate-left {
              display: flex;
              font-size: 14px;
              align-items: center;
              gap: 5px;

              :deep(.el-checkbox) {
                .el-checkbox__label {
                  display: none;
                }
              }

              .operate-left-time {
                font-size: 12px;
                color: #c6c6c6;
              }
            }

            .operate-right {
              display: flex;
              font-size: 14px;
              align-items: center;

              .label {
                white-space: nowrap;
                color: #666666;
              }

              :deep(.el-date-editor) {
                width: 170px;
              }
            }
          }
          .circulation-time {
            width: 168px;
            height: 55px;
            position: absolute;
            top: -5px;
            left: -240px;
            color: #999999;
            font-size: 14px;
            background: url('@/assets/matter/circulation-time-bg.png') center
              center no-repeat;
            display: flex;
            justify-content: center;
            align-items: center;
            color: #fff;
            span {
              width: 50%;
              word-break: break-word;
              line-height: 20px;
            }
          }
          .circulation-process {
            position: absolute;
            width: 150px;
            top: 60px;
            left: -240px;
            font-size: 14px;
            text-align: center;
            line-height: 24px;
          }

          .associated-video-item-cover {
            width: 100%;
            height: 180px;
            position: relative;

            img {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }

            .el-icon {
              font-size: 50px;
              color: #fff;
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              cursor: pointer;
            }
          }
        }

        &.is-timeline {
          display: flex;
          flex-direction: column;
          position: relative;

          &::before {
            position: absolute;
            content: '';
            width: 20px;
            height: 100%;
            left: 190px;
            background: #e3e3e3;
            box-shadow: inset 0px 0px 5px 0px #1890ff;
            border-radius: 10px 10px 0px 0px;
            opacity: 0.61;
          }

          .associated-video-item-wrapper {
            position: relative;
            left: 240px;
            &::before {
              content: '';
              height: 20px;
              width: 20px;
              background: radial-gradient(circle, #dbf4ff, #309bfd);
              border-radius: 50%;
              position: absolute;
              left: -50px;
              top: 10px;
              transition: all 0.3s;
            }

            &:hover {
              &::before {
                box-shadow: rgba(74, 165, 241, 0.6) 0 0 0 3px,
                  rgba(74, 165, 241, 0.6) 0 0 0 8px,
                  rgba(74, 165, 241, 0.3) 0 0 0 13px;
              }
            }

            .associated-video-item-cover {
              flex: 1;
            }
          }
        }
      }
    }

    :deep(.el-alert) {
      .el-alert__description {
        p {
          line-height: 24px;
        }
      }
    }

    :deep(.el-result) {
      flex-direction: row;
      justify-content: flex-start;
      padding: 20px 0;
      font-size: 14px;

      .el-result__icon {
        display: none;
      }
    }

    .auto-connect-dialog {
      position: relative;
      .auto-connect-title-tips {
        position: relative;
        color: #999999;
        top: -60px;
        left: 120px;
        display: inline-block;
      }

      .auto-connect-tips {
        color: #999999;
      }

      .auto-connect-body {
        margin-top: 50px;
        display: flex;

        .slider-label {
          margin-right: 10px;
        }
        .slider-content-wrapper {
          padding: 0 50px;
          flex: 1;
        }
        .slider-content {
          position: relative;
          .slider-tooltip-item {
            position: absolute;
            top: -30px;
            .slider-tooltip-text {
              border-radius: 4px;
              background-color: #303133;
              color: #ffffff;
              padding: 4px 10px;
              display: flex;
              justify-content: center;
              align-items: center;
              position: absolute;
              left: -20px;
            }
          }

          :deep(.el-slider) {
            .el-slider__stop:nth-child(2)::after {
              top: -30px;
              left: -5px;
              position: absolute;
              content: '';
              background: url('@/assets/matter/icon-lightning.png') center
                center no-repeat;
              background-size: cover;
              width: 20px;
              height: 20px;
            }
          }
          .slider-content-icon {
            position: absolute;
            top: -15px;
          }
        }
      }
    }
  }
</style>
