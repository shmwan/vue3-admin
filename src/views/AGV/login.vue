<template>
  <div class="AGVLogin">
    <Header />
    <div class="contentLogin">
      <div class="loginImg">
        <img src="/src/assets/img/AGV/login.png" alt="" />
      </div>
      <div class="box">
        <div class="welcome">
          <div class="title">用户登录</div>
          <div>
            <el-input
              v-model="modelRef.name"
              class="w-50 m-2"
              @keydown.enter="onSubmit"
              placeholder="用户名"
            >
              <template #prefix>
                <img src="/src/assets/img/AGV/yonghuming.png" alt="" />
              </template>
            </el-input>
            <el-input
              v-model="modelRef.password"
              type="password"
              placeholder="密码"
              show-password
              @keydown.enter="onSubmit"
            >
              <template #prefix>
                <img src="/src/assets/img/AGV/password.png" alt="" />
              </template>
            </el-input>
            <div class="selectBox">
              <el-checkbox v-model="checked" label="Option 1" size="large"
                >记住密码</el-checkbox
              >
            </div>
          </div>

          <div class="loginBtn" @click="onSubmit">登录</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import Header from './header.vue'
  import { ref, reactive, toRaw, getCurrentInstance, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { useCallback } from '@/hooks/useCallback'
  import { ElMessage } from 'element-plus'
  import { encryptByDES } from '@/utils/common.js'
  import useKeyEnter from '@/hooks/useKeyEnter.ts'
  const router = useRouter()
  const { proxy } = getCurrentInstance() as any
  interface LoginForm {
    name: string
    password: string
  }
  interface SubFrom {
    modelRef: LoginForm
  }
  let checked = ref(false)

  const modelRef = reactive<LoginForm>({
    name: '',
    password: ''
  })
  const login = (modelRef: any) => {
    let pwd = encryptByDES(modelRef.password, 'sihuatech')
    const systemCode = config().systemCode || 'XCTX_MATTER'
    proxy.$api.login
      .login({
        username: modelRef.name,
        password: pwd,
        systemCode
      })
      .then((res: any) => {
        const flag = useCallback(res, '登录成功！')
        if (!flag) return
        sessionStorage.setItem('AgvToken', res.data)
        sessionStorage.setItem('token', res.data)
        router.push({ path: '/AGVTrack' })
        //调父组件 显隐切换
      })
  }
  const onSubmit = () => {
    if (modelRef.name == '') {
      ElMessage({
        message: '请输入用户名!',
        type: 'error'
      })
      return false
    }
    if (modelRef.password == '') {
      ElMessage({
        message: '请输入密码！',
        type: 'error'
      })
      return false
    }
    login(modelRef)
  }
</script>

<style scoped lang="less">
  .AGVLogin {
    width: 100%;
    height: 100%;
    background-color: #0b2d4d;
    .contentLogin {
      height: calc(100% - 160px);
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;

      .loginImg {
        width: 725px;
        height: 338px;
        margin-right: 150px;

        img {
          width: 100%;
          height: 100%;
        }
      }

      .box {
        width: 448px;
        height: 434px;
        background: url('/src/assets/img/AGV/kuang.png');
        background-size: 100% 100%;
        display: flex;
        align-items: center;
        justify-content: center;

        .welcome {
          width: 81%;
          height: 75%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: center;

          .title {
            height: 28px;
            font-size: 28px;
            font-family: PingFang SC;
            font-weight: 500;
            color: #ffffff;
          }

          .loginBtn {
            width: 100%;
            height: 50px;
            background: linear-gradient(0deg, #0177e4, #00b8ff);
            border-radius: 5px 5px 5px 5px;
            font-size: 18px;
            font-family: PingFang SC;
            font-weight: 400;
            color: #ffffff;
            text-align: center;
            line-height: 50px;
            cursor: pointer;
          }
        }
      }
    }
  }
  :deep(.el-input__wrapper) {
    background-color: RGBA(29, 59, 86, 0.1);

    border: 1.5px solid #00d2ff;
    box-shadow: none;
    border-radius: 0;
    margin-bottom: 25px;

    .el-input__inner {
      font-size: 18px;
      font-family: PingFang SC;
      font-weight: 400;
      color: #ffffff;
      height: 50px;
    }

    .el-input__inner::placeholder {
      color: #fff;
    }

    .el-input .el-input__password {
      color: #fff;
    }
  }
  :deep(.el-checkbox.el-checkbox--large) {
    height: 10px;
    .el-checkbox__input {
      background-color: RGBA(29, 59, 86, 0);
      .el-checkbox__inner {
        background-color: transparent;
        border: 1px solid #00b8ff;

        border-radius: 3px 3px 3px 3px;
      }
    }
    .el-checkbox__inner::after {
      border-color: #00b8ff;
    }
    .el-checkbox__label {
      font-size: 14px;

      color: #ffffff;
    }
  }
</style>
