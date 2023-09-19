<template>
  <div class="rightPeople">
    <div class="left">
      <div>
        <span class="text">计划人力：</span>
        <span class="people"><span class="ft22">{{ datas.showList.plancount }}</span>人</span>
      </div>
      <div>
        <div class="text">出勤率:</div>
        <!--  -->
        <span class="peopleRate">{{ datas.showList.chuqinRate }}</span><span class="rate">%</span>
      </div>
    </div>
    <div class="right">
      <div class="right_kuang">
        <div class="img">
          <img width="100%" height="100%" src="@/assets/img/AIBig/qingjia.png" alt="" />
          <div class="num">
            <span>{{ datas.showList.inputManpower }}</span>
            <!-- <span>12.123%</span> -->
            <span class="numxiao">人</span>
          </div>
        </div>
        <div class="worded">出勤</div>
      </div>
      <!-- <div class="right_kuang">
        <div class="img">
          <img width="100%" height="100%" src="@/assets/img/AIBig/qingjia.png" alt="" />
          <div class="num">
            <span>{{ datas.showList.qjcount }}</span>
            <span class="numxiao">人</span>
          </div>
        </div>
        <div class="worded">请假</div>
      </div> -->
      <div class="right_kuang">
        <div class="img">
          <img width="100%" height="100%" src="@/assets/img/AIBig/kuanggong.png" alt="" />
          <div class="num">
            <span>{{ datas.showList.kgcount }}</span>
            <span class="numxiao">人</span>
          </div>
        </div>
        <div class="worded">旷工</div>
      </div>
      <div class="right_kuang">
        <div class="img">
          <img width="100%" height="100%" src="@/assets/img/AIBig/zhichu.png" alt="" />
          <div class="num">
            <span>{{ datas.showList.zhichucount }}</span>
            <span class="numxiao">人</span>
          </div>
        </div>
        <div class="worded">支出</div>
      </div>
      <div class="right_kuang">
        <div class="img">
          <img width="100%" height="100%" src="@/assets/img/AIBig/zhiru.png" alt="" />
          <div class="num">
            <span>{{ datas.showList.zhirucount }}</span>
            <span class="numxiao">人</span>
          </div>
        </div>
        <div class="worded">支入</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, toRaw, getCurrentInstance, onMounted } from 'vue'
import DateUtils from '@/utils/dateUtils.js'
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

})
const searchTopData = (obj: any, params: any) => {
  getDataList(obj, params)
  // proxy.$api.bigScreen.getSystem({}).then((res: any) => {
  //   if (res.code == 200) {
  //     data.type = res.data.type

  //   }
  // })
}
const getDataList = (obj: any, params: any) => {
  let data = {
    lineCode: obj.lineCodeLong,
    recordTime: DateUtils.format(new Date(), 'yyyy-MM-dd'),
    workShift: params.type
  }
  proxy.$api.bigScreen.getOutputInfo(data).then((res: any) => {
    if (res.code == 200) {
      datas.showList = res.data
    }
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

  .left {
    width: 50%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .text {
      font-size: 18px;
      font-family: PingFang SC;
      font-weight: 600;
      color: #ffffff;
    }

    .people {
      font-size: 18px;
      font-weight: 600;
      color: #57e6ff;

      .ft22 {
        font-size: 22px;
      }
    }

    .peopleRate {
      font-size: 55px;
      font-family: PangMenZhengDao-3;
      font-weight: 400;
      color: #57e6ff;


    }

    .rate {
      font-size: 24px;
      font-family: PangMenZhengDao-3;
      font-weight: 400;
      color: #57e6ff;
    }
  }

  .right {
    width: 50%;
    height: 100%;

    .right_kuang {
      display: flex;
      align-items: center;
      cursor: pointer;
      height: 42px;

      .img {
        width: 106px;
        height: 36px;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;

        img {
          width: 100%;
          height: 100%;
        }
      }

      .num {
        position: absolute;
        font-size: 16px;
        font-family: SourceHanSansSC, SourceHanSansSC-Medium;
        font-weight: 500;
        color: #eeeef4;
        line-height: 24px;
        letter-spacing: 1px;
        text-shadow: 0px 2px 2px rgba(0, 0, 0, 0.5);

        .numxiao {
          font-size: 12px;
        }
      }

      .worded {
        margin-left: 25px;
        font-size: 14px;
        font-family: SourceHanSansSC, SourceHanSansSC-Normal;
        font-weight: Normal;
        text-align: left;
        color: #eeeef4;
        white-space: nowrap;
        line-height: 20px;
        letter-spacing: 1px;
      }
    }
  }
}
</style>
