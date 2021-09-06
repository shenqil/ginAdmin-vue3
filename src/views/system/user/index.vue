<template>
  <div class="user">
    <div class="user__fliter">
      <div class="user__fliter-left">
        <a-button type="primary" @click="handleAdd">
          <template #icon><PlusOutlined /></template>
          新增
        </a-button>
      </div>

      <div class="user__fliter-right">
        <a-input
          v-model:value="queryParams.queryValue"
          placeholder="请输入名称"
          class="user__fliter-right-input"
        />
        <a-button type="primary" @click="handleSearch">
          <template #icon><SearchOutlined /></template>
          搜索
        </a-button>
      </div>
    </div>
    <div class="user__container">
      <a-table
        :pagination="false"
        :columns="columns"
        :data-source="tabelData"
        rowKey="id"
        bordered
      >
        <template #filterStatus>
          <div class="user__tabel-filter">
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
          <div class="user__tabel-actions">
            <a href="#" @click="handleEdit(record)">编辑信息</a>
            <a href="#" @click="handleEditResource(record)">分配角色</a>
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
                title="确认要启用路由资源?"
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
                title="确认要禁用路由资源?"
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
      <div class="user__tabel-pagination">
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

    <EditModal ref="EditModal" @on-submit="onEditModalSubmit" />
    <EditResourceModal ref="EditResourceModal" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch } from "vue";
import { IUserQueryParam, IUser } from "@/server/interface";
import userSrv from "@/server/user";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons-vue";
import EditModal from "./components/EditModal.vue";
import EditResourceModal from "./components/EditResourceModal.vue";

export default defineComponent({
  components: {
    SearchOutlined,
    PlusOutlined,
    EditModal,
    EditResourceModal,
  },
  setup() {
    const EditModal = ref();
    const EditResourceModal = ref();
    const total = ref(0);
    const filterStatus = ref([]);
    const tabelData = ref<Array<IUser>>([]);
    const queryParams = ref<IUserQueryParam>({
      queryValue: "",
      status: 0,
      current: 1,
      pageSize: 10,
    });

    watch(filterStatus, (v) => {
      if (v.length == 1) {
        queryParams.value.status = Number(v[0]);
      } else {
        queryParams.value.status = 0;
      }
    });

    onMounted(() => {
      queryData();
    });

    async function queryData() {
      const res = await userSrv.query(queryParams.value);
      tabelData.value = res.list;
      queryParams.value.current = res.pagination.current;
      queryParams.value.pageSize = res.pagination.pageSize;
      total.value = res.pagination.total;
    }

    function handleSearch() {
      queryData();
    }

    function handleAdd() {
      EditModal.value.show();
    }

    function handleEdit(item: IUser) {
      EditModal.value.show(JSON.parse(JSON.stringify(item)));
    }

    function handleEditResource(item: IUser) {
      EditResourceModal.value.show(JSON.parse(JSON.stringify(item)));
    }

    async function handleRemove(item: IUser) {
      await userSrv.remove(item.id);
      await queryData();
    }

    async function handleEnable(item: IUser) {
      await userSrv.enable(item.id);
      await queryData();
    }

    async function handleDisable(item: IUser) {
      await userSrv.disable(item.id);
      await queryData();
    }

    function handlePage() {
      queryData();
    }

    function handlePageSize() {
      queryParams.value.current = 1;
      queryData();
    }

    function onEditModalSubmit() {
      queryData();
    }

    return {
      EditModal,
      EditResourceModal,
      total,
      queryParams,
      tabelData,
      filterStatus,
      columns: tableColumns(),
      handleSearch,
      handleAdd,
      handleEdit,
      handleRemove,
      handleEnable,
      handleDisable,
      handlePage,
      handlePageSize,
      handleEditResource,
      onEditModalSubmit,
    };
  },
});

/**
 * 表单数据列
 * */
function tableColumns() {
  return [
    {
      title: "用户名",
      dataIndex: "userName",
      key: "userName",
    },
    {
      title: "真实姓名",
      dataIndex: "realName",
      key: "realName",
    },
    {
      title: "手机号码",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "邮箱",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "用户状态",
      key: "status",
      dataIndex: "status",
      slots: {
        filterDropdown: "filterStatus",
        customRender: "status",
      },
    },
    {
      title: "创建者",
      dataIndex: "creator",
      key: "creator",
    },
    {
      title: "操作",
      key: "actions",
      width: 380,
      slots: { customRender: "actions" },
    },
  ];
}
</script>

<style lang="scss">
.user {
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
    &-actions {
      display: flex;
      flex-flow: row;
      justify-content: space-between;
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
</style>
