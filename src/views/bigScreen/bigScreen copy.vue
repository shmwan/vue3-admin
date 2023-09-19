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
    <div class="top">
      <div>
        <img class="topImg" src="/src/assets/img/AIBig/product.png" alt="" />
      </div>
      <div class="topCenter">
        <div class="topText">
          <div class="line" style="width: 55%">
            线体：
            <span class="name">{{ data.lineList.lineName }}</span>
          </div>
          <div class="line" style="width: 45%">
            当前生产产品：
            <span class="name">{{ data.lineList.lineProduct }}</span>
          </div>
        </div>
        <div class="centerText">
          <div class="line" style="width: 50%">
            当前班次：
            <span class="name" v-if="data.showList.type == 1">白班</span>
            <span class="name" v-if="data.showList.type == 2">夜班</span>
          </div>
        </div>
        <div class="bottomText">
          <div class="product">
            <img class="productImg" src="@/assets/img/AIBig/play.png" alt="" />
            <div class="textName" style="color: #1ff2ff">计划产能</div>
            <div class="textNum">{{ data.productNum }}</div>
          </div>
          <div class="product">
            <img class="productImg" src="@/assets/img/AIBig/finish.png" alt="" />
            <div class="textName" style="color: #43aff3">完成产量</div>
            <div class="textNum">{{ data.finishNum }}</div>
          </div>
          <div class="product">
            <img class="productImg" src="@/assets/img/AIBig/end.png" alt="" />
            <div class="textName" style="color: #16e293">完成率</div>
            <div class="textNum">{{ data.rateNum }}%</div>
          </div>
          <div class="product">
            <img class="productImg" src="@/assets/img/AIBig/rate.png" alt="" />
            <div class="textName" style="color: #efaf4f">完成比例</div>
            <div class="textNum">{{ data.rateNum }}%</div>
          </div>
        </div>
      </div>
      <div class="boxCharts">
        <topBox :workType="data.showList.type"></topBox>
        <!-- <top-Chart :TopData="data.dataList"></top-Chart> -->
      </div>
    </div>
    <div class="bottom">
      <div class="bottomLeft">
        <left-top-Chart :TopData="data.dataList" class="leftTop"></left-top-Chart>
        <left-bottom-Chart :TopData="data.dataList" class="leftBottom"></left-bottom-Chart>
      </div>
      <div class="bottomCenter">
        <video-Center></video-Center>
      </div>
      <div class="bottomRight">
        <right-Top-Chart class="rightTopChart"></right-Top-Chart>
        <right-Two-Chart class="rightTwoChart"></right-Two-Chart>
      </div>
      <!-- <list-Bottom class="bottomBox"></list-Bottom> -->
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
import { reactive, toRaw, getCurrentInstance, onMounted } from 'vue'
const { proxy } = getCurrentInstance() as any
interface Data {
  lineList: any
  showList: any
  dataList: any
  productNum: any
  finishNum: any
  rateNum: any
  year: string
  month: string
  time: string
}
let data: Data = reactive({
  lineList: {},
  showList: {},
  dataList: {},
  productNum: null,
  finishNum: null,
  rateNum: null,
  year: '',
  month: '',
  time: ''
})
onMounted(() => {
  data.lineList = config().aiData
  searchData()
  getTime()
  setInterval(() => {
    getTime()
  }, 1000)
})
const searchData = () => {
  proxy.$api.bigScreen.getSystem({}).then((res: any) => {
    if (res.code == 200) {
      data.showList = res.data
      data.dataList.id = data.lineList.lineId
      data.dataList.day = res.data.day
      getRate()
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
const getProduct = () => {
  let params: any = {}
  params.lineCode = data.lineList.lineCode
  params.workClass = data.showList.workClass
  params.workDate = data.showList.workDate
  return proxy.$api.bigScreen.getPlanned(params)
}
const getQuantity = () => {
  let params: any = {}
  params.type = data.showList.type
  params.id = data.lineList.lineId
  params.day = data.showList.day
  return proxy.$api.bigScreen.getQuantity(params)
}
const getRate = () => {
  Promise.all([getProduct(), getQuantity()]).then(res => {
    if (res[0].code == 200) {
      if (res[0].data == null) {
        data.productNum = 0
      } else {
        data.productNum = res[0].data
      }

      if (res[1].code == 200) {
        if (res[1].data == null) {
          data.finishNum = 0
        } else {
          data.finishNum = res[1].data
        }
        if (data.productNum == 0) {
          data.rateNum = 0
        } else {
          data.rateNum = (
            Number(data.finishNum / data.productNum) * 100
          ).toFixed(2)
        }
      }
    }
  })
}
</script>
<style scoped lang="less">
.warpper {
  width: 100%;
  height: 100%;
  background: #071d37;
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
      width: 995px;
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
      width: 380px;
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
</style>
