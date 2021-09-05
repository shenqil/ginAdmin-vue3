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
      <a-form-item label="角色名称" v-bind="validateInfos.name">
        <a-input
          v-model:value="formData.name"
          @blur="validate('name', { trigger: 'blur' }).catch(() => {})"
        />
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
import { defineComponent, ref, reactive } from "vue";
import { IRole } from "@/server/interface";
import roleSvr from "@/server/role";
import { Form } from "ant-design-vue";
import { message } from "ant-design-vue";

const useForm = Form.useForm;
const visible = ref(false);
const confirmLoading = ref(false);
const formData = ref<IRole>();

export default defineComponent({
  props: {},
  emits: {
    "on-submit": null,
  },
  setup(props, context) {
    const title = ref("增加");

    /**
     * 外部调用
     * */
    function show(item: IRole | undefined) {
      visible.value = true;

      if (!item) {
        title.value = "增加角色";
        formData.value = {
          id: "",
          name: "",
          memo: "",
          sequence: 1,
          status: 1,
        };
      } else {
        title.value = "编辑角色";
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
    })
  );

  function handleOk() {
    validate().then(async () => {
      confirmLoading.value = true;
      try {
        if (formData.value?.id) {
          await roleSvr.update(formData.value);
          message.success("更新成功");
        } else {
          if (formData.value) {
            await roleSvr.create(formData.value);
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
