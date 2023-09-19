<template>
  <div class="warpper">
    <div class="header">
      <div class="leftHeader">
        <img class="logo" src="/src/assets/img/AIBig/logo.png" alt="" />
        <div class="planBtn" @click="changeProduct()" v-if="data.flag">
          生产计划
        </div>
      </div>
      <div class="rightTop">
        <img src="/src/assets/img/AIBig/rili.png" alt="" />
        <div class="date">{{ data.year }}</div>
        <div class="day">{{ data.month }}</div>
        <div class="time">{{ data.time }}</div>
      </div>
    </div>
    <div v-if="data.flag">
      <div class="top">
        <div>
          <img class="topImg" :src="data.imgUrl + data.lineList?.productionImage" alt=""
            v-if="data.lineList?.productionImage" />
          <img class="topImg" src="/src/assets/img/AIBig/product.png" alt="" v-if="!data.lineList?.productionImage" />
        </div>
        <div class="topCenter">
          <div class="topText">
            <div class="line" style="width: 33%; display: flex">
              <div>
                {{ $t('lang.aiBigScreen.lineNo') }}
                <span class="name">{{ data.lineList.lineCode }}</span>
              </div>
              <div class="lockBox">
                <span class="prev"><img class="prevImg" src="/src/assets/img/AIBig/linePrevOff.png" alt="" /></span>
                <span class="unLock" v-if="!data.isLock" @click="lockLine()">
                  <img src="/src/assets/img/AIBig/unlock.png" alt="" />
                  <span class="jishi">
                    {{ getzf }}
                  </span>
                </span>

                <span class="lock" v-if="data.isLock" @click="unlockLine()">
                  <img class="lockImg" style="" src="/src/assets/img/AIBig/lock.png" alt="" />
                </span>
                <span class="next" style="" @click="nextLine()"><img class="nextImg" style=""
                    src="/src/assets/img/AIBig/lineNext.png" alt="" /></span>
              </div>
            </div>
            <div class="line" style="width: 33%">
              {{ $t('lang.aiBigScreen.lineProduct') }}
              <span class="name">{{ data.lineList.modelCode }}</span>
            </div>

            <div class="line" style="width: 33%">
              {{ $t('lang.aiBigScreen.shift') }}
              <span class="name" v-if="data.showList.type == 1">
                {{ $t('lang.aiBigScreen.dayShift') }}</span>
              <span class="name" v-if="data.showList.type == 2">
                {{ $t('lang.aiBigScreen.nightShift') }}</span>
            </div>
          </div>
          <!-- 料品滚动 -->
          <div class="centerText">
            <div class="line" style="width: 100%; display: flex">
              <div class="label labelNew">
                {{ $t('lang.aiBigScreen.scrollTit') }}
              </div>
              <div class="name">
                <vue3-seamless-scroll :list="data.listData" class="scroll" :direction="data.direction"
                  :limitMoveNum="data.limitMoveNum" :hover="true">
                  <ul class="scrollItem item" v-if="data.listData">
                    <li class="liIndex" v-for="(item, index) in data.listData" :key="index">
                      <span :class="item.urgentLevel == '0'
                        ? 'blue'
                        : item.urgentLevel == '1'
                          ? 'yellow'
                          : item.urgentLevel == '2'
                            ? 'red'
                            : 'red'
                        " class="title">物料编号：{{ item.materialNumber }}</span>
                      <span :class="item.urgentLevel == '0'
                        ? 'blue'
                        : item.urgentLevel == '1'
                          ? 'yellow'
                          : item.urgentLevel == '2'
                            ? 'red'
                            : 'red'
                        " class="numbers">剩余量{{ item.availableMargin }} ;</span>
                    </li>
                  </ul>
                </vue3-seamless-scroll>
              </div>
            </div>
          </div>

          <div class="bottomText">
            <div class="product">
              <img class="productImg" src="@/assets/img/AIBig/play.png" alt="" />
              <div class="textName" style="color: #1ff2ff">
                {{ $t('lang.aiBigScreen.play') }}
              </div>
              <div class="textNum">{{ data.numList.allQuantityPlan }}</div>
            </div>
            <div class="product">
              <img class="productImg" src="@/assets/img/AIBig/finish.png" alt="" />
              <div class="textName" style="color: #43aff3">
                {{ $t('lang.aiBigScreen.finish') }}
              </div>
              <div class="textNum">{{ data.numList.allQuantity }}</div>
            </div>
            <div class="product">
              <img class="productImg" src="@/assets/img/AIBig/end.png" alt="" />
              <div class="textName" style="color: #16e293">
                {{ $t('lang.aiBigScreen.end') }}
              </div>
              <div class="textNum">{{ data.numList.completionRate }}%</div>
            </div>
            <div class="product">
              <img class="productImg" src="@/assets/img/AIBig/rate.png" alt="" />
              <div class="textName" style="color: #efaf4f">
                {{ $t('lang.aiBigScreen.rate') }}
              </div>
              <div class="textNum">{{ data.numList.achievementRate }}%</div>
            </div>
          </div>
        </div>
        <div class="boxCharts">
          <topBox :workType="data.showList.type" :lineObj="data.lineList" ref="topBoxRef"></topBox>
        </div>
      </div>
      <div class="bottom">
        <div class="bottomLeft">
          <right-Two-Chart :lineObj="data.lineList" class="rightTwoChart" ref="rightTwo"></right-Two-Chart>
          <right-Top-Chart :lineObj="data.lineList" class="rightTopChart" ref="rightTop"></right-Top-Chart>
        </div>
        <div class="bottomCenter">
          <video-Center :lineObj="data.lineList" ref="CenterBox"></video-Center>
        </div>
        <div class="bottomRight">
          <left-top-Chart :lineObj="data.lineList" class="leftTop" ref="leftTop"></left-top-Chart>
          <left-bottom-Chart :lineObj="data.lineList" class="leftBottom" ref="leftBottom"></left-bottom-Chart>
        </div>
      </div>
    </div>
    <div v-if="!data.flag" class="loginWarp">
      <big-Login @close="close"></big-Login>
    </div>
    <planTable v-if="data.zhao" @close="closeTable" :lineObj="data.lineList"></planTable>
  </div>
</template>
<script setup lang="ts">
import leftTopChart from './echarts/leftTopChart.vue'
import leftBottomChart from './echarts/leftBottomChart.vue'
import videoCenter from './echarts/videoCenter.vue'
import topBox from './echarts/topBox.vue'
import rightTopChart from './echarts/rightTopChart.vue'
import rightTwoChart from './echarts/rightTwoChart.vue'
import bigLogin from './bigLogin.vue'
import planTable from './components/planTable.vue'
import useGetDate from '@/hooks/useGetDate.ts'
import useListen from '@/hooks/useListen.ts'
import { useRoute } from 'vue-router'
useListen().listenMouse()

import useSocket from '@/utils/socketNew'
let baseScoket = config().baseScoket
const stompClient = useSocket(baseScoket).stompClient
let headers = {
  Authorization: sessionStorage.getItem('token')
}
const getSocket = () => {
  stompClient.connect(headers, () => {
    stompClient.subscribe('/matter/msg/warning', (msg: any) => {
      console.log('推送', msg.body)
      let matterData = msg.body
      if (matterData) {
        let obj = JSON.parse(matterData)
        data.listData = []
        data.listData = obj
      }
    })
  })
}

import {
  reactive,
  toRaw,
  computed,
  getCurrentInstance,
  onMounted,
  watch,
  watchEffect
} from 'vue'
const { proxy } = getCurrentInstance() as any
const $t = proxy.$t
let currentIndex: number = 0
let lineTimer: any = null
let hourTime: any = null
let timerOut: any = null
interface Data {
  isLock: boolean
  queryCode: any
  lineList: any
  showList: any
  dataList: any
  numList: any
  productNum: any
  finishNum: any
  rateNum: any
  year: string
  month: string
  time: string
  flag: any
  listData: any
  direction: any
  zhao: any
  times: any
  AiDataList: any
  limitMoveNum: any
  lineCodeArr: any
  imgUrl: string
}
let data: Data = reactive({
  isLock: false,
  queryCode: null,
  lineList: {},
  AiDataList: null,
  showList: {},
  dataList: {},
  numList: {},
  productNum: null,
  finishNum: null,
  rateNum: null,
  year: '',
  month: '',
  time: '',
  flag: true,
  direction: 'left',
  zhao: false,
  times: 60,
  limitMoveNum: 2,
  listData: [],
  lineCodeArr: [],
  imgUrl: config().imgBaseUrl
})

const topBoxRef: any = $ref(null)
const leftTop: any = $ref(null)
const leftBottom: any = $ref(null)
const rightTop: any = $ref(null)
const rightTwo: any = $ref(null)
const CenterBox: any = $ref(null)
const route = useRoute()
const getzf = computed(() => {
  if (data.times < 10) {
    return '0' + data.times
  } else {
    return data.times
  }
})
onUnmounted(() => {
  // clearInterval()
  if (lineTimer) {
    clearInterval(lineTimer)
  }
  if (hourTime) {
    clearInterval(hourTime)
  }
  if (timerOut) {
    clearInterval(timerOut)
  }
  stompClient.disconnect()
  // if (stompClient) {
  //   stompClient.useSocket(baseScoket).disconnect()
  // }
})
onMounted(() => {
  getSocket()
  let user = sessionStorage.getItem('token')
  if (user && user.length > 5) {
    data.flag = true
    let { lineCode } = route.query
    if (lineCode) {
      data.queryCode = lineCode
    }
    searchLineBaseList()
    let aiBigSearchTimer = config().aiBigSearchTimer || 600000
    timerOut = setInterval(() => {
      searchLineBaseList()
    }, aiBigSearchTimer)
    getTime()
    hourTime = setInterval(() => {
      getTime()
    }, 1000)
  } else if (!user || user == 'null') {
    data.flag = false
  }
})
const searchLineBaseList = () => {
  let params = {
    lineCode: data.queryCode
  }
  if (config().isUseApi) {
    proxy.$api.bigScreen.getLineData(params).then((res: any) => {
      if (res.code == 200) {
        if (res.data && res.data.length > 0) {
          data.lineCodeArr = res.data
        }
      }
      searchByTime(data.lineCodeArr)
    })
  } else {
    data.lineCodeArr = config().aiData
    searchByTime(data.lineCodeArr)
  }
}
const lockLine = () => {
  data.isLock = !data.isLock
}
const unlockLine = () => {
  data.isLock = !data.isLock
  data.times = 60
}

const nextLine = () => {
  data.times = 60
  searchByTime(data.lineCodeArr)
}

const close = (val: any) => {
  data.flag = true
  data.times = 60
  let { lineCode } = route.query
  if (lineCode) {
    data.queryCode = lineCode
  }
  searchLineBaseList()
  if (timerOut) clearTimeout(timerOut)
  if (hourTime) clearInterval(hourTime)
  let aiBigSearchTimer = config().aiBigSearchTimer || 600000
  timerOut = setInterval(() => {
    searchLineBaseList()
  }, aiBigSearchTimer)
  getTime()
  hourTime = setInterval(() => {
    getTime()
  }, 1000)
}

const searchByTime = (arr: any) => {
  let { lineCode } = route.query
  if (lineCode && lineCode == arr[0].lineCode) {
    data.lineList = arr[0]
    let obj = arr[0]
    searchData(obj)
    //如果是单独产线 不轮播 按lineCode 取当前产线对象
  } else {
    // console.log('当前下标', currentIndex)
    if (currentIndex < arr.length) {
      data.lineList = arr[currentIndex]
      let obj = arr[currentIndex]
      searchData(obj)
      currentIndex += 1
    } else {
      currentIndex = 0
      data.lineList = arr[currentIndex]
      let obj = arr[currentIndex]
      searchData(obj)
      currentIndex += 1
    }
  }
}
const searchData = (obj: any) => {
  console.log('1', obj)
  proxy.$api.bigScreen.getSystem({}).then((res: any) => {
    if (res.code == 200) {
      data.showList = res.data
      data.showList.id = obj.putOutStationCountId
      data.showList.lineCode = obj.lineCode
      data.showList.modelName = obj.modelCode
      getRate(data.showList)
      // 子组件重新加载
      topBoxRef.searchTopData(obj, data.showList)
      CenterBox.searchData(obj)
      leftTop.loop(obj, data.showList)
      leftBottom.loop(obj, data.showList)
      rightTwo.loop(obj, data.showList)
      rightTop.getChartData(obj)

    }
  })
}
const getTime = () => {
  data.year = useGetDate().getDataNow().year
  data.month = useGetDate().getDataNow().weeks
  data.time = useGetDate().getDataNow().time
  if (!data.isLock) {
    if (data.times > 0) {
      data.times = data.times - 1
    } else {
      data.times = 60
      searchByTime(data.lineCodeArr)
    }
  }
}

const getRate = (params: any) => {
  proxy.$api.bigScreen.getQuantity(params).then((res: any) => {
    if (res.code == 200) {
      data.numList = res.data
      // console.log('data.numList', data.numList)
      rightTop.getDataList(data.lineList, data.showList, res.data.allQuantity)
      // res.data.allQuantity
    }
  })
}
const changeProduct = (params: any) => {
  data.zhao = true
}
const closeTable = (params: any) => {
  data.zhao = false
}
</script>
<style scoped lang="less">
.warpper {
  width: 100%;
  height: 100%;
  background: #102abf;
  overflow: auto;

  .labelNew {
    padding-top: 3px;
  }

  .header {
    background: url('/src/assets/img/AIBig/header.png');
    background-size: 100% 100%;
    height: 87px;

    .leftHeader {
      width: 400px;
      float: left;
      display: flex;
      justify-content: space-between;
      position: relative;

      .logo {
        width: 207px;
        height: 25px;
        margin-top: 40px;
        margin-left: 32px;
      }

      .planBtn {
        height: 60px;
        position: absolute;
        top: 30px;
        width: 140px;
        line-height: 60px;
        text-align: center;
        left: 260px;
        box-sizing: border-box;
        background: url('/src/assets/img/AIBig/changeBtn.png') no-repeat;
        background-size: cover;
        color: #fff;
        font-size: 18px;
      }
    }

    .rightTop {
      padding-right: 20px;
      width: 300px;
      float: right;
      display: flex;
      line-height: 87px;
      color: #92e7ff;
      justify-content: space-around;

      img {
        width: 22px;
        height: 18px;
        margin-top: 35px;
      }

      .day {
        color: #fff;
      }
    }
  }

  .lockBox {
    display: flex;
    flex-direction: column;
    height: 50px;
    position: relative;
    top: -25px;
    margin-left: 10px;

    .prev {
      height: 30px;
      width: 12px;
    }

    .prevImg {
      width: 20px;
      height: 12px;
    }

    .unLock {
      cursor: pointer;
      height: 20px;
      width: 20px;
      position: relative;

      >img {
        width: 26px;
        height: 20px;
      }

      .jishi {
        color: #c72525;
        position: absolute;
        top: 6px;
        left: 2px;
        font-size: 8px;
      }
    }

    .lock {
      height: 20px;
      cursor: pointer;
      width: 20px;
      position: relative;

      .lockImg {
        width: 20px;
        height: 20px;
      }
    }

    .next {
      cursor: pointer;
      height: 14px;
      width: 12px;

      .nextImg {
        width: 20px;
        height: 12px;
      }
    }
  }

  .top {
    box-sizing: border-box;
    height: 250px;
    // background: #999;
    padding: 10px 35px;
    display: flex;
    flex: 1;
    justify-content: space-between;
    align-items: center;

    .topImg {
      width: 375px;
      height: 228px;
    }

    .topCenter {
      width: 900px;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      box-sizing: border-box;
      padding: 0 30px 0 40px;

      .topText {
        display: flex;
        margin-top: 30px;
      }

      .bottomText {
        display: flex;
        justify-content: space-between;

        .productImg {
          width: 170px;
          height: 72px;
        }

        .product {
          width: 170px;
          height: 78px;
          background-size: 100% 100%;
          // margin-right: 70px;
          position: relative;

          .textName {
            position: absolute;
            top: 10px;
            left: 55px;
            font-size: 12px;
          }

          .textNum {
            position: absolute;
            top: 29px;
            left: 60px;
            font-size: 21px;
            color: #e8feff;
            font-family: PangMenZhengDao-3;
          }
        }
      }
    }

    .boxCharts {
      width: 500px;
      height: 100%;
    }
  }

  .bottom {
    height: 690px;
    overflow: hidden;
    box-sizing: border-box;
    margin: 30px 35px 0;
    display: flex;
    justify-content: space-between;

    .bottomBox {
      width: 100%;
      height: 100%;
    }

    .bottomLeft {
      width: 22%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .bottomCenter {
      width: 54%;
      height: 100%;
      background: url('/src/assets/img/AIBig/videoBG.png') no-repeat;
      background-size: 100% 100%;
    }

    .bottomRight {
      width: 22%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
  }

  .rightTopChart {
    width: 100%;
    height: 48%;
    background: url('/src/assets/img/AIBig/bg.png') no-repeat;
    background-size: 100% 100%;
    box-sizing: border-box;
    padding: 20px 30px;
  }

  .rightTwoChart {
    width: 100%;
    height: 48%;
    background: url('/src/assets/img/AIBig/bg.png') no-repeat;
    background-size: 100% 100%;
    box-sizing: border-box;
    padding: 20px 30px;
  }

  .line {
    font-size: 18px;
    font-family: PingFang SC;
    font-weight: 600;
    color: #ffffff;
    width: 100px;
    display: flex;
  }

  .label {
    height: 24px;
  }

  .name {
    max-width: 80%;
    overflow: hidden;
    color: #57e6ff;
  }

  .scroll {
    height: 30px;
    // width: 100%;
    width: 100%;
    margin: 0 auto;
    overflow: hidden;

    .item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 3px 0;

      //
      .liIndex {
        width: auto;
        display: flex;
        height: 25px;
        margin-right: 20px;
        list-style: none;

        .numbers {
          margin: 0 20px;
        }

        .blue {
          color: #57e6ff !important;
        }

        .yellow {
          color: #f7cf68 !important;
        }

        .red {
          color: #ff4440 !important;
        }
      }
    }
  }

  .leftTop {
    width: 100%;
    height: 48%;
    background: url('/src/assets/img/AIBig/bg.png') no-repeat;
    background-size: 100% 100%;
    box-sizing: border-box;
    padding: 20px 30px;
  }

  .leftBottom {
    width: 100%;
    height: 48%;
    background: url('/src/assets/img/AIBig/bg.png') no-repeat;
    background-size: 100% 100%;
    box-sizing: border-box;
    padding: 20px 30px;
  }
}

.loginWarp {
  width: 100%;
  height: calc(100% - 87px);
  background: url('/src/assets/img/AIBig/bgImg.png') no-repeat center center;
  background-size: 100% 100%;
}
</style>
