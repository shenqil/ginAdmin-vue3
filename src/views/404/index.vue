<template>
  <div style="margin-top: 200px">
    <a-empty>
      <template #description>
        <h2>404</h2>
      </template>
      <a-button type="primary" @click="handleGoLogin">返回登录页</a-button>
    </a-empty>
  </div>
</template>

<script>
export default {
  methods: {
    handleGoLogin() {
      this.$router.push({
        name: "Login",
        replace: true,
      });
    },
  },
};
</script>
