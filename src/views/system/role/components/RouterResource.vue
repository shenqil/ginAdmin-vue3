<template>
  <a-transfer :data-source="dataSource" :target-keys="targetKeys" @change="onChange">
    <template #children="{ direction, filteredItems, selectedKeys, onItemSelect }">
      <a-table
        :row-selection="
          getRowSelection({
            selectedKeys,
            onItemSelect,
          })
        "
        :pagination="direction === 'left' ? leftPagination : rightPagination"
        :columns="direction === 'left' ? leftColumns : rightColumns"
        :data-source="filteredItems"
        size="small"
        :custom-row="
          ({ key }) => ({
            onClick: () => {
              onItemSelect(key, !selectedKeys.includes(key));
            },
          })
        "
        rowKey="id"
      />
    </template>
  </a-transfer>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  onMounted,
  PropType,
  computed,
  watch,
  reactive,
} from "vue";
import { TableState, TableStateFilters } from "ant-design-vue/es/table/interface";
import { IRouterResource, IRole, IRouterResourceQueryParam } from "@/server/interface";
import routerResourceSrv from "@/server/routerResource";
import roleSrv from "@/server/role";
import { message } from "ant-design-vue";

type Pagination = TableState["pagination"];

const leftTableColumns = [
  {
    dataIndex: "name",
    title: "名称",
    key: "name",
  },
  {
    dataIndex: "method",
    title: "方法",
    key: "method",
  },
  {
    dataIndex: "path",
    title: "路径",
    key: "path",
  },
  {
    dataIndex: "memo",
    title: "简介",
    key: "memo",
  },
];
const rightTableColumns = [
  {
    dataIndex: "name",
    title: "名称",
    key: "name",
  },
];

const excludeIDs = ref<string[]>([]);
export default defineComponent({
  props: {
    role: {
      type: Object as PropType<IRole>,
      required: true,
    },
  },
  setup(props, context) {
    const leftTable = useLeftTable();
    const rightTable = useRightTable(props.role);

    const dataSource = computed(() => {
      const list = Array.from(
        new Set([...leftTable.routerResorceData.value, ...rightTable.targetData.value])
      );
      return list.map((item) => {
        return {
          ...item,
          key: item.id,
          title: item.name,
        };
      });
    });

    onMounted(() => {
      queryData();
    });

    async function queryData() {
      await rightTable.rightQueryData();
      await leftTable.leftQueryData();
    }

    const onChange = (nextTargetKeys: string[]) => {
      rightTable.targetKeys.value = nextTargetKeys;
      submit();
    };

    const getRowSelection = ({ selectedKeys, onItemSelect }: Record<string, any>) => {
      return {
        onSelect({ key }: Record<string, string>, selected: boolean) {
          onItemSelect(key, selected);
        },
        selectedRowKeys: selectedKeys,
      };
    };

    async function submit() {
      const role = props.role;
      role.roleRouters = rightTable.targetKeys.value.map((id) => {
        return {
          roleId: role.id,
          routerId: id,
        };
      });

      await roleSrv.update(role);
      leftTable.routerResorceParams.value.current = 1;
      await queryData();

      message.success("更新成功");
    }

    return {
      ...leftTable,
      ...rightTable,
      dataSource,
      onChange,
      getRowSelection,
      submit,
    };
  },
});

function useLeftTable() {
  const total = ref(0);
  const routerResorceParams = ref<IRouterResourceQueryParam>({
    current: 1,
    pageSize: 10,
    status: 1,
  });
  const routerResorceData = ref<IRouterResource[]>([]);
  const leftColumns = ref(leftTableColumns);

  const leftPagination = computed<Pagination>(() => {
    return {
      current: routerResorceParams.value.current,
      pageSize: routerResorceParams.value.pageSize,
      total: total.value,
      "onUpdate:current": onPageChange,
    };
  });

  watch(excludeIDs, (v) => (routerResorceParams.value.excludeIDs = v));

  function onPageChange(current: number) {
    routerResorceParams.value.current = current;
    queryData();
  }

  async function queryData() {
    const res = await routerResourceSrv.query(routerResorceParams.value);
    routerResorceData.value = res.list;
    routerResorceParams.value.current = res.pagination.current;
    routerResorceParams.value.pageSize = res.pagination.pageSize;
    total.value = res.pagination.total;
  }

  return {
    routerResorceParams,
    routerResorceData,
    leftColumns,
    leftPagination,
    leftQueryData: queryData,
  };
}

function useRightTable(role: IRole) {
  const targetData = ref<IRouterResource[]>([]);
  const targetKeys = ref<string[]>([]);
  const rightColumns = ref(rightTableColumns);
  const routerResorceParams = ref<IRouterResourceQueryParam>({
    roleId: role.id,
    current: 1,
    pageSize: 100,
    status: 1,
  });

  const rightPagination = reactive({
    current: 1,
    pageSize: 10,
    total: 0,
    "onUpdate:current": onPageChange,
  });

  function onPageChange(current: number) {
    rightPagination.current = current;
    queryData();
  }

  async function queryData() {
    const res = await routerResourceSrv.query(routerResorceParams.value);
    targetData.value = res.list;
    targetKeys.value = res.list.map((item) => item.id);
    rightPagination.total = res.pagination.total;
    excludeIDs.value = res.list.map((item) => item.id);
  }

  return {
    rightPagination,
    targetData,
    targetKeys,
    rightColumns,
    rightQueryData: queryData,
  };
}
</script>
