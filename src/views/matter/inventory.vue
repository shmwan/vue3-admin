<template>
  <div class="container" id="log">
    <div class="containerTop">
      <div class="topTitle">
        <img src="/src/assets/img/AIBig/rili.png" alt="" style="margin-right: 20px;" />
        <span style="margin-right: 20px;"> {{ yMd }} <span style="margin-left:5px;color: #fff">{{ week }}</span> {{ times
        }}</span>
        <img v-if="isFullScreen" @click="toggleFullscreen" src="@/assets/matter/fullScreen.png" />
        <img v-else @click="exitFullscreen" src="@/assets/matter/small.png" />
      </div>
      <div class="topWrap">
        <div class="topEchart">
          <div class="charts" ref="pieChart"></div>
        </div>
        <div class="topCenter">
          <div class="itemInd">
            <div class="textBackground"><img src="@/assets/matter/icon1.png" /></div>
            <div class="textNum">
              <span>今日称重清点总数</span>
              <p>{{ topData.totalNum }}</p>
            </div>
          </div>

          <div class="itemInd">
            <div class="textBackground"><img src="@/assets/matter/icon2.png" /></div>
            <div class="textNum">
              <span>清点通过</span>
              <p>{{ topData.passNum }}</p>
            </div>
          </div>

          <div class="itemInd">
            <div class="textBackground"><img src="@/assets/matter/icon3.png" /></div>
            <div class="textNum">
              <span style="">清点异常待复核</span>
              <p style="color:red"> {{ topData.waitCheckNum }}</p>
            </div>
          </div>
          <div class="itemInd">
            <div class="textBackground"><img src="@/assets/matter/icon4.png" /></div>
            <div class="textNum">
              <span>复核异常</span>
              <p style="color:red">{{ topData.checkUnusualNum }}</p>
            </div>
          </div>
          <div class="itemInd">
            <div class="textBackground"><img src="@/assets/matter/icon5.png" /></div>
            <div class="textNum">
              <span>生成到货单</span>
              <p>{{ topData.arrivalNum }}</p>
            </div>
          </div>


        </div>
        <div class="topRight">
          <img src="@/assets/matter/w_00016_iSpt.png" />
        </div>
      </div>

    </div>

    <div class="containerBottom" v-if="deviceList.length == 1">
      <div class="bottomDiv">
        <div class="bottomOnePic" v-for="(item, index) in deviceList" :key="index">
          <div class="leftTitle">设备名称：{{ item.name }}</div>
          <div class="rightImg">
            <el-image v-if="item.img" class="itemImg" :src="item.img" />
            <img v-else class="statusImg" src="@/assets/matter/one.png" />
            <img v-if="item.img && item.currentStatus == 1" class="statusImg" src="@/assets/matter/oneSuccess.png" />
            <img v-if="item.img && item.currentStatus == 2" class="statusImg" src="@/assets/matter/oneError.png" />
            <el-row justify="start" class="bottomTextTop">
              <el-col :span="8" :xl="10" class="bottomTitle">
                <span class="title">物料PAG ID:</span>
                <span class="titleValue"> {{
                  item.pagId }}</span>
              </el-col>
              <el-col :span="8" :xl="10" class="bottomTitle">
                <span class="title">扫码时间:</span>
                <span class="titleValue"> {{ item.weighTime }}</span>
              </el-col>
              <el-col :span="4" :xl="4"></el-col>
            </el-row>
            <!-- <div class="bottomTextTop">
              <div style="flex: 1;">
                <span class="title">物料PAG ID:</span>
                <span class="titleValue"> {{
                  item.pagId }}</span>
              </div>
              <div style="flex: 1;">
                <span class="title">扫码时间:</span>
                <span class="titleValue"> {{ item.weighTime }}</span>
              </div>
            </div> -->
            <el-row justify="start" class="bottomTextCenter">
              <el-col :span="8" :xl="10" class="bottomTitle">
                <p>实际称重：</p>
                <div><span class="rowNum">{{ item.actualWeight }}</span><span
                    style="font-size:16px;color:#00EDFE">kg</span></div>
              </el-col>
              <el-col :span="8" :xl="10" class="bottomTitle">
                <p>称重数量：</p>
                <div><span class="rowNum">{{ item.quantity }}</span><span style="font-size:16px;color:#00EDFE">件</span>
                </div>
              </el-col>
              <el-col :span="4" :xl="4"></el-col>
            </el-row>
            <div class="bottomStatusIcon" v-if="item.currentStatus == 1">
              <img src="@/assets/matter/pass.png" />
              <span class="statusText">清点通过，即将生成到货单</span>

            </div>
            <div class="bottomStatusIcon" v-if="item.currentStatus == 2">
              <img src="@/assets/matter/error.png" />
              <span class="statusErrorText">清点异常，请复核</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="containerBottom" v-else-if="deviceList.length > 1 && deviceList.length <= 3">
      <div class="bottomDiv">
        <div class="bottomPic"
          :class="Number(index + 1) % 3 == 1 ? 'left' : Number(index + 1) % 3 == 2 ? 'center' : 'right'"
          v-for="(item, index) in deviceList" :key="index">
          <div class="leftTitle">设备名称：{{ item.name }}</div>
          <div class="rightImg">
            <el-image v-if="item.img" class="itemImg" :src="item.img" />
            <img v-else-if="deviceList.length < 3" class="statusImg2" src="@/assets/matter/null.png" />
            <img v-else class="statusImg" src="@/assets/matter/null2.png" />
            <img v-if="item.currentStatus == 1 && deviceList.length == 3" class="statusImg"
              src="@/assets/matter/background.png" />
            <img v-if="item.currentStatus == 1 && deviceList.length < 3" class="statusImg2"
              src="@/assets/matter/backgroundTwo.png" />
            <img v-if="item.currentStatus == 2 && deviceList.length == 3" class="statusImg"
              src="@/assets/matter/backgroundOne.png" />
            <img v-if="item.currentStatus == 2 && deviceList.length < 3" class="statusImg2"
              src="@/assets/matter/backgroundTwos.png" />
            <div class="bottomTextTop">
              <span class="title">物料PAG ID:</span>
              <span class="titleValue"> {{
                item.pagId }}</span>
            </div>
            <div class="bottomTextTop">
              <span class="title">扫码时间:</span>
              <span class="titleValue"> {{ item.weighTime }}</span>
            </div>
            <el-row justify="start" class="bottomTextCenter">
              <el-col :span="8" :xl="10" class="bottomTitle">
                <p>实际称重：</p>
                <div><span class="rowNum">{{ item.actualWeight }}</span><span
                    style="font-size:16px;color:#00EDFE">kg</span></div>
              </el-col>
              <el-col :span="8" :xl="10" class="bottomTitle">
                <p>称重数量：</p>
                <div><span class="rowNum">{{ item.quantity }}</span><span style="font-size:16px;color:#00EDFE">件</span>
                </div>
              </el-col>
              <el-col :span="4" :xl="4"></el-col>
            </el-row>
            <div class="bottomStatusIcon" v-if="item.currentStatus == 1">
              <img src="@/assets/matter/pass.png" />
              <span class="statusText">清点通过，即将生成到货单</span>

            </div>
            <div class="bottomStatusIcon" v-if="item.currentStatus == 2">
              <img src="@/assets/matter/error.png" />
              <span class="statusErrorText">清点异常，请复核</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="containerBottom" v-else-if="deviceList.length > 3">
      <swiper :modules="modules" :loop="true" :slides-per-view="1" :space-between="50"
        :autoplay="{ delay: 4000, disableOnInteraction: false }" :navigation="navigation"
        :pagination="{ clickable: true }" :scrollbar="{ draggable: false }" class="swiperBox"
        @slideChange="onSlideChange">
        <swiper-slide v-for="(item, index) in deviceList" :key="index">
          <el-row justify="space-around">
            <el-col class="containerBottomImg" :span="18"
              :class="Number(index + 1) % 3 == 1 ? 'left' : Number(index + 1) % 3 == 2 ? 'center' : 'right'">
              <div class="leftTitle">设备名称：{{ item.name }}</div>
              <div class="rightImg">
                <el-image v-if="item.img" class="itemImg2" :src="item.img" />
                <img v-else class="statusImg3" src="@/assets/matter/null.png" />
                <img v-if="item.currentStatus == 1" class="statusImg3" src="@/assets/matter/backgroundTwo.png" />
                <img v-if="item.currentStatus == 2" class="statusImg3" src="@/assets/matter/backgroundTwos.png" />
                <div class="swiperContent">
                  <span class="title">物料PAG ID:</span>
                  <span class="titleValue"> {{ item.pagId }}</span>
                </div>
                <div class="swiperContent">
                  <span class="title">扫码时间:</span>
                  <span class="titleValue"> {{ item.weighTime
                  }}</span>
                </div>
                <el-row justify="start" class="swiperCenter">
                  <el-col :span="8" :xl="8" class="bottomTitle">
                    <p>实际称重：</p>
                    <div><span class="rowNum">{{ item.actualWeight }}</span><span
                        style="font-size:16px;color:#00EDFE">kg</span></div>
                  </el-col>
                  <el-col :span="8" :xl="8" class="bottomTitle">
                    <p>称重数量：</p>
                    <div><span class="rowNum">{{ item.quantity }}</span><span
                        style="font-size:16px;color:#00EDFE">件</span></div>
                  </el-col>
                  <el-col :span="6" :xl="5"></el-col>
                </el-row>
                <div class="bottomStatusIcon" v-if="item.currentStatus == 1">
                  <img src="@/assets/matter/pass.png" />
                  <span class="statusText">清点通过，即将生成到货单</span>
                </div>
                <div class="bottomStatusIcon" v-if="item.currentStatus == 2">
                  <img src="@/assets/matter/error.png" />
                  <span class="statusErrorText">清点异常，请复核</span>
                </div>
              </div>
            </el-col>
          </el-row>
        </swiper-slide>
        <div class="swiper-button-prev" @click.stop="prevEl(item, index)" />
        <div class="swiper-button-next" @click.stop="nextEl" />
      </swiper>
    </div>
  </div>
</template>
<script setup>
import * as echarts from "echarts";
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css/pagination' // 轮播图底面的小圆点
import 'swiper/css/navigation' // 轮播图两边的左右箭头
import { Autoplay, Pagination, Navigation, Scrollbar } from 'swiper'
import screenfull from "@/utils/screenfull";
import {
  ref,
  inject,
  onMounted,
  onUnmounted,
  getCurrentInstance,
  watch,
  reactive,
  watchEffect,
  computed,
} from "vue";
import SocketStomp from "@/utils/socket";
import { useScoketData } from '@/stores/scoket'
const { proxy } = getCurrentInstance();
const $t = proxy.$t;
let isFullScreen = $ref(true)
// const stores = useScoketData();
// const Socket = new SocketStomp(
//   "http://192.168.36.68:30035/msg-ws",
//   // "http://10.221.123.1:32620/msg-ws",
//   "/matter/msg/weigh"
// );
// }
const stores = useScoketData()
const baseScoket = config().baseScoket
const Socket = new SocketStomp(baseScoket, '/matter/msg/weigh')

const data = computed(() => {
  return stores.getScoketData
})
const url =
  'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'
import Highcharts from 'highcharts/highstock';
import Highcharts3D from 'highcharts/highcharts-3d';
Highcharts3D(Highcharts);
const navigation = ref({
  nextEl: ".swiper-button-next",
  prevEl: ".swiper-button-prev",
});
let deviceList = $ref([])
// let { deviceList } = config() // 设备列表
// 在modules加入要使用的模块
const modules = [Autoplay, Pagination, Navigation, Scrollbar]
const prevEl = (item, index) => {
  // console.log('上一张' + index + item)
};
const nextEl = () => {
  // console.log('下一张')
};
// 更改当前活动swiper
const onSlideChange = (swiper) => {
  // swiper是当前轮播的对象，里面可以获取到当前swiper的所有信息，当前索引是activeIndex
  console.log(swiper.activeIndex)
}

const pieChart = ref();
let dataList = $ref([{ name: "清点通过", y: 33, color: "#25BD97" },
{ name: "清点异常待复核", y: 33, color: "#2451FF" },
{ name: "复核异常", y: 33, color: "#EDCC31" }])
// const data = (() => {
//   return stores.getScoketData;
// });
const main = ref();
onMounted(() => {
  Socket.init();
  // init()
  searchTotalData()
  getRealTimeData()
  // 获取称重设备列表
  getDevice()

});
function getDevice() {
  proxy?.$api.matter.getDeviceList({ type: 'weight' }).then((res) => {
    if (res.code == 200) {
      deviceList = res.data
      // deviceList = [{
      //   name: "称重01",
      //   sn: "w051501",
      //   subType: "W01",
      //   currentStatus: 2,
      //   img: config().imgBaseUrl + '2023-05-16/20230516145041_089189.jpg'
      // },
      //   {
      //     name: "称重02",
      //     sn: "w051502",
      //     subType: "W01",
      //     currentStatus: 2,
      //     img: config().imgBaseUrl + '2023-05-16/20230516145041_089189.jpg'
      //   },
      //   {
      //     name: "称重03",
      //     sn: "w051503",
      //     subType: "W01",
      //     img: ''
      //   }, {
      //     name: "称重04",
      //     sn: "w051504",
      //     subType: "W01",
      //     img: ''
      //     }
      // ]
    }
  })
}
let currentTime = $ref('')
let yMd = $ref('')
let times = $ref('')
let newData = $ref('')
function getRealTimeData() {
  proxy?.$api.matter.currentTime({}).then((res) => {
    getTime(new Date(res.data))
  })
}
let week = $ref('')
function getTime(date) {
  currentTime = setInterval(() => {
    let addtime = new Date(date.setSeconds(date.getSeconds() + 1));
    let getWeek_index = (new Date(date)).getDay();
    const weekArr = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"]
    week = weekArr[getWeek_index]
    yMd = addtime.getFullYear() + '-' + (addtime.getMonth() + 1).toString().padStart(2, '0') + '-' + addtime.getDate().toString().padStart(2, '0');
    times = addtime.getHours().toString().padStart(2, '0') + ':' + addtime.getMinutes().toString().padStart(2, '0') + ':' + addtime.getSeconds().toString().padStart(2, '0');
    newData = yMd + '   ' + week + times;
  }, 3000)
}
onUnmounted(() => {
  clearTimeout(currentTime)
  currentTime = ''
  if (Socket) {
    Socket.disconnect();
  }
})
const toggleFullscreen = () => {
  isFullScreen = false;
  const screen = new screenfull("log");
  if (!screen.isEnabled) {
    screen.initScreen();
  }
};
const exitFullscreen = () => {
  isFullScreen = true;
  const screen = new screenfull("log");
  if (!screen.isEnabled) {
    screen.exitScreen();
  }
};
let weightInfo = reactive({
  actualWeight: 9000, //实际称重
  currentDeviceCode: "001001", // 本次称重设备编码
  currentStatus: 1, // "本次称重状态 1:正常，2:异常"
  matterCode: "430400048", // 料号
  pagId: "PV09482023020600026", // PAG ID
  quantity: 100, // 称重数量
  weighId: 0, // 称重ID
  weighTime: "2023-04-10 20:00:46", // 称重时间
  img: config().imgBaseUrl
})
let formInfo = $ref([{
  deviceCode: 1,
  deviceName: "中小包称重1",
  name: "中小包称重1",
  pagId: "324324234",
  date: "2023-01-02 12:00:00",
  weigh: '2.6',
  num: '1',
  status: 1, // 1  清点通过，即将生成到货单   2 清点异常，请复核
},
{
  name: "中小包称重2",
  pagId: "56768",
  date: "2023-01-03 12:00:00",
  weigh: '3.6',
  num: '3',
  status: 2, // 1  清点通过，即将生成到货单   2 清点异常，请复核
}
  //   , {
  //   name: "中小包称重3",
  //   pagId: "56768",
  //   date: "2023-01-03 12:00:00",
  //   weigh: '3.6',
  //   num: '3',
  //   status: 2, // 1  清点通过，即将生成到货单   2 清点异常，请复核
  // }
  //   , {
  //   name: "中小包称重4",
  //   pagId: "56768",
  //   date: "2023-01-03 12:00:00",
  //   weigh: '3.6',
  //   num: '3',
  //   status: 2, // 1  清点通过，即将生成到货单   2 清点异常，请复核
  // }, {
  //   name: "中小包称重5",
  //   pagId: "56768",
  //   date: "2023-01-03 12:00:00",
  //   weigh: '3.6',
  //   num: '3',
  //   status: 2, // 1  清点通过，即将生成到货单   2 清点异常，请复核
  // }, {
  //   name: "中小包称重6",
  //   pagId: "56768",
  //   date: "2023-01-03 12:00:00",
  //   weigh: '3.6',
  //   num: '3',
  //   status: 2, // 1  清点通过，即将生成到货单   2 清点异常，请复核
  // }
])
// 同一个消息无法再次触发
watch(
  () => data.value,
  (data) => {
    if (data) {
      console.log('---------大屏页面-----');
      let item = eval("(" + data + ")")
      searchTotalData()
      weightInfo = { ...item }
      weightInfo.img = config().imgBaseUrl + item.img
      deviceList = deviceList.map(device => {
        if (device.sn == weightInfo.currentDeviceCode) {
          device = { ...device, ...weightInfo }
          console.log('---------device-----');
          console.log(device)
        } else {
          device = device
        }
        return device
      })
    }
  },
  { immediate: false, deep: true }
);
let topData = $ref({
  passNum: 6, // 清点通过数量
  totalNum: 7, // 今日称重清点总数
  waitCheckNum: 1, // 清点异常待复核数量
  unusualNum: 0, // 异常数量
  arrivalNum: 0, // 生成到货单数量
  checkUnusualNum: 0, // 复核异常
  passRate: 0, // 通过率
  waitCheckRate: 0, // 待复核率
  unusualRate: 0, // 异常率
})
// // 查询统计数据
function searchTotalData() {
  proxy?.$api.matter.getWeighToday({}).then((res) => {
    topData = res.data
    if (topData.passNum == 0 || topData.totalNum == 0) { //通过率
      topData.passRate = 0
    } else if (topData.passNum != 0 && topData.totalNum != 0) {
      topData.passRate = Number((topData.passNum / topData.totalNum).toFixed(1)) * 100
    }
    if (topData.waitCheckNum == 0 || topData.totalNum == 0) { //待复核率
      topData.waitCheckRate = 0
    } else if (topData.waitCheckNum != 0 && topData.totalNum != 0) {
      topData.waitCheckRate = Number((topData.waitCheckNum / topData.totalNum).toFixed(1)) * 100
    }
    if (topData.unusualNum == 0 || topData.totalNum == 0) { //异常率
      topData.unusualRate = 0
    } else if (topData.unusualNum != 0 && topData.totalNum != 0) {
      topData.unusualRate = Number((topData.unusualNum / topData.totalNum).toFixed(1)) * 100
    }
    dataList[0].y = topData.passRate;
    dataList[1].y = topData.waitCheckRate;
    dataList[2].y = topData.unusualRate;
    if (topData.passRate == 0 && topData.waitCheckRate == 0 && topData.unusualRate == 0) {
      dataList[0].y = 33;
      dataList[1].y = 33;
      dataList[2].y = 33;
    }
    init();
  })
}
const init = () => {
  let random = randomNum(0, dataList.length - 1);
  let data = dataList.map((item, index) => {
    if (index === random) {
      return {
        ...item,
        sliced: true,
        selected: true,
      }
    }
    return item
  })
  let myChart = Highcharts.chart(pieChart.value, {
    credits: {
      enabled: false, // 禁用版权信息
    },
    chart: {
      type: 'pie',
      backgroundColor: 'rgba(0,0,0,0)',
      options3d: {
        enabled: true,
        alpha: 35,
      },
      spacingTop: 0,
      spacingLeft: 0,
      spacingRight: 0,
    },
    title: {
      text: '',
      floating: true,
    },
    tooltip: {
      enabled: false,
      headerFormat: '',
      pointFormat:
        '<span style="color:{point.color}">\u25CF</span> <b> {point.name}</b><br/>' +
        '占比: <b>{point.y}%</b><br/>',
    },
    legend: {
      //图例
      align: 'center', //程度标的目标地位
      layout: 'horizontal',
      verticalAlign: 'bottom', //垂直标的目标地位
      // padding: 10,
      margin: 10,
      bottom: 0,
      itemStyle: {
        cursor: 'pointer',
        color: '#FFFFFF',
        fontWeight: 100,
        backgroundColor: ['#ccc'],
      },
      itemHoverStyle: {
        color: '#FFFFFF',
      },
      symbolWidth: 13, //设置为正方形
      symbolHeight: 10,
      symbolRadius: 0,
      itemMarginBottom: -20,

    },
    plotOptions: {
      pie: {
        innerSize: 60,
        depth: 30,
        allowPointSelect: true,
        dataLabels: {
          enabled: true,
          distance: -18, //这里注释掉，数字就会在外面，并且有牵引线
          color: '#fff',
          // format: '{point.percentage:.1f}%',
          formatter: function () {
            console.log('数据', this.point.y)
            if (this.point.y == 33) {
              return '0%'
            } else {
              return this.point.y + '%'
            }

          },
          style: {
            fontSize: '13px',
            fontWeight: 'none',
            textOutline: 'none',
            fontFamily: 'SourceHanSansCN',
            top: '50px',
            textAlign: 'left',
            textDecoration: 'center',
          },
        },
        states: {
          inactive: {
            opacity: 1,
          },
        },
        showInLegend: true,
        slicedOffset: 10,
      },
    },
    series: [
      {
        data: data,
      },
    ],
  });
}
function randomNum(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
</script>
<style lang="less" scoped>
.container {
  background-color: #071d37;
  width: 100%;
  height: auto;
  // overflow: hidden;
  color: #fff;
  padding: 37px 29px;
  box-sizing: border-box;
}

.containerTop {
  box-sizing: border-box;
  background-image: url("@/assets/matter/top.png");
  background-size: 100% 100%;
  height: 327px;
  overflow: hidden;
  padding: 30px 30px 0 0;

  .topTitle {
    height: 20px;
    text-align: right;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    font-size: 18px;
    font-weight: 400;
    color: #92e7ff;
    line-height: 24px;
    box-sizing: border-box;
    // padding: 30px 30px 0 0;
  }

  .topWrap {
    display: flex;
    justify-content: space-between;

    .topEchart {
      display: inline-block;
      width: 24%;
      height: 253px;
      padding: 10px 0px;
      box-sizing: border-box;

      .charts {
        height: 100%;
        width: 100%;
      }
    }

    .topCenter {
      width: 58%;
      height: 253px;
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-start;

      .itemInd {
        flex: 1;
        height: 125px;
        position: relative;
        max-width: 33%;
        display: flex;

        .textBackground {
          float: left;
          position: relative;
          width: 140px;
          height: 80px;
          background: url("@/assets/matter/iconBottom.png") 0 0 no-repeat;
          background-size: 100% 100%;

          img {
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            width: 50px;
          }
        }

        .textNum {
          float: left;
          width: 240px;


          span {
            font-size: 20px;
            font-weight: normal;
            font-family: "Adobe Heiti Std";
            color: #D5E4F9;
            line-height: 31px;
            opacity: 0.9;
            letter-spacing: 2px;
          }

          p {
            margin-top: 15px;
            font-size: 48px;
            font-family: PangMenZhengDao;
            font-weight: normal;
            color: #48ECE7;
            line-height: 37px;
          }
        }
      }
    }

    .topRight {
      display: inline-block;
      width: 18%;
      height: 253px;
      // background: #999;

      >img {
        width: 110%;
      }
    }
  }


}


.containerBottom {
  margin-top: 44px;
  height: 720px;

  .bottomDiv {
    height: 90%;
    display: flex;

    .bottomPic {
      // margin: 10px;
      // max-width: 33%;
      flex: 1;
      background-size: 100% 100%;
    }

    .bottomOnePic {
      background-image: url("@/assets/matter/oneBorder.png");
      flex: 1;
      background-size: 100% 100%;

      .leftTitle {
        margin: 85px auto 10px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #00EDFE;
        width: 80%;
        height: 45px;
        font-size: 24px;
        background: url("@/assets/matter/textOne.png") 0 0 no-repeat;
        background-size: 100% 100%;
      }

      .bottomTextTop {
        margin-top: 40px;
        z-index: 777;
        position: relative;
      }

      .rightImg {
        height: 85%;
        margin: 40px;
        position: relative;

        .itemImg {
          position: absolute;
          right: 0;
          width: 325px;
          height: 385px;
          z-index: 888;
        }

        .statusImg {
          position: absolute;
          right: 0;
          width: 904px;
          height: 385px;
          z-index: 111;
        }
      }
    }

    .bottomPic.left {
      background-image: url("@/assets/matter/left.png");
      margin-right: 30px;
    }

    .bottomPic.center {
      background-image: url("@/assets/matter/center.png");
      margin-right: 30px;
    }

    .bottomPic.right {
      background-image: url("@/assets/matter/end.png");
    }
  }
}

.containerBottomImg {
  margin: 20px;
  background-size: 100% 100%;

  .swiperContent {
    margin-top: 40px;
  }

  .swiperCenter {
    margin-top: 80px;
  }
}

.containerBottomImg.left {
  background-image: url("@/assets/matter/left.png");
}

.containerBottomImg.center {
  background-image: url("@/assets/matter/border.png");
}

.containerBottomImg.right {
  background-image: url("@/assets/matter/end.png");
}



.leftTitle {
  margin: 85px auto 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #00EDFE;
  width: 80%;
  height: 45px;
  font-size: 24px;
  background: url("@/assets/matter/text.png") 0 0 no-repeat;
  background-size: 100% 100%;
}


.title {
  font-size: 18px;
  font-family: PingFang SC;
  font-weight: 400;
  color: #DDDDDD;
}

.titleValue {
  margin-left: 18px;
  color: #00EDFE;
  font-size: 20px;
  font-weight: 400
}

.bottomTitle {
  font-size: 18px;
  font-family: PingFang SC;
  font-weight: 600;
  color: #DDDDDD;

  p {
    margin-bottom: 28px;
  }
}

.rowNum {
  font-size: 48px;
  font-family: PangMenZhengDao;
  font-weight: normal;
  color: #00EDFE;
}

.statusText {
  font-size: 36px;
  font-family: PangMenZhengDao;
  font-weight: normal;
  color: #00EDFE;
  background: linear-gradient(0deg, #A6E7FF 0%, #00EAFF 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.statusErrorText {
  font-size: 36px;
  font-family: PangMenZhengDao;
  font-weight: normal;
  color: #FF1F2A;
}

.bottomStatusIcon {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: center;
  margin-top: 30px;

  img {
    width: 120px;
    height: 120px;
  }
}


.rightImg {
  height: 70%;
  margin: 40px;
  position: relative;

  .itemImg {
    width: 190px;
    height: 230px;
    position: absolute;
    right: 0;
    z-index: 888;
  }

  .statusImg {
    position: absolute;
    right: 0;
    width: 349px;
    height: 230px;
    z-index: 100;
  }

  .statusImg2 {
    position: absolute;
    right: 0;
    width: 527px;
    height: 230px;
    z-index: 10;
  }

  .statusImg3 {
    position: absolute;
    right: 0;
    width: 727px;
    height: 230px;
    z-index: 10;
  }

  .itemImg2 {
    width: 275px;
    height: 230px;
    position: absolute;
    right: 0;
    z-index: 99;
  }

  .bottomTextTop {
    margin-top: 40px;
    z-index: 777;
    position: relative;
  }

  .bottomTextCenter {
    margin-top: 80px;
    z-index: 999;
  }
}

.rightImgList {
  height: 70%;
  margin: 60px;
}

.rightImgList.error {
  background: url("@/assets/matter/backgroundOne.png") 0 0 no-repeat;
  background-size: 50% 50%;
  background-position-x: right;
  background-position-y: 10px;
}

.rightImgList.success {
  background: url("@/assets/matter/background.png") 0 0 no-repeat;
  background-size: 50% 50%;
  background-position-x: right;
  background-position-y: 10px;
}

.rightImgList.null {
  background: url("@/assets/matter/null.png") 0 0 no-repeat;
  background-size: 100% 48%;
  background-position-x: right;
  background-position-y: 10px;
}

.carouselImg {
  object-fit: scale-down;
  width: 100%;
  height: 100%
}


/* 当前被选中的指示器样式 */
// :deep(.el-carousel__indicator--horizontal.is-active .el-carousel__button) {
//   width: 10px;
//   height: 10px;
//   border-radius: 50%;
//   opacity: 1;
// }

:deep(.el-carousel__container) {
  width: 100%;
}

:deep(.el-carousel__mask) {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: var(--el-color-white);
  opacity: 0.00001;
  transition: var(--el-transition-duration-fast);
}

:deep(.el-carousel) {
  --el-carousel-arrow-font-size: 0.0625rem;
  --el-carousel-arrow-size: 0.1875rem;
  // --el-carousel-arrow-background: rgba(31, 45, 61, 0.11);
  // --el-carousel-arrow-hover-background: rgba(31, 45, 61, 0.23);
  --el-carousel-indicator-width: 0.15625rem;
  --el-carousel-indicator-height: 0.010417rem;
  --el-carousel-indicator-padding-horizontal: 0.020833rem;
  --el-carousel-indicator-padding-vertical: 0.0625rem;
  // --el-carousel-indicator-out-color: var(--el-border-color-hover);
  position: relative;
}

.swiperBox {
  height: 90%;
}
</style>
 