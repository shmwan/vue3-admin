<template>
  <div class="LeftEcharts">
    <div class="chartsTitle">
      <div class="titText">生产用料占比统计</div>
      <div style="width: 60%">
        <el-date-picker
          class="datePicker"
          v-model="datas.value2"
          type="daterange"
          size="default"
          value-format="YYYY-MM-DD"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          @change="dateChange"
          :disabled-date="disabledDate"
          @calendar-change="calendarChange"
          @visible-change="clearDisabledDate"
        />
      </div>
    </div>
    <div ref="leftCharts" style="width: 100%; height: calc(100% - 48px)"></div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref, reactive, getCurrentInstance } from 'vue'
  import * as echarts from 'echarts'
  const { proxy } = getCurrentInstance() as any
  const leftCharts = ref()
  interface Datas {
    xData: any
    yData: any
    colorList: any
    showData: any
    value2: any
    zData: any
  }
  const datas: Datas = reactive({
    value2: [],
    // xData: [
    //   '料号1',
    //   '料号2',
    //   '料号3',
    //   '料号4',
    //   '料号5',
    //   '其他',
    //   '111',
    //   '料号11',
    //   '料号21',
    //   '料号31',
    //   '料号41'
    // ],

    // yData: [
    //   '500',
    //   '400',
    //   '300',
    //   '200',
    //   '100',
    //   '250',
    //   '111',
    //   '500',
    //   '400',
    //   '300',
    //   '200'
    // ],
    // zData: ['30', '10', '10', '20', '15', '5', '10', '20', '15', '5', '10'],
    xData: [],
    yData: [],
    zData: [],
    colorList: [
      '#3BA0FF',
      '#36CBCB',
      '#4DCB73',
      '#FAD337',
      '#F2637B',
      '#975FE4'
    ],
    showData: []
  })
  let selectData = ref()
  const dateChange = (dates: any) => {
    datas.value2 = dates
    if (dates === null || dates.length === 0) {
      selectData.value = null
    }
    getData()
  }
  // 选中日历日期后会执行的回调!!只选择一个日期就会执行,官网写的不清楚
  // 主要用这个方法获取到用户选择的初始时间,然后在禁用方法里通过这个时间设置结束时间的禁用时间
  const calendarChange = (dates: any) => {
    let hasSelectDate = dates !== null && dates.length > 0
    selectData.value = hasSelectDate ? dates[0] : null
  }
  const clearDisabledDate = (visibility: boolean) => {
    console.log(visibility)
    if (visibility) {
      selectData.value = null
      // disabledDate(null)
    }
  }
  const disabledDate = (time: any) => {
    const timeRange = 1 * 24 * 60 * 60 * 1000 // 1天时间戳
    const tempTime = Date.now()
    if (selectData.value) {
      const minTime = new Date(selectData.value).getTime()
      const maxTime = new Date(selectData.value).getTime() + timeRange * 365
      if (tempTime < maxTime) {
        return time.getTime() < minTime || time.getTime() > tempTime
      }
      return time.getTime() < minTime || time.getTime() > maxTime
    } else {
      return time.getTime() >= tempTime
    }
  }
  //获取近一月的时间
  const getLastMonth = () => {
    let now = new Date()
    let year = now.getFullYear()
    let month = now.getMonth() + 1 //0-11表示1-12月
    let day = now.getDate()
    let nowDate = ''
    let LastDate = ''
    nowDate =
      year +
      '-' +
      (month < 10 ? '0' + month : month) +
      '-' +
      (day < 10 ? '0' + day : day)
    var nowMonthDay = new Date(year, month, 0).getDate() //当前月的总天数
    if (month - 1 <= 0) {
      //如果是1月，年数往前推一年<br>
      LastDate = year - 1 + '-' + 12 + '-' + day
    } else {
      var lastMonthDay = new Date(year, parseInt(month) - 1, 0).getDate()
      if (lastMonthDay < day) {
        // 1个月前所在月的总天数小于现在的天日期
        if (day < nowMonthDay) {
          let lastDay = lastMonthDay - (nowMonthDay - day)
          //当前天日期小于当前月总天数
          LastDate =
            year +
            '-' +
            (month - 1 < 10 ? '0' + (month - 1) : month - 1) +
            '-' +
            (lastDay < 10 ? '0' + lastDay : lastDay)
        } else {
          LastDate =
            year +
            '-' +
            (month - 1 < 10 ? '0' + (month - 1) : month - 1) +
            '-' +
            (lastMonthDay < 10 ? '0' + lastMonthDay : lastMonthDay)
        }
      } else {
        LastDate =
          year +
          '-' +
          (month - 1 < 10 ? '0' + (month - 1) : month - 1) +
          '-' +
          (day < 10 ? '0' + day : day)
      }
    }
    datas.value2 = [LastDate, nowDate]
    getData()

    // return dateObj
  }

  const initEcharts = () => {
    datas.showData = []
    for (var i = 0; i < datas.yData.length; i++) {
      datas.showData.push({
        name: datas.xData[i],
        value: datas.yData[i],
        per: datas.zData[i]
      })
    }
    const myChart = echarts.init(leftCharts.value)
    myChart.clear()
    let option = {
      title: {
        text: '生产用料',
        x: '24%',
        y: '42%',
        textStyle: {
          fontSize: 20
        }
      },
      color: datas.colorList,
      tooltip: {
        show: true,
        trigger: 'item',
        formatter(item: any) {
          const { marker, name, value, data } = item
          let res = `${marker}${name}:<span style="font-weight:700">${value}</span> ${data.per}%`
          return res
        }
        // position: 'right'
      },
      legend: {
        type: 'scroll',
        orient: 'vertical',
        right: '12%',
        // top: 'center',
        top: '20%',
        //  itemGap: 40,
        selectedMode: true,
        data: datas.xData,
        icon: 'circle'
      },
      series: [
        {
          type: 'pie',
          center: ['35%', '45%'],
          radius: ['35%', '60%'],
          clockwise: true,
          avoidLabelOverlap: true,
          hoverOffset: 60,
          emphasis: {
            itemStyle: {
              borderColor: '#fff',
              borderWidth: 1
            }
          },
          itemStyle: {
            normal: {
              //   color: function (params: any) {
              //     return datas.colorList[params.dataIndex]
              //   },
              borderWidth: 10,
              borderColor: '#ffffff'
            }
          },
          label: {
            show: false,
            position: 'inside',
            formatter(item: any) {
              return `${datas.zData[item.dataIndex]}%`
            },
            textStyle: {
              fontSize: 16,
              color: '#ffffff'
            }
          },
          data: datas.showData
        }
      ]
    }
    myChart.setOption(option)
    let index = 0

    let timer = setInterval(function () {
      myChart.dispatchAction({
        type: 'hideTip',
        seriesIndex: 0,
        dataIndex: index
      })
      // 显示提示框
      myChart.dispatchAction({
        type: 'showTip',
        seriesIndex: 0,
        dataIndex: index
      })
      // 取消高亮指定的数据图形
      myChart.dispatchAction({
        type: 'downplay',
        seriesIndex: 0,
        dataIndex: index == 0 ? datas.yData.length : index - 1
      })
      myChart.dispatchAction({
        type: 'highlight',
        seriesIndex: 0,
        dataIndex: index
      })
      index++
      if (index > datas.yData.length) {
        index = 0
      }
    }, 3000)
    myChart.on('mouseover', params => {
      clearInterval(timer)
      myChart.dispatchAction({
        type: 'hideTip',
        seriesIndex: 0
      })
      myChart.dispatchAction({
        type: 'downplay',
        seriesIndex: 0
      })

      myChart.dispatchAction({
        type: 'showTip',
        seriesIndex: 0,
        dataIndex: params.dataIndex
      })
      myChart.dispatchAction({
        type: 'highlight',
        seriesIndex: 0,
        dataIndex: params.dataIndex
      })
    })
    myChart.on('mouseout', params => {
      timer = setInterval(function () {
        myChart.dispatchAction({
          type: 'hideTip',
          seriesIndex: 0,
          dataIndex: index
        })
        // 显示提示框
        myChart.dispatchAction({
          type: 'showTip',
          seriesIndex: 0,
          dataIndex: index
        })
        // 取消高亮指定的数据图形
        myChart.dispatchAction({
          type: 'downplay',
          seriesIndex: 0,
          dataIndex: index == 0 ? datas.yData.length : index - 1
        })
        myChart.dispatchAction({
          type: 'highlight',
          seriesIndex: 0,
          dataIndex: index
        })
        index++
        if (index > datas.yData.length) {
          index = 0
        }
      }, 3000)
    })
    window.addEventListener('resize', () => {
      myChart.resize()
    })
  }
  const getData = () => {
    if (datas.value2 === null || datas.value2.length === 0) {
      return false
    }
    let start = datas.value2[0] + ' 00:00:00'
    let end = datas.value2[1] + ' 23:59:59'
    let params = {
      startTime: start,
      endTime: end,
      n: config().topN
      // n: 10
    }

    proxy.$api.bigScreen.matterStatistics(params).then((res: any) => {
      if (res.code == 200) {
        let dataList = res.data
        datas.xData = []
        datas.yData = []
        datas.zData = []
        console.log(datas, 'datas')
        dataList.forEach((item: any) => {
          datas.xData.push(item.matterCode)
          datas.yData.push(item.num)
          datas.zData.push(item.percentage)
        })
        // if (dataList == null || dataList.length == 0) {
        //   return
        // }
        initEcharts()
      } else {
        ElMessage({
          message: res.message + '!',
          type: 'error'
        })
      }
    })
  }
  onMounted(() => {
    // initEcharts()
    getLastMonth()
  })
</script>

<style scoped lang="less">
  .LeftEcharts {
    width: 100%;
    height: 100%;
    :deep(.el-range-editor.el-input__wrapper) {
      width: 100%;
      box-sizing: border-box;
    }
  }
</style>
<style>
  .el-picker__popper.el-popper {
    z-index: 99999999 !important;
  }
</style>
