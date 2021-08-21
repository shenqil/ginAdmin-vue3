<template>
  <a-dropdown :trigger="['click']" class="admin-layout-user">
    <div class="admin-layout-user__info" @click.prevent>
      {{ userInfo.realName }}
      <DownOutlined />
    </div>
    <template #overlay>
      <a-menu>
        <a-menu-item key="modifyPassword"> 修改密码 </a-menu-item>
        <a-menu-divider />
        <a-menu-item key="signOut" @click="handleSignOut">退出登录</a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { DownOutlined } from "@ant-design/icons-vue";
import { useStore } from "vuex";
import { ILoginUserInfo } from "../../server/interface";

export default defineComponent({
  components: {
    DownOutlined,
  },
  setup() {
    const store = useStore();
    const userInfo = computed(() => store.getters["login/userInfo"] as ILoginUserInfo);

    function handleSignOut() {
      store.dispatch("login/signOut");
    }

    return {
      userInfo,
      handleSignOut,
    };
  },
});
</script>

<style lang="scss">
.admin-layout-user {
  &__info {
    cursor: pointer;
  }
}
</style>
