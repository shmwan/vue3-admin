<template>
  <div class="basicBox">
    <div class="basicFrom">
      <el-form label-width="100px" label-position="left">
        <el-form-item :label="$t('lang.baseData.WLname') + '：'">
          {{ data.matterName }}
        </el-form-item>
        <el-form-item :label="$t('lang.baseData.WLCode') + '：'">
          {{ data.matterCode }}
        </el-form-item>
        <el-form-item :label="$t('lang.baseData.wlGYS') + '：'">
          {{ data.supplierName }}
        </el-form-item>
        <el-form-item :label="$t('lang.baseData.wlType') + '：'">
          {{ data.matterTypeStr }}
        </el-form-item>
        <el-form-item :label="$t('lang.InventLog.SHno') + '：'">
          {{ data.deliveryNoteNumber }}
        </el-form-item>
        <el-form-item :label="$t('lang.InventLog.PAG') + '：'">
          {{ data.pagId }}
        </el-form-item>
        <el-form-item :label="$t('lang.InventLog.PCno') + '：'">
          <div v-if="data.multipleWeighTag == 0">
            {{ data.productionBatch }}
          </div>
          <div v-if="data.multipleWeighTag == 1">{{ data.batchNo }}</div>
        </el-form-item>
        <el-form-item :label="$t('lang.InventLog.zzSLno') + '：'">
          {{ data.manufacturerItemUmber }}
        </el-form-item>
        <el-form-item :label="$t('lang.InventLog.WLdw') + '：'">
          {{ data.unit }}
        </el-form-item>
        <el-form-item :label="$t('lang.InventLog.WLNum') + '：'">
          {{ data.quantity }}
        </el-form-item>
        <el-form-item :label="$t('lang.InventLog.baoZ') + '：'">
          <div v-if="data.packageType == 1">
            {{ $t('lang.InventLog.smallB') }}
          </div>
          <div v-if="data.packageType == 2">
            {{ $t('lang.InventLog.midB') }}
          </div>
          <div v-if="data.packageType == 3">
            {{ $t('lang.InventLog.bigB') }}
          </div>
        </el-form-item>
        <el-form-item :label="$t('lang.InventLog.MaoWeight') + '：'">
          {{ data.grossWeight / 1000 }}KG
        </el-form-item>
        <el-form-item :label="$t('lang.InventLog.SJweight') + '：'">
          <span style="color: #2987ff; font-weight: 600">
            {{ data.actualWeight / 1000 }}KG
          </span>

          <span v-if="data.multipleWeighTag == 1" style="color: red">{{
            $t('lang.InventLog.more')
          }}</span>
        </el-form-item>
        <el-form-item :label="$t('lang.InventLog.CZtime') + '：'">
          {{ data.weighTime }}
        </el-form-item>
      </el-form>
    </div>
    <div class="photo">
      <div class="img">
        <el-image
          style="width: 345px; height: 225px"
          :src="imgBase + data.img"
          :zoom-rate="1.5"
          :preview-src-list="[imgBase + data.img]"
          :initial-index="4"
          fit="cover"
        />
        <!-- <img :src="imgBase + data.img" alt="" />
        <img src="../../assets/img/AIBig/lineImg.png" alt=""  /> -->
      </div>
      <div class="img">
        <el-image
          style="width: 345px; height: 225px"
          :src="imgBase + data.scanImg"
          :zoom-rate="1.2"
          :preview-src-list="[imgBase + data.scanImg]"
          :initial-index="4"
          fit="cover"
        />
        <!-- <img :src="imgBase + data.scanImg" alt="" v-if="data.scanImg" />
        <img src="../../assets/img/AIBig/img3.png" alt="" v-else /> -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, computed } from 'vue'
  const { proxy } = getCurrentInstance() as any
  const $t = proxy.$t
  interface Props {
    BasicList: any
  }
  const { BasicList } = defineProps<Props>()
  let data = computed(() => {
    return { ...BasicList }
  })
  const imgBase = ref(config().imgBaseUrl)
</script>

<style scoped lang="less">
  .el-form-item {
    margin-bottom: 0;
  }

  .basicBox {
    display: flex;
    margin-bottom: 20px;
    max-height: 450px;
    .basicFrom {
      width: 50%;
    }
    .photo {
      width: 50%;
      height: 100%;
      overflow-y: auto;
      // .img {
      //   width: 345px;
      //   height: 225px;
      // }
    }
  }
</style>
