<template>
  <div class="AGVleftBottom">
    <div class="AGVTitle">领料信息</div>
    <div class="AVGBox">
      <div class="header">
        <div class="title">领料单号</div>
        <div class="title">物料编号</div>
        <div class="title">领料数量</div>
        <div class="title">线体</div>
        <div class="title">领料时间</div>
      </div>
      <vue3-seamless-scroll
        :list="datas.tableList"
        class="scroll"
        limitScrollNum="8"
        :hover="true"
        step="0.5"
        :isWatch="true"
        v-if="datas.show"
      >
        <div
          v-for="(item, index) in datas.tableList"
          :key="index"
          class="table"
        >
          <div class="content">{{ item.billCode }}</div>
          <div class="content">{{ item.materialCode }}</div>
          <div class="content">{{ item.qty }}({{ item.unit }})</div>
          <div class="content">{{ item.lineCode }}</div>
          <div class="content">{{ item.receiveTime }}</div>
        </div>
      </vue3-seamless-scroll>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { getCurrentInstance, reactive, computed, ref, toRefs } from 'vue'
  import DateUtils from '@/utils/dateUtils.js'
  const { proxy } = getCurrentInstance()
  let timer: any = null
  interface Datas {
    tableList: any
    show: boolean
  }
  let refreshRime = config().AgvPickTime || 5000
  let datas: Datas = reactive({
    tableList: [],
    show: true
  })
  const searchData = async () => {
    try {
      let current = new Date()
      let Time = DateUtils.format(new Date(current), 'yyyy-MM-dd')
      let params = {
        startDate: Time,
        pageNo: 1,
        pageSize: 99999
      }
      let res = await proxy.$api.AGV.AGVmaterial(params)
      console.log(res)
      if (res.code == 200) {
        datas.tableList = res.data.records
      } else {
        ElMessage({
          message: res.message + '!',
          type: 'error'
        })
      }
    } catch (error) {
      console.log(error, 'errorerror')
    }
  }
  const onRefresh = () => {
    datas.show = false
    nextTick(() => {
      datas.show = true
    })
  }
  onMounted(() => {
    searchData()
    // console.log('refreshRime', refreshRime)
  })

  timer = setInterval(() => {
    searchData()
  }, refreshRime)
  onUnmounted(() => {
    if (timer) clearInterval(timer)
  })
</script>

<style scoped lang="less">
  .AGVleftBottom {
    width: 100%;
    height: 255px;
    margin-top: 10px;
    // background-color: #fff;
    .AGVTitle {
      font-size: 18px;
      font-family: PingFang SC;
      font-weight: 400;
      color: #ffffff;
    }
    .AVGBox {
      width: 100%;
      height: 235px;
      background: url('/src/assets/img/AGV/background.png') no-repeat center
        center;
      background-size: 100% 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      .header {
        width: 100%;
        display: flex;
        justify-content: space-evenly;
        margin-top: 20px;
        .title {
          width: 75px;
          height: 33px;
          background: rgba(11, 206, 252, 0);
          box-shadow: 0px 0px 50px 0px rgba(8, 193, 252, 0.7) inset;
          text-align: center;
          font-size: 14px;
          font-family: PingFang SC;
          font-weight: 400;
          color: #ffffff;
          line-height: 33px;
        }
      }
      .scroll {
        width: 100%;
        height: 190px;
        overflow-y: hidden;
        .table {
          width: 100%;
          display: flex;
          justify-content: space-evenly;
          margin-top: 8px;
          .content {
            width: 75px;
            height: 33px;
            background: rgba(4, 144, 251, 0.2);
            font-size: 14px;
            font-family: PingFang SC;
            font-weight: 400;
            color: #ffffff;
            text-align: center;
            display: flex;
            justify-content: center;
            align-items: center;
          }
        }
      }
    }
  }
</style>
