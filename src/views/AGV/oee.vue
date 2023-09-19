<template>
  <div class="AGVOEE">
    <div class="AGVTitle">AGV-当天OEE实时统计</div>
    <div class="AVGBox">
      <div class="echartsCon" v-for="(item, index) in datas" :key="index">
        <div class="leftCon">
          <div class="leftEchart">
            <liquidfillChart :data="item.utilization_rate"></liquidfillChart>
          </div>
          <span> SMT-{{ item.amr_no }} <b> 稼动率</b> </span>
        </div>
        <div class="rightCon">
          <charts class="charts" :data="item"></charts>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import charts from './barCharts.vue'
  import liquidfillChart from './liquidfillChart.vue'
  import DateUtils from '@/utils/dateUtils.js'
  const { proxy } = getCurrentInstance() as any

  let AGvList = reactive([
    {
      amr_no: '41',
      amr_type: 2,
      charge_duration: 0,
      charge_mileage: 0,
      date: '2023-06-27',
      delivery_duration: 80,
      delivery_mileage: 199,
      empty_run_duration: 256,
      empty_run_mileage: 127,
      run_duration: 336,
      run_mileage: 326,
      utilization_rate: 23
    },
    {
      amr_no: '40',
      amr_type: 2,
      charge_duration: 0,
      charge_mileage: 0,
      date: '2023-06-27',
      delivery_duration: 80,
      delivery_mileage: 198,
      empty_run_duration: 85,
      empty_run_mileage: 127,
      run_duration: 165,
      run_mileage: 325,
      utilization_rate: 48
    }
  ])
  let refreshRime = config().AgvPickTime || 5000
  let datas = reactive<any[]>([])
  //   datas = AGvList
  let timer = $ref<any>()
  onMounted(() => {
    getAgvData()
    timer = setInterval(getAgvData, refreshRime)
  })
  const getAgvData = async () => {
    let interval_start =
      new Date(
        DateUtils.format(new Date(), 'yyyy-MM-dd') + ' ' + '00:00:00'
      ).getTime() / 1000
    let interval_end =
      new Date(
        DateUtils.format(new Date(), 'yyyy-MM-dd') + ' ' + '23:59:59'
      ).getTime() / 1000
    let params = {
      amr_no: 1,
      interval_start,
      interval_end
    }
    try {
      let res = await proxy.$api.AGV.getAmr(params)
      if (res.data) {
        //   datas = AGvList
        datas = res.data
      }
    } catch (error) {
      clearInterval(timer) // 任务完成后，可以清除timer
    }
  }
  onUnmounted(() => {
    clearInterval(timer) // 任务完成后，可以清除timer
  })
</script>

<style scoped lang="less">
  .AGVOEE {
    .AGVTitle {
      font-size: 18px;
      font-family: PingFang SC;
      font-weight: 400;
      color: #ffffff;
    }
    .AVGBox {
      height: 393px;
      width: 100%;
      background: url('/src/assets/img/AGV/background.png') no-repeat center
        center;
      background-size: 100% 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      .echartsCon {
        height: 50%;
        width: 100%;
        display: flex;
        .leftCon {
          width: 122px;
          height: 122px;
          background: url('@/assets/img/AGV/Echartback.png') no-repeat center
            center;
          background-size: contain;
          margin-top: 30px;
          margin-left: 27px;
          position: relative;
          span {
            position: absolute;
            bottom: -30px;
            width: 100%;
            font-size: 14px;
            font-family: PingFang SC;
            font-weight: 400;
            color: #16ddd8;
            display: block;
            text-align: center;
            b {
              color: #ffffff;
              margin-left: 5px;
            }
          }
        }
        .leftEchart {
          width: 70px;
          height: 70px;
          margin: 25px auto 0;
        }
        .rightCon {
          width: 250px;
          height: 100%;
          padding-top: 30px;
          padding-left: 30px;
          margin-left: 30px;
          box-sizing: content-box;
          .charts {
            width: 100%;
            height: 160px;
          }
        }
      }
    }
  }
</style>
