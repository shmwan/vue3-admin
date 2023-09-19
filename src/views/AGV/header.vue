<template>
  <div class="hedader">
    <div class="logo">
      <img src="../../assets/img/AGV/logo.png" alt="" />
    </div>
    <div class="time">
      <img src="../../assets/img/AGV/time.png" alt="" />
      <div class="times">
        {{ nowTime }}<span>{{ nowwWeek }}</span> {{ nowDay }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import useGetDate from '@/hooks/useGetDate.ts'
  let timer: any = null
  let nowTime = $ref<string>(''),
    nowwWeek = $ref<string>(''), // 星期日或星期一或星期六开始计时，默认为星期日
    nowDay = $ref<string>('') // 当前日期显示在周日上，默认为当天计时中。
  const times = () => {
    let { year, weeks, time } = useGetDate().getDataNow()
    nowTime = year
    nowwWeek = weeks
    nowDay = time
  }
  times()
  timer = setInterval(times, 1000)
  onUnmounted(() => {
    if (timer) clearInterval(timer)
  })
</script>

<style scoped lang="less">
  .hedader {
    width: 100%;
    height: 160px;
    background: url('@/assets/img/AGV/top.png') no-repeat;
    background-size: contain;
    .logo {
      position: absolute;
      width: 279px;
      height: 34px;
      left: 50px;
      top: 37px;
    }
    .time {
      position: absolute;
      width: auto;
      right: 27px;
      top: 48px;
      display: flex;
      align-items: center;
      img {
        display: block;
        width: 22px;
        height: 18px;
        margin-right: 20px;
      }
      .times {
        font-size: 18px;
        font-family: AlibabaSans;
        font-weight: 500;
        color: #49a3ff;
        line-height: 24px;
        span {
          color: #eef6ff;
          margin: 0 10px;
        }
      }
    }
  }
</style>
