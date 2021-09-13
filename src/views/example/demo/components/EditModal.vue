<template>
  <a-modal
    v-model:visible="visible"
    :confirm-loading="confirmLoading"
    :title="title"
    okText="确认"
    cancelText="取消"
    @ok="handleOk"
  >
    <a-form
      v-if="formData"
      :model="formData"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-form-item label="名称" v-bind="validateInfos.name">
        <a-input
          v-model:value="formData.name"
          @blur="validate('name', { trigger: 'blur' }).catch(() => {})"
        />
      </a-form-item>
      <a-form-item label="编码" v-bind="validateInfos.code">
        <a-input
          v-model:value="formData.code"
          @blur="validate('code', { trigger: 'blur' }).catch(() => {})"
        />
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
import { defineComponent, ref, reactive } from "vue";
import { IDemo } from "@/server/interface";
import demoSvr from "@/server/demo";
import { Form } from "ant-design-vue";
import { message } from "ant-design-vue";

const useForm = Form.useForm;
const visible = ref(false);
const confirmLoading = ref(false);
const formData = ref<IDemo>();

export default defineComponent({
  props: {},
  emits: {
    "on-submit": null,
  },
  setup(props, context) {
    const title = ref("增加路由资源");

    /**
     * 外部调用
     * */
    function show(item: IDemo | undefined) {
      visible.value = true;

      if (!item) {
        title.value = "增加路由资源";
        formData.value = {
          id: "",
          name: "",
          memo: "",
          code: "",
          status: 1,
        };
      } else {
        title.value = "编辑路由资源";
        formData.value = item;
      }
    }

    const menuForm = useMenuForm(context);

    return {
      title,
      visible,
      confirmLoading,
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
      code: [
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
          await demoSvr.update(formData.value);
          message.success("更新成功");
        } else {
          if (formData.value) {
            await demoSvr.create(formData.value);
            message.success("创建成功");
          }
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
