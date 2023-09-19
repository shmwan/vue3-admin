<template>
  <div class="error-container">
    <img class="error-svg" src="@/assets/svg/404.svg" alt="" />
    <div class="error-btn">
      <a-button type="primary" @click="goBack">
        返回首页
      </a-button>
    </div>
  </div>
</template>
<script>
import { useRouter } from 'vue-router';
export default {
  setup() {
    const router = useRouter();
    const goBack = ()=>{
      router.back();
    }
    return{
      goBack
    }
  },
}
</script>
<style lang="less" scoped>
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;

  .error-svg {
    width: 300px;
  }

  .error-btn {
    margin-top: 10px;
  }
}
</style>
