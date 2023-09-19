<template>
  <div class="warpper">
    <div class="header">
      <div class="leftHeader">
        <img class="logo" src="/src/assets/img/AIBig/logo.png" alt="" />
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
          <img class="topImg" src="/src/assets/img/AIBig/product.png" alt="" />
        </div>
        <div class="topCenter">
          <div class="topText">
            <div class="line" style="width: 55%">
              {{ $t('lang.aiBigScreen.lineNo') }}
              <span class="name">{{ data.lineList.lineName }}</span>

              <div class="operation" v-if="lineCodeIsOk">
                <div class="prev" @click="prevLine">
                  <!-- <img src="/src/assets/img/AIBig/linePrev.png" alt="" /> -->
                </div>
                <div class="lock" @click="changeLock">
                  <!-- <img v-if="!data.lock" src="/src/assets/img/AIBig/unlock.png" alt="" /> -->
                  <!-- <img v-if="ldata.lock" src="/src/assets/img/AIBig/lock.png" alt="" /> -->
                  <span v-if="!data.lock"> {{ getzf }} </span>
                </div>
                <div class="next" @click="nextLine()">
                  <img src="/src/assets/img/AIBig/lineNext.png" alt="" />
                </div>
              </div>



            </div>
            <div class="line" style="width: 45%">
              {{ $t('lang.aiBigScreen.lineProduct') }}
              <span class="name">{{ data.lineList.lineProduct }}</span>
            </div>
          </div>
          <div class="centerText">
            <div class="line" style="width: 50%">
              {{ $t('lang.aiBigScreen.shift') }}
              <span class="name" v-if="data.showList.type == 1">
                {{ $t('lang.aiBigScreen.dayShift') }}</span>
              <span class="name" v-if="data.showList.type == 2">
                {{ $t('lang.aiBigScreen.nightShift') }}</span>
            </div>
          </div>

          <!-- <div class="centerText">
         
        </div> -->
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
          <topBox :workType="data.showList.type" :lineObj="data.dataList" ref="topBoxRef"></topBox>
        </div>
      </div>
      <div class="bottom">
        <div class="bottomLeft">
          <left-top-Chart :lineObj="data.dataList" class="leftTop" ref="leftTop"></left-top-Chart>
          <left-bottom-Chart :lineObj="data.dataList" class="leftBottom" ref="leftBottom"></left-bottom-Chart>
        </div>
        <div class="bottomCenter">
          <video-Center :lineObj="data.dataList" ref="CenterBox"></video-Center>
        </div>
        <div class="bottomRight">
          <right-Top-Chart :lineObj="data.dataList" class="rightTopChart" ref="rightTop"></right-Top-Chart>
          <right-Two-Chart :lineObj="data.dataList" class="rightTwoChart" ref="rightTwo"></right-Two-Chart>
        </div>
      </div>
    </div>

    <div v-if="!data.flag" class="loginWarp">
      <big-Login @close="close"></big-Login>
    </div>
  </div>
</template>
<script setup lang="ts">
import topChart from './echarts/topChart.vue'
import listBottom from './listBottom.vue'
import leftTopChart from './echarts/leftTopChart.vue'
import leftBottomChart from './echarts/leftBottomChart.vue'
import videoCenter from './echarts/videoCenter.vue'
import topBox from './echarts/topBox.vue'
import rightTopChart from './echarts/rightTopChart.vue'
import rightTwoChart from './echarts/rightTwoChart.vue'
import bigLogin from './bigLogin.vue'
import { reactive, toRaw, getCurrentInstance, onMounted } from 'vue'
const { proxy } = getCurrentInstance() as any
const $t = proxy.$t
let currentIndex: number = 0
let lineTimer: any = null
let hourTime: any = null
interface Data {
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
}
let data: Data = reactive({
  lineList: {},
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
})
const topBoxRef: any = $ref(null);
const leftTop: any = $ref(null);
const leftBottom: any = $ref(null);
const rightTop: any = $ref(null);
const rightTwo: any = $ref(null);
const CenterBox: any = $ref(null);
onUnmounted(() => {
  // clearInterval()
  if (lineTimer) { clearInterval(lineTimer) }
  if (hourTime) { clearInterval(hourTime) }
})
onMounted(() => {
  getTime()
  setInterval(() => {
    getTime()
  }, 1000)
  let user = sessionStorage.getItem("token")
  if (user && user.length > 5) {
    data.flag = true;
    searchByTime()
    if (lineTimer) { clearInterval(lineTimer) }
    let timeStr = config().aiBigLineTimer ? config().aiBigLineTimer : 10000

    lineTimer = setInterval(() => {
      searchByTime()
    }, timeStr)


  } else if (!user || user == 'null') {
    data.flag = false;
  }
})
const close = (val: any) => {
  data.flag = true;
  searchByTime()
  if (lineTimer) { clearInterval(lineTimer) }
  let timeStr = config().aiBigLineTimer ? config().aiBigLineTimer : 1000
  lineTimer = setInterval(() => {
    searchByTime()
  }, timeStr)
};

const searchByTime = () => {
  if (window.location.hash.indexOf('?') > -1) {
    //如果是单独产线 不轮播 按lineCode 取当前产线对象

  }
  else {
    if (currentIndex < config().aiData.length) {
      data.lineList = config().aiData[currentIndex]
      let obj = config().aiData[currentIndex]
      searchData(obj)
      currentIndex++
    } else {
      currentIndex = 0
      data.lineList = config().aiData[currentIndex]
      let obj = config().aiData[currentIndex]
      searchData(obj)
    }
  }
}
const searchData = (obj: any) => {
  proxy.$api.bigScreen.getSystem({}).then((res: any) => {
    if (res.code == 200) {
      data.showList = res.data
      data.showList.id = obj.lineId
      data.showList.lineCode = obj.lineCode
      data.showList.modelName = obj.lineProduct

      // 子组件重新加载
      CenterBox.searchData(obj)
      leftTop.loop(obj, data.showList)
      leftBottom.loop(obj, data.showList)
      rightTwo.loop(obj, data.showList)
      rightTop.getChartData(obj)
      topBoxRef.searchTopData(obj, data.showList)
      getRate(data.showList)
    }
  })
}
const fillZero = (str: any) => {
  var realNum
  if (str < 10) {
    realNum = '0' + str
  } else {
    realNum = str
  }
  return realNum
}
const getTime = () => {
  let myDate = new Date()
  let myYear = myDate.getFullYear() //获取完整的年份(4位,1970-????)
  let myMonth = myDate.getMonth() + 1 //获取当前月份(0-11,0代表1月)
  let myToday = myDate.getDate() //获取当前日(1-31)
  let myDay = myDate.getDay() //获取当前星期X(0-6,0代表星期天)
  let myHour = myDate.getHours() //获取当前小时数(0-23)
  let myMinute = myDate.getMinutes() //获取当前分钟数(0-59)
  let mySecond = myDate.getSeconds() //获取当前秒数(0-59)
  let week = [
    '星期日',
    '星期一',
    '星期二',
    '星期三',
    '星期四',
    '星期五',
    '星期六'
  ]
  data.year = myYear + '.' + fillZero(myMonth) + '.' + fillZero(myToday)
  data.month = week[myDay]
  data.time =
    fillZero(myHour) + ':' + fillZero(myMinute) + ':' + fillZero(mySecond)

  // setInterval(this.getTime,1000);
}

const getRate = (params: any) => {
  proxy.$api.bigScreen.getQuantity(params).then((res: any) => {
    if (res.code == 200) {
      data.numList = res.data
      console.log('data.numList', data.numList)
      rightTop.getDataList(data.lineList, data.showList, res.data.allQuantity)
    }
  })
}
</script>
<style scoped lang="less">
.warpper {
  width: 100%;
  height: 100%;
  background: #102abf;
  overflow: auto;

  .header {
    background: url('/src/assets/img/AIBig/header.png');
    background-size: 100% 100%;
    height: 87px;

    .leftHeader {
      width: 300px;
      float: left;

      .logo {
        width: 207px;
        height: 25px;
        margin-top: 40px;
        margin-left: 32px;
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
      width: 980px;
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
      width: 420px;
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
    }
  }

  .line {
    font-size: 18px;
    font-family: PingFang SC;
    font-weight: 600;
    color: #ffffff;
  }

  .name {
    color: #57e6ff;
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
