<template>
  <div class="material-video-traceability">
    <el-card class="query-form">
      <el-form inline :model="queryForm" ref="queryFormRef">
        <el-form-item label="料号" prop="matterKeyword">
          <el-input v-model="queryForm.matterKeyword" placeholder="输入料号" />
        </el-form-item>
        <el-form-item label="供应商" prop="supplierKeyword">
          <el-input
            v-model="queryForm.supplierKeyword"
            placeholder="输入供应商名称"
          />
        </el-form-item>
        <el-form-item label="物料单号" prop="matterBill">
          <el-input v-model="queryForm.matterBill" placeholder="输入物料单号" />
        </el-form-item>

        <el-form-item label="时间范围" prop="time">
          <el-date-picker
            v-model="queryForm.time"
            type="daterange"
            start-placeholder="送货单更新开始时间"
            end-placeholder="送货单更新结束时间"
            value-format="YYYY-MM-DD HH:mm:ss"
            :disabled-date="disabledDate"
          />
        </el-form-item>
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
      </el-form>
    </el-card>
    <el-card
      :header="`关联物料(${associatedMatterList.length}):`"
      class="associated-material-wrapper"
      v-if="isAssociatedMaterialEmpty"
    >
      <el-scrollbar always>
        <div class="associated-material">
          <div
            class="associated-material-item"
            v-for="item in associatedMatterList"
            :key="item.matterCode"
            :label="item.matterCode"
            :class="{ active: item.matterCode === currentMatterCode }"
            @click="onMatterClick(item)"
          >
            <div class="material-code">{{ item.matterCode }} ></div>
            <div class="material-name">
              <!-- <el-tooltip :content="item.matterName">
                {{ item.matterName }}
              </el-tooltip> -->
              {{ item.matterName }}
            </div>
          </div>
        </div>
      </el-scrollbar>
    </el-card>

    <el-card class="associated-video-wrapper" v-if="isAssociatedVideoEmpty">
      <template #header>
        <span>
          {{ `关联视频(${associatedVideoList.length}):` }}
        </span>
        <el-button type="primary" @click="onOpenDialog">
          自动拼接下载视频
        </el-button>
        <el-button type="primary" @click="onOpenDialog">
          <!-- :disabled="disabledDownload" -->
          拼接下载视频文件
        </el-button>
        <span>
          *单个视频选择时间范围最大为
          {{ maxSelectedOneTime / 60 / 1000 }} 分钟,勾选视频数量最大支持{{
            maxSelected
          }}
          个，拼接视频总时长最大支持
          {{ Math.floor(maxConnectTime / (60 * 60 * 1000)) }} 小时！
        </span>
        <div class="change-layout">
          <el-button
            :icon="Grid"
            size="small"
            circle
            :class="{ current: currentLayout === 'card' }"
            @click="onChangLayout('card')"
          />
          <el-button
            :icon="Operation"
            size="small"
            circle
            :class="{ current: currentLayout === 'timeLine' }"
            @click="onChangLayout('timeLine')"
          />
        </div>
      </template>
      <div class="selected-amount">
        <div>
          已选 <el-text> {{ selectedAssociatedVideo.length }} </el-text> 个视频
        </div>
        <el-link type="primary" :underline="false" @click="onClearSelected">
          清空
        </el-link>
      </div>

      <el-checkbox-group v-model="selectedAssociatedVideo">
        <div
          class="associated-video"
          :class="{ 'is-time-line': currentLayout === 'timeLine' }"
        >
          <div
            class="associated-video-item"
            v-for="item in associatedVideoList"
            :key="item.id"
          >
            <div class="associated-video-item-operate">
              <div class="operate-body">
                <div class="operate-left">
                  <el-checkbox
                    :disabled="!item.videoDeviceInfo.channelId"
                    :label="item.id"
                    @change="val => onAssociatedVideoChange(val, item)"
                  >
                    {{ item.circulationProcessStr }}
                  </el-checkbox>
                </div>
                <!-- v-if="item.timeRangeVisble" -->
                <div class="operate-right" v-show="item.timeRangeVisble">
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
                  <!-- :disabled-hours="disabledHours"
                    :disabled-minutes="disabledMinutes"
                    :disabled-seconds="disabledSeconds" -->
                </div>
              </div>
              <div class="operate-footer">
                {{ item.time }}
              </div>
            </div>
            <div class="associated-video-item-container">
              <div class="associated-video-item-cover">
                <template v-if="!item.videoUrl">
                  <img :src="item.videoDeviceInfo.imageUrl" alt="" />
                  <el-icon @click="onGetVideoInfo(item)">
                    <i-ep-videoPlay />
                  </el-icon>
                </template>
                <VideoPlayer
                  v-else
                  :video-url="item.videoUrl"
                  :live="false"
                ></VideoPlayer>
              </div>
              <div class="associated-video-item-description">
                <el-descriptions :column="currentLayout === 'card' ? 2 : 1">
                  <el-descriptions-item
                    v-for="iitem in item.currentCirculationProcess"
                    :key="iitem.value"
                    :label="iitem.label"
                  >
                    {{ iitem.value }}
                  </el-descriptions-item>
                </el-descriptions>
              </div>
            </div>
          </div>
        </div>
      </el-checkbox-group>
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
  </div>
</template>

<script setup lang="ts">
  import { Search, Refresh, Grid, Operation } from '@element-plus/icons-vue'
  import DateUtils from '@/utils/dateUtils.js'
  import VideoPlayer from '@/components/video-player/VideoPlayer.vue'
  import proDialog from '@/components/pro-dialog.vue'
  let {
    materialVideoTraceability: {
      maxPlayTime,
      maxSelected,
      maxSelectedOneTime,
      maxConnectTime
    }
  } = config()
  import materialVideoTraceabilityDefault from '@/assets/matter/materialVideoTraceability-default.png'
  const { proxy } = getCurrentInstance()
  let router = useRouter()
  let startTime = new Date()
  let endTime = new Date()
  startTime.setTime(startTime.getTime() - 3600 * 1000 * 24 * 30)

  let queryFormRef = $ref(null)
  let queryForm = $ref({
    matterKeyword: '',
    supplierKeyword: 'V1105',
    matterBill: '',
    time: [
      DateUtils.format(startTime, 'yyyy-MM-dd hh:mm:ss'),
      DateUtils.format(endTime, 'yyyy-MM-dd hh:mm:ss')
    ]
  })
  // 最近三个月
  let latest3Month = new Date().setTime(
    new Date().getTime() - 3600 * 1000 * 24 * 30 * 3
  )

  let disabledDate = (time: Date) => {
    return time.getTime() < latest3Month || time.getTime() > Date.now()
  }
  let disabledOperate = $ref(true)
  watch(queryForm, newVal => {
    let { time, ...rest } = newVal
    if (Object.values(rest).some(item => item !== '')) {
      disabledOperate = false
    } else {
      disabledOperate = true
    }
  })

  let currentMatterCode = $ref('')

  let associatedMatterList = $ref([])
  let isAssociatedMaterialEmpty = $computed(
    () => associatedMatterList.length !== 0
  )

  let onMatterClick = item => {
    currentMatterCode = item.matterCode
  }
  let onQuery = () => {
    let params = {
      matterKeyword: queryForm.matterKeyword,
      supplierKeyword: queryForm.supplierKeyword,
      matterBill: queryForm.matterBill,
      startTime: queryForm.time[0],
      endTime: queryForm.time[1],
      pageSize: 99999
    }
    proxy.$api.materialVideoTraceability
      .getTraceabilityStockList(params)
      .then((res: any) => {
        associatedMatterList = res.data.records
        currentMatterCode = associatedMatterList[0].matterCode
      })
  }
  onMounted(() => {
    onQuery()
  })
  let onReset = () => {
    queryForm = {
      matterKeyword: '',
      supplierKeyword: '',
      matterBill: '',
      time: [
        DateUtils.format(startTime, 'yyyy-MM-dd hh:mm:ss'),
        DateUtils.format(endTime, 'yyyy-MM-dd hh:mm:ss')
      ]
    }
    associatedMatterList = []
    associatedVideoList = []
    selectedAssociatedVideo = []
    currentMatterCode = ''
  }

  let selectedAssociatedVideo = $ref([])
  let onClearSelected = () => {
    selectedAssociatedVideo.length = 0
    computedDownLoadStatus()
  }
  watch(
    () => currentMatterCode,
    newVal => {
      if (!newVal) return
      getAssociatedVideoList()
    },
    {
      immediate: true
    }
  )

  let associatedVideoList = $ref([])
  let isAssociatedVideoEmpty = $computed(() => associatedVideoList.length !== 0)
  let getAssociatedVideoList = () => {
    let params = {
      matterCode: currentMatterCode,
      matterKeyword: queryForm.matterKeyword,
      supplierKeyword: queryForm.supplierKeyword,
      matterBill: queryForm.matterBill,
      startTime: queryForm.time[0],
      endTime: queryForm.time[1]
    }
    proxy.$api.materialVideoTraceability
      .getAssociatedVideoList(params)
      .then((res: any) => {
        associatedVideoList = res.data.map(item => {
          // 1:到货清点,
          // 单号:
          // 料号:
          // 供应商:
          // 数量:
          // 面单重量:
          // 实际重量:
          // 2: 物料质检,
          // 单号:
          // 料号:
          // 供应商:
          // 数量:
          // 面单重量:
          // 实际重量:
          // 包装号:
          // 3: 物料仓库出入库,
          // 单号:
          // 包装号:
          // 料号:
          // 入库数量:
          // 最新库存:
          // 4: 厂内物料配送,
          // 领料单:
          // 领料数量:
          // 最新库存:
          // 包装号:
          // 领料产线:
          // 5: 生产用料,
          // 领料单号:
          // 料号:
          // 领料产线:
          // 领料数量:
          // 6: 抛账
          // item.circulationProcess = 1
          let time = ''
          let unifiedCategory = JSON.parse(item.unifiedCategory) || {}

          let currentCirculationProcess = []

          if (item.circulationProcess === 1) {
            // 1:到货清点,
            // 单号:
            // 料号:
            // 供应商:
            // 数量:
            // 面单重量:
            // 实际重量:
            time = unifiedCategory.weighTime
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
            time = unifiedCategory.qualityCheckDate
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
            // 3: 物料仓库出入库,
            // 单号:
            // 包装号:
            // 料号:
            // 入库数量:
            // 最新库存:
            time = unifiedCategory.createDate
            currentCirculationProcess = [
              {
                label: '单号',
                value: unifiedCategory.sourceCode
              },
              {
                label: '包装号',
                value: unifiedCategory.sn
              },
              {
                label: '料号',
                value: unifiedCategory.materialCode
              },
              {
                label: '入库数量',
                value: unifiedCategory.qty
              },
              {
                label: '最新库存',
                value: unifiedCategory.nowQty
              }
            ]
          } else if (item.circulationProcess === 4) {
            // 4: 厂内物料配送,
            // 领料单:
            // 领料数量:
            // 最新库存:
            // 包装号:
            // 领料产线:
            time = unifiedCategory.deliveryDate
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
                label: '最新库存',
                value: unifiedCategory.nowQty
              },
              {
                label: '包装号',
                value: unifiedCategory.sn
              },
              {
                label: '领料产线',
                value: unifiedCategory.lineCode
              }
            ]
          } else if (item.circulationProcess === 5) {
            // 5: 生产用料,
            // 领料单号:
            // 料号:
            // 领料产线:
            // 领料数量:
            time = unifiedCategory.recordTime
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
          }
          item.time = time
          item.videoUrl = ''
          item.currentCirculationProcess = currentCirculationProcess
          item.unifiedCategory = unifiedCategory
          item.timeRangeVisble = false
          item.connectTimeRange = ['', '']
          item.videoDeviceInfo.imageUrl =
            item.videoDeviceInfo.imageUrl || materialVideoTraceabilityDefault
          return item
        })
      })
  }

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
    selectedVideoList = associatedVideoList.filter(item => {
      return selectedAssociatedVideo.includes(item.id)
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
    if (val && !item.connectTimeRange[0]) {
      timeRange = await onGetVideoTimeRange(item)
      item.connectTimeRange = [
        timeRange[0].nStart * 1000,
        timeRange[0].nEnd * 1000
      ]
      item.duration = item.connectTimeRange[1] - item.connectTimeRange[0]
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

  let makeRange = (start: number, end: number) => {
    let result: number[] = []
    for (let i = start; i <= end; i++) {
      result.push(i)
    }
    return result
  }
  // let disabledHours = role => {
  //   if (!currentSelectedVideo.connectTimeRange) return []
  //   let startHour = 0
  //   let endHour = 0
  //   startHour = new Date(currentSelectedVideo.connectTimeRange[0]).getHours()

  //   endHour = new Date(currentSelectedVideo.connectTimeRange[1]).getHours()

  //   if (role === 'start') {
  //     return makeRange(0, startHour - 1)
  //   } else {
  //     return makeRange(endHour + 1, 23)
  //   }
  // }
  // let disabledMinutes = (hour, role) => {
  //   if (!currentSelectedVideo.connectTimeRange) return []
  //   let startMinute = 0
  //   startMinute = new Date(
  //     currentSelectedVideo.connectTimeRange[0]
  //   ).getMinutes()

  //   if (role === 'start') {
  //     return makeRange(0, startMinute - 1)
  //   }
  // }

  // let disabledSeconds = (hour: number, minute: number, role) => {
  //   if (!currentSelectedVideo.connectTimeRange) return []
  //   let startSecond = 0
  //   startSecond = new Date(
  //     currentSelectedVideo.connectTimeRange[0]
  //   ).getSeconds()
  //   if (role === 'start') {
  //     return makeRange(0, startSecond - 1)
  //   }
  // }
  let onGetVideoInfo = async item => {
    if (!item.videoDeviceInfo.channelId) {
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
  let formatterProcessTime = (time, halfTime) => {
    let startTime = (new Date(time).getTime() - halfTime) / 1000
    let endTime = (new Date(time).getTime() + halfTime) / 1000
    return {
      startTime,
      endTime
    }
  }
  let onGetVideoTimeRange = item => {
    return new Promise((resolve, reject) => {
      let halfTime = Math.floor(maxPlayTime / 2)
      let startTime = 0
      let endTime = 0
      let currentProcessTime = {}
      currentProcessTime = formatterProcessTime(item.time, halfTime)

      startTime = currentProcessTime.startTime
      endTime = currentProcessTime.endTime

      let params = {
        channelId: item.videoDeviceInfo.channelId,
        startTime: startTime,
        endTime: endTime
      }
      proxy.$api.materialVideoTraceability
        .getTimeRange(params)
        .then((res: any) => {
          resolve(res.data)
        })
    })
  }
  let onGetVideoUrl = ({ timeRange, item }) => {
    return new Promise((resolve, reject) => {
      let params = {
        channelId: item.videoDeviceInfo.channelId,
        nStart: timeRange[0].nStart,
        nEnd: timeRange[0].nEnd
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
    dialogVisible = true
  }

  let onConnectVideo = () => {
    let params = selectedVideoList.map(item => ({
      channelId: item.videoDeviceInfo.channelId,
      matterCode: item.matterCode,
      startTime: item.connectTimeRange[0],
      endTime: item.connectTimeRange[1],
      attributeList: item.currentCirculationProcess.reduce((pre, acc) => {
        pre.push({
          [acc.label]: acc.value
        })
        return pre
      }, [])
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
  let currentLayout = $ref('timeLine')
  let onChangLayout = val => {
    currentLayout = val
  }
</script>

<style lang="less" scoped>
  .material-video-traceability {
    font-size: 14px;
    .el-card {
      margin-bottom: 30px;
    }
    .associated-material {
      display: flex;
      gap: 40px;
      .associated-material-item {
        padding: 15px 30px;
        width: 190px;
        background-color: #e9ebf6;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s;

        .material-name {
          width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          word-wrap: break-word;
        }
        &.active {
          background-color: #409eff;
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
        padding: 20px 30px;
        span {
          color: #409eff;
        }
      }
      .associated-video {
        margin-top: 25px;
        display: flex;
        gap: 20px 19px;
        flex-wrap: wrap;
        .associated-video-item {
          width: 340px;
          background: #ffffff;
          box-shadow: 0px 0px 8px 0px rgba(198, 198, 198, 0.5);
          border-radius: 4px;
          padding: 14px;
          font-size: 14px;
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
            .operate-footer {
              height: 20px;
              margin-top: 5px;
              color: #999999;
              line-height: 20px;
            }
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
          .associated-video-item-description {
            margin-top: 10px;
            :deep(.el-descriptions) {
              .el-descriptions__label {
                color: #999;
              }

              .el-descriptions__content {
                color: #1a1d2a;
              }
            }
          }
        }
        &.is-time-line {
          display: flex;
          flex-direction: column;
          position: relative;
          &::before {
            position: absolute;
            content: '';
            width: 10px;
            height: 100%;
            left: 150px;
            // background-image: linear-gradient(
            //   45deg,
            //   rgba(0, 0, 0, 0.1) 25%,
            //   transparent 25%,
            //   transparent 50%,
            //   rgba(0, 0, 0, 0.1) 50%,
            //   rgba(0, 0, 0, 0.1) 75%,
            //   transparent 75%,
            //   transparent
            // );
            // background-size: 1.25em 1.25em;
            background-color: var(--el-color-primary);
            border-radius: 10px;
          }
          .associated-video-item {
            // display: flex;
            width: 490px;
            position: relative;
            left: 200px;
            .associated-video-item-operate {
              .operate-footer {
                position: absolute;
                left: -200px;
              }
            }
            .associated-video-item-container {
              display: flex;
              gap: 0 20px;
            }
            .associated-video-item-cover {
              width: 300px;
              flex-shrink: 0;
            }
            .associated-video-item-description {
              margin-top: 0;
            }
            .el-descriptions__body
              .el-descriptions__table:not(.is-bordered)
              .el-descriptions__cell {
              margin-bottom: 10px;
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
  }
</style>
