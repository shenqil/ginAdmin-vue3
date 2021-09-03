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
import { defineComponent, ref, onMounted, PropType, computed } from "vue";
import { TableState, TableStateFilters } from "ant-design-vue/es/table/interface";
import { IRouterResource, IRole, IRouterResourceQueryParam } from "@/server/interface";
import routerResourceSrv from "@/server/routerResource";

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
      leftTable.leftQueryData();
      rightTable.rightQueryData();
    });

    const onChange = (nextTargetKeys: string[]) => {
      rightTable.targetKeys.value = nextTargetKeys;
    };

    const getRowSelection = ({ selectedKeys, onItemSelect }: Record<string, any>) => {
      return {
        onSelect({ key }: Record<string, string>, selected: boolean) {
          onItemSelect(key, selected);
        },
        selectedRowKeys: selectedKeys,
      };
    };

    return {
      ...leftTable,
      ...rightTable,
      dataSource,
      onChange,
      getRowSelection,
    };
  },
});

function useLeftTable() {
  const total = ref(0);
  const routerResorceParams = ref<IRouterResourceQueryParam>({
    queryValue: "",
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
    routerResorceData,
    leftColumns,
    leftPagination,
    leftQueryData: queryData,
  };
}

function useRightTable(role: IRole) {
  const total = ref(0);
  const targetData = ref<IRouterResource[]>([]);
  const targetKeys = ref<string[]>([]);
  const rightColumns = ref(rightTableColumns);
  const routerResorceParams = ref<IRouterResourceQueryParam>({
    queryValue: "",
    roleId: role.id,
    current: 1,
    pageSize: 10,
    status: 1,
  });

  const rightPagination = computed<Pagination>(() => {
    return {
      current: routerResorceParams.value.current,
      pageSize: routerResorceParams.value.pageSize,
      total: total.value,
      "onUpdate:current": onPageChange,
    };
  });

  function onPageChange(current: number) {
    routerResorceParams.value.current = current;
    queryData();
  }

  async function queryData() {
    const res = await routerResourceSrv.query(routerResorceParams.value);
    targetData.value = res.list;
    targetKeys.value = res.list.map((item) => item.id);
    routerResorceParams.value.current = res.pagination.current;
    routerResorceParams.value.pageSize = res.pagination.pageSize;
    total.value = res.pagination.total;
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
