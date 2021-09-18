<template>
  <a-modal
    v-model:visible="visible"
    :title="title"
    :footer="null"
    width="100%"
    wrapClassName="full-modal"
  >
    <a-tabs v-model:activeKey="activeTab">
      <a-tab-pane key="roleType" tab="角色分配" v-if="userItem">
        <RoleResource :user="userItem" :key="userItem.id" />
      </a-tab-pane>
    </a-tabs>
  </a-modal>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import { IUser } from "@/server/interface";
import RoleResource from "./RoleResource.vue";

const visible = ref<boolean>(false);

export default defineComponent({
  components: { RoleResource },
  setup() {
    const activeTab = ref("roleType");
    const userItem = ref<IUser>();
    const title = computed(
      () =>
        `用户"${userItem?.value?.realName || userItem?.value?.userName || ""}"角色分配`
    );

    /**
     * 外部调用
     * */
    function show(item: IUser) {
      visible.value = true;
      userItem.value = item;
    }

    return {
      activeTab,
      visible,
      title,
      userItem,
      show,
    };
  },
});
</script>

<style lang="scss">
.full-modal {
  .ant-modal {
    max-width: 100%;
    top: 0;
    padding-bottom: 0;
    margin: 0;
  }
  .ant-modal-content {
    display: flex;
    flex-direction: column;
    height: calc(100vh);
  }
  .ant-modal-body {
    flex: 1;
  }
}
</style>
