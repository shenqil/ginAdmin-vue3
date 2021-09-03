<template>
  <a-modal
    v-model:visible="visible"
    :title="title"
    @ok="handleOk"
    width="100%"
    wrapClassName="full-modal"
  >
    <a-tabs v-model:activeKey="activeTab">
      <a-tab-pane key="routerResourceType" tab="路由资源">
        <RouterResource :role="roleItem" />
      </a-tab-pane>
    </a-tabs>
  </a-modal>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import { IRole } from "@/server/interface";
import RouterResource from "./RouterResource.vue";

const visible = ref<boolean>(false);

export default defineComponent({
  components: { RouterResource },
  setup() {
    const activeTab = ref("routerResourceType");
    const roleItem = ref<IRole>();
    const title = computed(() => `角色"${roleItem?.value?.name || ""}"权益分配`);

    /**
     * 外部调用
     * */
    function show(item: IRole) {
      visible.value = true;
      roleItem.value = item;
    }

    function handleOk() {}

    return {
      activeTab,
      visible,
      title,
      roleItem,
      show,
      handleOk,
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
