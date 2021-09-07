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
import { TableState } from "ant-design-vue/es/table/interface";
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
    const leftTotal = ref(0);
    const leftParasm = ref<IRouterResourceQueryParam>({
      current: 1,
      pageSize: 10,
      status: 1,
    });
    const leftResult = ref<IRouterResource[]>([]);
    const leftColumns = ref(leftTableColumns);

    const rightResult = ref<IRouterResource[]>([]);
    const rightColumns = ref(rightTableColumns);
    const rightPagination = reactive({
      current: 1,
      pageSize: 10,
      total: 0,
      "onUpdate:current": (current: number) => (rightPagination.current = current),
    });
    const targetKeys = ref<string[]>([]);

    const dataSource = computed(() => {
      const list = Array.from(new Set([...leftResult.value, ...rightResult.value]));
      return list.map((item) => {
        return {
          ...item,
          key: item.id,
          title: item.name,
        };
      });
    });

    const leftPagination = computed<Pagination>(() => {
      return {
        current: leftParasm.value.current,
        pageSize: leftParasm.value.pageSize,
        total: leftTotal.value,
        "onUpdate:current": function (current: number) {
          leftParasm.value.current = current;
          queryData();
        },
      };
    });

    onMounted(() => {
      queryData();
    });

    async function queryData() {
      const { exist, notExist } = await roleSrv.getRouter(
        props.role.id,
        leftParasm.value
      );

      leftTotal.value = notExist.pagination.total;
      leftParasm.value.current = notExist.pagination.current;
      leftParasm.value.pageSize = notExist.pagination.pageSize;
      leftResult.value = notExist.list;

      rightResult.value = exist;
      targetKeys.value = exist.map((item) => item.id);
    }

    const onChange = (nextTargetKeys: string[]) => {
      targetKeys.value = nextTargetKeys;
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
      role.roleRouters = targetKeys.value.map((id) => {
        return {
          roleId: role.id,
          routerId: id,
        };
      });

      await roleSrv.update(role);
      leftParasm.value.current = 1;
      await queryData();

      message.success("更新成功");
    }

    return {
      leftColumns,
      leftPagination,
      rightColumns,
      rightPagination,
      dataSource,
      targetKeys,
      onChange,
      getRowSelection,
      submit,
    };
  },
});
</script>
