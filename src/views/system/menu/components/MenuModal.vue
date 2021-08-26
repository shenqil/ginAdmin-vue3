<template>
  <a-modal
    v-model:visible="visible"
    :confirm-loading="confirmLoading"
    :title="title"
    okText="确认"
    cancelText="取消"
    @ok="handleOk"
  >
    <a-form :model="formData" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-form-item label="父级菜单" v-if="fatherName">
        <div>{{ fatherName }}</div>
      </a-form-item>
      <a-form-item label="菜单名称" v-bind="validateInfos.name">
        <a-input
          v-model:value="formData.name"
          @blur="validate('name', { trigger: 'blur' }).catch(() => {})"
        />
      </a-form-item>
      <a-form-item label="菜单路由">
        <a-input v-model:value="formData.router" />
      </a-form-item>
      <a-form-item label="排序">
        <a-input-number v-model:value="formData.sequence" :min="1" :max="99" />
      </a-form-item>
      <a-form-item label="备注">
        <a-textarea v-model:value="formData.memo" :rows="4" />
      </a-form-item>
      <a-form-item label="是否启用" v-bind="validateInfos.status">
        <a-radio-group name="radioGroup" v-model:value="formData.status">
          <a-radio :value="1">启用菜单</a-radio>
          <a-radio :value="2">禁用菜单</a-radio>
        </a-radio-group>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts">
import { defineComponent, computed, ref, reactive } from "vue";
import { IMenuItem } from "@/server/interface";
import menuSvr from "@/server/menu";
import { Form } from "ant-design-vue";
import { useStore } from "vuex";
import { message } from "ant-design-vue";
import store from "@/store";

const useForm = Form.useForm;
const visible = ref(false);
const confirmLoading = ref(false);
const formData = ref<IMenuItem>();

export default defineComponent({
  props: {},
  emits: {
    "on-submit": null,
  },
  setup(props, context) {
    const store = useStore();

    const title = computed(() => "增加菜单");
    const fatherName = ref("");

    /**
     * 外部调用
     * */
    function show(item: IMenuItem | undefined) {
      visible.value = true;

      const selectedMenu = (store.getters["menu/selectedMenu"] || {}) as IMenuItem;
      fatherName.value = selectedMenu.name;

      if (!item) {
        formData.value = {
          id: "",
          icon: "",
          name: "",
          memo: "",
          parentId: selectedMenu.id || "",
          parentPath: selectedMenu.id || "",
          router: "",
          sequence: 0,
          status: 1,
          showStatus: 1,
        };
      } else {
        formData.value = item;
      }
    }

    const menuForm = useMenuForm(context);

    return {
      title,
      visible,
      confirmLoading,
      fatherName,
      formData,
      ...menuForm,
      show,
    };
  },
});

/**
 * 表单处理
 * */
function useMenuForm(context: any) {
  const { resetFields, validate, validateInfos } = useForm(
    formData,
    reactive({
      name: [
        {
          required: true,
          message: "必填项",
          trigger: "blur",
        },
      ],
    })
  );

  function handleOk() {
    validate().then(async () => {
      confirmLoading.value = true;
      try {
        if (formData.value?.id) {
          await menuSvr.update(formData.value);
          message.success("菜单更新成功");
        } else {
          await menuSvr.create(formData.value as IMenuItem);
          message.success("菜单更新成功");
        }

        visible.value = false;
        context.emit("on-submit");
      } catch (error) {}
      confirmLoading.value = false;
    });
  }

  return {
    labelCol: { span: 4 },
    wrapperCol: { span: 14 },
    validateInfos,
    handleOk,
    validate,
    resetFields,
  };
}
</script>
