<template>
  <a-layout class="admin-layout">
    <!-- 侧边栏 -->
    <a-layout-sider v-model:collapsed="collapsed" collapsible>
      <div class="admin-layout__logo">
        <img class="admin-layout__logo--icon" src="../assets/logo.png" alt="" />
      </div>

      <a-menu
        v-model:openKeys="openKeys"
        v-model:selectedKeys="selectedKeys"
        :inline-collapsed="collapsed"
        mode="inline"
        theme="dark"
        breakpoint="lg"
      >
        <MenuItem v-for="item in menuTree" :key="item.id" :item="item" />
      </a-menu>
    </a-layout-sider>
    <!-- 主体 -->
    <a-layout>
      <!-- 头 -->
      <a-layout-header>
        <div class="admin-layout__header">
          <ToUser />
        </div>
      </a-layout-header>
      <a-layout-content style="margin: 0 16px">
        <!-- 面包屑 -->
        <a-breadcrumb style="margin: 16px 0">
          <a-breadcrumb-item v-for="(breadcrumb, index) in breadcrumbs" :key="index">
            {{ breadcrumb }}
          </a-breadcrumb-item>
        </a-breadcrumb>

        <div>
          <router-view />
        </div>
      </a-layout-content>
      <!-- 页脚 -->
      <a-layout-footer style="text-align: center">
        shen ©2021 Created by RBAC UED
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>

<script lang="ts">
import { reactive, toRefs, computed, watch, ComputedRef } from "vue";
import { RouteLocationNormalized, useRouter } from "vue-router";
import MenuItem from "./components/MenuItem.vue";
import ToUser from "./components/ToUser.vue";
import { IMenuTree } from "../server/login";
import store from "../store/index";

export default {
  async beforeRouteEnter(to: RouteLocationNormalized) {
    const menuTree = store.getters["login/menuTree"];
    if (!menuTree.length) {
      try {
        await store.dispatch("login/fetchMenuTree");
      } catch (error) {
        return {
          name: "404",
        };
      }
    }

    // 判断返回的路由在服务器数据中是否存在
    if (!store.getters["login/menuMap"][to.path]) {
      return {
        name: "404",
      };
    }
  },
  components: {
    MenuItem,
    ToUser,
  },
  setup() {
    const router = useRouter();
    const state = reactive({
      collapsed: false,
      selectedKeys: ["/dashboard"],
      openKeys: ["/"],
      preOpenKeys: [],
    });

    const menuTree = computed(() => store.getters["login/menuTree"] as Array<IMenuTree>);
    const selectedKey = computed(() => state.selectedKeys[0]);
    const breadcrumbs = useBreadcrumb(selectedKey);

    watch(
      () => selectedKey.value,
      (path) => {
        router.push({
          path,
        });
      }
    );

    return {
      ...toRefs(state),
      menuTree,
      breadcrumbs,
    };
  },
};

/**
 * 计算面包屑
 * */
function useBreadcrumb(selectedKey: ComputedRef<string>) {
  const menuMap = computed(() => store.getters["login/menuMap"]);

  const breadcrumbs = computed(() => {
    return getBreadcrumb(selectedKey.value);
  });

  function getBreadcrumb(selectedKey: string | undefined): Array<string> {
    let result: Array<string> = [];
    if (typeof selectedKey === "string") {
      const menu = menuMap.value[selectedKey] as IMenuTree;
      if (menu) {
        result = [...getBreadcrumb(menu.parentId), menu.name];
      }
    }
    return result;
  }

  return breadcrumbs;
}
</script>

<style lang="scss">
.admin-layout {
  .ant-layout-sider {
    height: 100vh;
  }

  .ant-layout-header {
    padding: 0;
  }

  &__logo {
    width: 100%;
    &--icon {
      height: 64px;
      display: block;
      margin: auto;
    }
  }

  &__header {
    padding: 0 20px;
    width: 100%;
    height: 100%;
    background-color: #fff;
    display: flex;
    flex-flow: row;
    justify-content: flex-end;
  }
}
</style>
