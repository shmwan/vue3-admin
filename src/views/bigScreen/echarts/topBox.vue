<template>
  <div class="rightPeople">
    <div class="columnar">
      <div ref="echartsTop" class="charts"></div>
      <!-- <div class="name">出勤率</div> -->
    </div>

    <div class="plan">
      <div class="bg">
        <span class="numbers">{{ datas.showList.plancount }}</span>
      </div>
      <div class="name">计划人力</div>
    </div>
    <div class="chuqin">
      <div class="bg">
        <span class="numbers">{{ datas.showList.inputManpower }}</span>
      </div>
      <div class="name">出勤人数</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, toRaw, getCurrentInstance, onMounted } from 'vue'
import DateUtils from '@/utils/dateUtils.js'
import * as echarts from 'echarts'
const echartsTop = ref()
const { proxy } = getCurrentInstance() as any
interface Props {
  workType: any
}
const { workType } = defineProps<Props>()
let workShift = { ...workType }

interface Data {
  lineList: any
  type: number
  showList: any
}
let datas = reactive({
  lineList: {},
  type: null,
  showList: {
    plancount: 0,
    chuqinRate: 0,
    inputManpower: 0,
    qjcount: 0,
    kgcount: 0,
    zhichucount: 0,
    zhirucount: 0
  }
})
onMounted(() => {
  initEcharts()
})
const searchTopData = (obj: any, params: any) => {

  getDataList(obj, params)
}
const getDataList = (obj: any, params: any) => {
  let data = {
    lineCode: obj.longLineCode,
    recordTime: DateUtils.format(new Date(), 'yyyy-MM-dd'),
    workShift: params.type
  }
  proxy.$api.bigScreen.getOutputInfo(data).then((res: any) => {
    if (res.code == 200) {
      datas.showList = res.data
      initEcharts()
    }
  })
}
const initEcharts = () => {
  const myChart = echarts.init(echartsTop.value)
  myChart.clear()
  var color = new echarts.graphic.LinearGradient(
    0, 0, 1, 0, [{
      offset: 0,
      color: "#41D7F3",
    },
    {
      offset: 1,
      color: "#3D9FFF",
    }
  ]
  );
  let option = {
    backgroundColor: 'transparent',
    series: [
      {
        name: '刻度线',
        type: 'gauge',
        startAngle: 225,
        endAngle: -45,
        min: 0,
        max: 100,
        radius: '60%',
        axisLine: {
          show: true,
          lineStyle: {
            color: [
              [1, '#999']
            ],
            width: 0,
            opacity: 1
          }
        },
        title: {
          show: false
        },
        detail: {
          show: true,
          fontFamily: 'DIN',
          fontWeight: '500',
          color: '#10ECF0',
          offsetCenter: [0, '80%'],
          formatter: function (value) {
            return value + "%"
          },
        },
        axisTick: {
          length: 5,
          lineStyle: {
            color: 'rgba(60,189,252,0.5)'
          }
        },
        splitLine: {
          // 分隔线
          length: 10, // 属性length控制线长
          lineStyle: { // 属性lineStyle（详见lineStyle）控制线条样式
            color: 'rgba(60,189,252,1)',
          }
        },
        axisLabel: {
          //数字离圆的距离
          distance: 12,
          borderRadius: 1,
          color: '#E6F5EE',
          fontWeight: 600,
          padding: 1,
          fontFamily: 'Alibaba PuHuiTi',
          fontSize: 12
        },
        // axisLabel: {
        //     color: '#999'
        // },
        pointer: {
          // show:false,
          width: 6,
          length: 60
        },
        itemStyle: {
          color: color,
          shadowColor: 'rgba(0,138,255,0.45)',
          shadowBlur: 10,
          shadowOffsetX: 2,
          shadowOffsetY: 2
        },
        data: [{
          value: datas.showList.chuqinRate,
          name: '出勤率'
        }]


      },
      {
        name: "已到人数",
        type: 'gauge',
        radius: '70%',
        startAngle: 225,
        endAngle: -45,
        min: 0,
        max: 100,
        title: {
          show: false
        },
        detail: {
          show: false
        },
        axisLine: {
          show: true,
          lineStyle: {
            width: 16,

            color: [
              [
                datas.showList.chuqinRate / 100, '#00E9FF '
              ],
              [
                1, '#00A4FF'
              ]
            ],
          }
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          show: false,
        },
        axisLabel: {
          show: false
        },
        pointer: {
          show: false,
        },
        itemStyle: {
          normal: {
            color: '#54F200',
          }
        },
        data: [{
          value: datas.showList.chuqinRate,
          name: '出勤率'
        }],
        title: {
          color: '#ffffff',
          fontSize: 18,
          fontWeight: 600,
          offsetCenter: [0, '95%']//设置完成率位置

        }
      }
    ]

  }
  myChart.setOption(option)
  window.addEventListener('resize', () => {
    myChart.resize()
  })
}

defineExpose({
  searchTopData
});
</script>

<style scoped lang="less">
.rightPeople {
  width: 100%;
  height: 100%;
  margin-top: 30px;
  display: flex;
  justify-content: space-between;

  .columnar {
    width: 250px;
    height: 100%;

    .charts {
      width: 340px;
      height: 340px;
      position: relative;
      top: -100px;
      left: -80px;
    }
  }

  .name {
    font-size: 18px;
    font-family: PingFang SC;
    font-weight: 600;
    color: #FFFFFF;
    line-height: 36px;
  }

  .numbers {
    position: absolute;
    top: 40px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 30px;
    font-family: PangMenZhengDao-3;
    font-weight: 400;
  }

  .plan {
    width: 100px;
    text-align: center;

    .bg {
      height: 160px;
      width: 88px;
      background: url('/src/assets/img/AIBig/jihuaImg.png');
      background-size: 100% 100%;
      margin-bottom: 4px;
      position: relative;

      .numbers {
        color: #1BFFC6;
      }
    }


  }

  .chuqin {
    width: 100px;
    text-align: center;

    .bg {
      height: 160px;
      width: 88px;
      background: url('/src/assets/img/AIBig/chuqinImg.png');
      background-size: 100% 100%;
      margin-bottom: 4px;
      position: relative;

      .numbers {
        color: #FEC500;
      }
    }
  }


}
</style>
