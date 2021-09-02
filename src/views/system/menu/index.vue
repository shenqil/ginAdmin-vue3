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
            v-model:value="queryParams.queryValue"
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
        <a-table
          :columns="columns"
          :data-source="tabelData"
          :pagination="false"
          rowKey="id"
          bordered
        >
          <template #filterStatus>
            <div class="menu__tabel-filter">
              <a-checkbox-group v-model:value="filterStatus">
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
        <div class="menu__tabel-pagination">
          <a-pagination
            show-size-changer
            v-model:current="queryParams.current"
            v-model:pageSize="queryParams.pageSize"
            :total="total"
            @change="handlePage"
            @showSizeChange="handlePageSize"
          />
        </div>
      </div>
    </div>

    <MenuModal ref="MenuModal" @on-submit="onMenuModalSubmit" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, watch } from "vue";
import { useStore } from "vuex";
import menuSrv from "@/server/menu";
import { IMenuItem, IQueryMenuParams } from "@/server/interface";
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
    const MenuModal = ref();

    /*-----------------------菜单树----------------------*/
    const menuTree = useMenuTree();

    /*-----------------------------表单数据---------------------------*/
    const queryParams = ref<IQueryMenuParams>({
      queryValue: "",
      parentID: store.getters["menu/selectedKey"],
      status: 0,
      current: 1,
      pageSize: 10,
    });
    const filterStatus = ref([]);
    const total = ref(0);
    const tabelData = ref<Array<IMenuItem>>([]);

    /**
     * 选中的父级发生变化，自动刷新列表
     * */
    watch(
      () => store.getters["menu/selectedKey"],
      (v) => {
        queryParams.value.parentID = v;
        queryTableData();
      }
    );
    watch(filterStatus, (v) => {
      if (v.length == 1) {
        queryParams.value.status = Number(v[0]);
      } else {
        queryParams.value.status = 0;
      }
    });

    onMounted(() => {
      queryTableData();
    });

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
      const res = await menuSrv.query(queryParams.value);
      tabelData.value = res.list;
      queryParams.value.current = res.pagination.current;
      queryParams.value.pageSize = res.pagination.pageSize;
      total.value = res.pagination.total;
    }

    /*-------------------------输入框搜索----------------------*/
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

    function handlePage() {
      queryTableData();
    }

    function handlePageSize() {
      queryParams.value.current = 1;
      queryTableData();
    }

    function onMenuModalSubmit() {
      queryTableData();
      refreshAllMenu();
    }

    return {
      MenuModal,
      loading,
      columns: tableColumns(),
      total,
      filterStatus,
      queryParams,
      tabelData,
      handleSearch,
      handleAdd,
      handleEdit,
      handleRemove,
      handleEnable,
      handleDisable,
      onMenuModalSubmit,
      handlePage,
      handlePageSize,
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
    &-pagination {
      padding-top: 20px;
      width: 100%;
      display: flex;
      flex-flow: row;
      justify-content: flex-end;
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
