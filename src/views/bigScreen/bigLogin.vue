<template>
  <div class="loginBox">
    <div class="loginImg">
      <img src="/src/assets/img/AIBig/AIlogin.png" alt="" />
    </div>
    <div class="box">
      <div class="welcome">
        <div class="title">欢迎登录</div>
        <el-input v-model="modelRef.name" class="w-50 m-2" placeholder="请输入登录ID">
          <template #prefix>
            <img src="/src/assets/img/AIBig/idIcon.png" alt="" />
          </template>
        </el-input>
        <el-input v-model="modelRef.password" type="password" placeholder="请输入密码" show-password>
          <template #prefix>
            <img src="/src/assets/img/AIBig/passwordIcon.png" alt="" />
          </template>
        </el-input>
        <div class="loginBtn" @click="onSubmit">登录</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, toRaw, getCurrentInstance, onMounted } from 'vue';
import { useRouter } from 'vue-router'
import { useCallback } from "@/hooks/useCallback";
import { ElMessage } from 'element-plus'
import useKeyEnter from "@/hooks/useKeyEnter.ts";
const router = useRouter();
const { proxy } = getCurrentInstance() as any;
const emit = defineEmits(['close'])
interface LoginForm {
  name: string
  password: string
}
interface SubFrom {
  modelRef: LoginForm
}

const modelRef = reactive<LoginForm>({
  name: '',
  password: "",
})
const login = (modelRef: any) => {
  let pwd = encryptByDES(modelRef.password, 'sihuatech');
  const systemCode = config().systemCode || 'XCTX_MATTER'
  proxy.$api.login.login({
    username: modelRef.name,
    password: pwd,
    systemCode
  }).then((res: any) => {
    const flag = useCallback(res, '登录成功！');
    if (!flag) return;
    sessionStorage.setItem('token', res.data);
    //调父组件 显隐切换
    emit('close')
  })
};
const onSubmit = () => {
  if (modelRef.name == "") {
    ElMessage({
      message: '请输入用户名!',
      type: "error",
    });
    return false;
  }
  if (modelRef.password == "") {
    ElMessage({
      message: '请输入密码！',
      type: "error",
    });
    return false;
  }
  login(modelRef)
};
// 加密
const encryptByDES = (message: any, key: any) => {
  const keyHex = CryptoJS.enc.Utf8.parse(key);
  const encrypted = CryptoJS.DES.encrypt(message, keyHex, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });
  return encrypted.toString();
}
useKeyEnter(onSubmit);
</script>

<style scoped lang="less">
.loginBox {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  .loginImg {
    width: 707px;
    height: 380px;
    margin-right: 40px;

    img {
      width: 100%;
      height: 100%;
    }
  }

  .box {
    width: 570px;
    height: 566px;
    background: url('/src/assets/img/AIBig/loginBg.png');
    background-size: 100% 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    .welcome {
      width: 60%;
      height: 50%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;

      .title {
        font-size: 30px;
        font-family: PingFang SC;
        font-weight: 600;
        color: #ffffff;
      }

      .loginBtn {
        width: 100%;
        height: 45px;
        background: #57e6ff;
        font-size: 16px;
        font-family: PingFang SC;
        font-weight: 400;
        color: #ffffff;
        text-align: center;
        line-height: 45px;
        cursor: pointer;
      }
    }
  }
}

:deep(.el-input__wrapper) {
  background-color: rgba(87, 230, 255, 0.1);

  border: 3px solid #37cfea;
  box-shadow: none;
  border-radius: 0;

  .el-input__inner {
    font-size: 16px;
    font-family: PingFang SC;
    font-weight: 400;
    color: #ffffff;
  }

  .el-input__inner::placeholder {
    color: #fff;
  }

  .el-input .el-input__password {
    color: #fff;
  }
}
</style>
