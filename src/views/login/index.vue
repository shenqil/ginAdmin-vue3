<template>
  <div class="login">
    <div class="login_title">
      <img class="login_title-logo" src="../../assets/logo.png" alt="" />
      <h1 class="login_title-text">RBAC 后台管理系统</h1>
    </div>
    <div class="login_container">
      <n-form :model="model" ref="formRef" :rules="rules">
        <n-form-item path="userName" label="用户名称">
          <n-input
            v-model:value="model.userName"
            size="large"
            placeholder="请输入用户名称"
            @keydown.enter.prevent
          >
            <template #prefix>
              <n-icon size="20" :depth="2" color="#0e7a0d">
                <user-icon />
              </n-icon>
            </template>
          </n-input>
        </n-form-item>

        <n-form-item path="password" label="密码">
          <n-input
            v-model:value="model.password"
            size="large"
            placeholder="请输入用户密码"
            type="password"
            @keydown.enter.prevent
          >
            <template #prefix>
              <n-icon size="20" :depth="2" color="#0e7a0d">
                <password-icon />
              </n-icon>
            </template>
          </n-input>
        </n-form-item>

        <n-form-item path="captchaCode" label="验证码">
          <n-input
            v-model:value="model.captchaCode"
            size="large"
            placeholder=""
            @keydown.enter.prevent
          />

          <n-popover trigger="hover">
            <template #trigger>
              <img class="login_captcha" src="./image/login_bk.jpg" />
            </template>
            <span> 点击刷新图片 </span>
          </n-popover>
        </n-form-item>

        <div class="login_submit">
          <n-button
            :loading="loading"
            class="login_submit-btn"
            type="primary"
            size="large"
            @click="loading = !loading"
          >
            <template #icon>
              <n-icon>
                <login-icon />
              </n-icon>
            </template>
            登录
          </n-button>
        </div>
      </n-form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { User, Password, Login } from "@vicons/carbon";

export default defineComponent({
  components: {
    UserIcon: User,
    PasswordIcon: Password,
    LoginIcon: Login,
  },
  setup() {
    const formRef = ref(null);
    const loading = ref(false);
    const modelRef = ref({
      userName: null,
      password: null,
      captchaId: null,
      captchaCode: null,
    });
    return {
      formRef,
      model: modelRef,
      rules: {
        userName: {
          required: true,
          validator(rule: any, value: string) {
            if (!value) {
              return new Error("请输入用户名");
            }
            return true;
          },
          trigger: ["input", "blur"],
        },
        password: {
          required: true,
          validator(rule: any, value: string) {
            if (!value) {
              return new Error("请输入密码");
            } else if (!/^([a-zA-Z0-9_\u4e00-\u9fa5]{4,16})$/.test(value)) {
              return new Error("请输入由 [字母,数字,下划线] 组成的密码");
            }
            return true;
          },
          trigger: ["input", "blur"],
        },
        captchaCode: {
          required: true,
          validator(rule: any, value: string) {
            if (!value) {
              return new Error("请输入验证码");
            } else if (!/^([a-zA-Z0-9_\u4e00-\u9fa5]{4,16})$/.test(value)) {
              return new Error("验证码不合法");
            }
            return true;
          },
          trigger: ["input", "blur"],
        },
      },
      loading,
    };
  },
});
</script>

<style lang="scss">
.login {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: transparent url("./image/login_bk.jpg") center center no-repeat;
    filter: blur(5px);
    z-index: -1;
    background-size: cover;
  }

  &_title {
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: center;

    &-logo {
      width: 50px;
      margin-right: 10px;
    }

    &-text {
      color: #fff;
    }
  }

  &_container {
    width: 420px;
    padding: 30px 70px;
    background-color: #f7f7f7;
    border-radius: 10px;
    margin-bottom: 200px;
  }

  &_captcha {
    display: inline-block;
    height: 40px;
    margin-left: 10px;
    cursor: pointer;
  }

  &_submit {
    width: 100%;

    &-btn {
      width: 100%;
    }
  }
}

.light-green {
  height: 108px;
  background-color: rgba(0, 128, 0, 0.12);
}
.green {
  height: 108px;
  background-color: rgba(0, 128, 0, 0.24);
}
</style>
