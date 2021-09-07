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
import { defineComponent, ref, onMounted, PropType, computed, reactive } from "vue";
import { TableState } from "ant-design-vue/es/table/interface";
import { IUserQueryParam, IUser, IRoleResultByUser, IRole } from "@/server/interface";
import userSrv from "@/server/user";
import { message } from "ant-design-vue";

type Pagination = TableState["pagination"];

const leftTableColumns = [
  {
    dataIndex: "name",
    title: "角色名称",
    key: "name",
  },
  {
    dataIndex: "memo",
    title: "简介",
    key: "memo",
  },
  {
    dataIndex: "creator",
    title: "创建者",
    key: "creator",
  },
];
const rightTableColumns = [
  {
    dataIndex: "name",
    title: "角色名称",
    key: "name",
  },
];

export default defineComponent({
  props: {
    user: {
      type: Object as PropType<IUser>,
      required: true,
    },
  },
  setup(props, context) {
    const leftTotal = ref(0);
    const leftParasm = ref<IUserQueryParam>({
      current: 1,
      pageSize: 10,
      status: 1,
    });
    const leftResult = ref<IRole[]>([]);
    const leftColumns = ref(leftTableColumns);

    const rightColumns = ref(rightTableColumns);
    const rightResult = ref<IRole[]>([]);
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
      const res = await userSrv.getRoles(props.user.id, leftParasm.value);
      const { exist, notExist } = res;

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
      const user = props.user;
      user.userRoles = targetKeys.value.map((id) => {
        return {
          userId: user.id,
          roleId: id,
        };
      });

      await userSrv.update(user);
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
