<template>
  <a-dropdown :trigger="['click']" class="admin-layout-user">
    <div class="admin-layout-user__info" @click.prevent>
      {{ userInfo.realName }}
      <DownOutlined />
    </div>
    <template #overlay>
      <a-menu>
        <a-menu-item key="modifyPassword" @click="handleOpenPasswordModal">
          修改密码
        </a-menu-item>
        <a-menu-divider />
        <a-menu-item key="signOut" @click="handleSignOut">退出登录</a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>

  <teleport to="body">
    <PasswordModal v-model="passwordModal" />
  </teleport>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from "vue";
import { DownOutlined } from "@ant-design/icons-vue";
import { useStore } from "vuex";
import { ILoginUserInfo } from "../../server/interface";
import PasswordModal from "../components/PasswordModal.vue";

export default defineComponent({
  components: {
    DownOutlined,
    PasswordModal,
  },
  setup() {
    const store = useStore();
    const userInfo = computed(() => store.getters["login/userInfo"] as ILoginUserInfo);

    function handleSignOut() {
      store.dispatch("login/signOut");
    }

    const passwordModal = usePasswordModal();

    return {
      userInfo,
      handleSignOut,
      ...passwordModal,
    };
  },
});

/**
 * 密码弹窗
 * */
function usePasswordModal() {
  const passwordModal = ref(false);
  function handleOpenPasswordModal() {
    passwordModal.value = true;
  }

  return {
    passwordModal,
    handleOpenPasswordModal,
  };
}
</script>

<style lang="scss">
.admin-layout-user {
  &__info {
    cursor: pointer;
  }
}
</style>
