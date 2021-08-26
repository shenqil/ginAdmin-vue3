<template>
  <div class="menu">
    <!-- 树形菜单 -->
    <aside class="menu__aside">
      <a-tree
        v-model:expandedKeys="expandedKeys"
        v-model:selectedKeys="selectedKeys"
        :tree-data="treeData"
        :replaceFields="replaceFields"
        default-expand-all
        autoExpandParent
      >
        <template #custom="{ selected }">
          {{ selected }}
        </template>
      </a-tree>
    </aside>
    <div class="menu__container">
      <div class="menu__fliter">
        <div class="menu__fliter-left">
          <a-button type="primary" @click="handleAdd">
            <template #icon><PlusOutlined /></template>
            新增
          </a-button>
        </div>

        <div class="menu__fliter-right">
          <a-input
            v-model:value="searchName"
            placeholder="请输入名称或备注"
            class="menu__fliter-right-input"
          />
          <a-button type="primary" @click="handleSearch">
            <template #icon><SearchOutlined /></template>
            搜索
          </a-button>
        </div>
      </div>

      <div class="menu__tabel">
        <a-table :columns="columns" :data-source="tabelData" rowKey="id" bordered>
          <template #filterStatus>
            <div class="menu__tabel-filter">
              <a-checkbox-group v-model:value="statusModel">
                <a-row>
                  <a-checkbox value="1">启用</a-checkbox>
                </a-row>
                <a-row>
                  <a-checkbox value="2">禁止</a-checkbox>
                </a-row>
              </a-checkbox-group>
            </div>
          </template>

          <template #status="{ text }">
            <a-tag v-if="text === 1" color="success">启用</a-tag>
            <a-tag v-else color="warning">禁止</a-tag>
          </template>

          <template #actions="{ record }">
            <div class="menu__tabel-actions">
              <a href="#" @click="handleEdit(record)">编辑</a>
              <a-popconfirm
                placement="left"
                title="确认要删除该菜单?"
                ok-text="确认"
                cancel-text="取消"
                @confirm="handleRemove(record)"
              >
                <a href="#">删除</a>
              </a-popconfirm>

              <template v-if="record.status !== 1">
                <a-popconfirm
                  placement="left"
                  title="确认要启用该菜单?"
                  ok-text="确认"
                  cancel-text="取消"
                  @confirm="handleEnable(record)"
                >
                  <a href="#">启用数据</a>
                </a-popconfirm>
              </template>
              <template v-else>
                <a-popconfirm
                  placement="left"
                  title="确认要禁用该菜单?"
                  ok-text="确认"
                  cancel-text="取消"
                  @confirm="handleDisable(record)"
                >
                  <a href="#">禁用数据</a>
                </a-popconfirm>
              </template>
            </div>
          </template>
        </a-table>
      </div>
    </div>

    <MenuModal ref="MenuModal" @on-submit="onMenuModalSubmit" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, watch } from "vue";
import { useStore } from "vuex";
import menuSrv from "@/server/menu";
import { IMenuItem, IPageParams, IQueryMenuParams } from "@/server/interface";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons-vue";
import MenuModal from "./components/MenuModal.vue";

export default defineComponent({
  components: {
    SearchOutlined,
    PlusOutlined,
    MenuModal,
  },
  setup() {
    const store = useStore();
    const loading = ref(false);

    // 对vue虚拟Dom的引用
    const MenuModal = ref<any>(null);

    /*-----------------------------表单数据---------------------------*/
    const statusModel = ref([]);
    const showStatusModel = ref([]);
    const columns = tableColumns();
    const pageParams = ref<IPageParams>({
      current: 0,
      pageSize: 10,
    });
    const tabelData = ref<Array<IMenuItem>>([]);

    /**
     * 参数依赖发生变化，自动更新参数
     * */
    const queryParams = computed<IQueryMenuParams>(() => {
      const status = statusModel.value.length === 1 ? statusModel.value[0] : undefined;
      const showStatus =
        showStatusModel.value.length === 1 ? showStatusModel.value[0] : undefined;
      const params: IQueryMenuParams = {
        current: pageParams.value.current,
        pageSize: pageParams.value.pageSize,
        parentID: store.getters["menu/selectedKey"],
        queryValue: searchName.value,
        status,
        showStatus,
      };

      return params;
    });

    /**
     * 选中的父级发生变化，自动刷新列表
     * */
    watch(
      () => store.getters["menu/selectedKeys"],
      () => {
        queryTableData();
      }
    );

    /**
     * 刷新所有菜单
     * */
    async function refreshAllMenu() {
      await store.dispatch("menu/refreshMenuTree");
      await store.dispatch("login/fetchMenuTree");
    }

    /**
     * 查询列表数据
     * */
    async function queryTableData() {
      const res = await menuSrv.getList(queryParams.value);
      tabelData.value = res.list;
      pageParams.value = res.pagination;
    }

    /*-----------------------菜单树----------------------*/
    const menuTree = useMenuTree();

    /*-------------------------输入框搜索----------------------*/
    const searchName = ref<string>();
    function handleSearch() {
      queryTableData();
    }

    function handleAdd() {
      MenuModal.value.show();
    }

    function handleEdit(item: IMenuItem) {
      MenuModal.value.show(item);
    }

    async function handleRemove(item: IMenuItem) {
      loading.value = true;
      try {
        await menuSrv.remove(item.id);
        await queryTableData();
        await refreshAllMenu();
      } catch (error) {}

      loading.value = false;
    }

    async function handleEnable(item: IMenuItem) {
      loading.value = true;
      try {
        await menuSrv.enable(item.id);
        await queryTableData();
        await refreshAllMenu();
      } catch (error) {}

      loading.value = false;
    }

    async function handleDisable(item: IMenuItem) {
      loading.value = true;
      try {
        await menuSrv.disable(item.id);
        await queryTableData();
        await refreshAllMenu();
      } catch (error) {}

      loading.value = false;
    }

    function onMenuModalSubmit() {
      queryTableData();
      refreshAllMenu();
    }

    onMounted(() => {
      queryTableData();
    });

    return {
      MenuModal,
      loading,
      columns,
      tabelData,
      searchName,
      statusModel,
      showStatusModel,
      handleSearch,
      handleAdd,
      handleEdit,
      handleRemove,
      handleEnable,
      handleDisable,
      onMenuModalSubmit,
      ...menuTree,
    };
  },
});

/**
 * 处理菜单树
 * */
function useMenuTree() {
  const store = useStore();

  const replaceFields = { children: "children", title: "name", key: "id" };
  const treeData = computed(() => store.getters["menu/asideMenuTree"]);
  const selectedKeys = computed({
    get: () => {
      return store.getters["menu/selectedKeys"];
    },
    set: (val) => {
      store.commit("menu/changeAsideSelectedKeys", val);
    },
  });

  const expandedKeys = computed({
    get: () => {
      return store.getters["menu/expandedKeys"];
    },
    set: (val) => {
      store.commit("menu/changeAsideExpandedKeys", val);
    },
  });

  onMounted(async () => {
    await store.dispatch("menu/refreshMenuTree");
  });

  return {
    treeData,
    selectedKeys,
    replaceFields,
    expandedKeys,
  };
}

/**
 * 表单数据列数
 * */
function tableColumns() {
  return [
    {
      title: "菜单名称",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "路由",
      dataIndex: "router",
      key: "router",
    },
    {
      title: "启用状态",
      key: "status",
      dataIndex: "status",
      slots: {
        filterDropdown: "filterStatus",
        customRender: "status",
      },
    },
    {
      title: "操作",
      key: "actions",
      slots: { customRender: "actions" },
    },
  ];
}
</script>

<style lang="scss">
.menu {
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: row;
  &__aside {
    width: 200px;
    height: 100%;
    background-color: #fff;
    margin-right: 10px;
  }
  &__container {
    display: flex;
    flex-grow: 1;
    flex-flow: column;
  }
  &__fliter {
    width: 100%;
    margin-bottom: 10px;
    display: flex;
    flex-flow: row;
    justify-content: space-between;
    &-right {
      width: 300px;
      display: flex;
      flex-flow: row;
      justify-content: flex-end;
      &-input {
        margin-right: 10px;
      }
    }
  }
  &__tabel {
    width: 100%;
    &-filter {
      padding: 5px;
    }
    &-actions {
      display: flex;
      flex-flow: row;
      justify-content: space-between;
      max-width: 150px;
    }
  }
}

.spin {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.05);
  position: fixed;
  top: 0;
  left: 0;
}
</style>
