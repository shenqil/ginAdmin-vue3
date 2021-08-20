<template>
  <a-layout style="min-height: 100vh">
    <!-- 侧边栏 -->
    <a-layout-sider v-model:collapsed="collapsed" collapsible>
      <div class="logo" />
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
      <a-layout-header style="background: #fff; padding: 0" />
      <a-layout-content style="margin: 0 16px">
        <!-- 面包屑 -->
        <a-breadcrumb style="margin: 16px 0">
          <a-breadcrumb-item>User</a-breadcrumb-item>
          <a-breadcrumb-item>Bill</a-breadcrumb-item>
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
import { reactive, toRefs, computed, watch } from "vue";
import { RouteLocationNormalized, useRouter } from "vue-router";
import MenuItem from "./components/MenuItem.vue";
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

    watch(
      () => state.selectedKeys,
      ([path]) => {
        router.push({
          path,
        });
      }
    );

    return {
      ...toRefs(state),
      menuTree,
    };
  },
};
</script>
