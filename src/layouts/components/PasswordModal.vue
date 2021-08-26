<template>
  <a-modal
    v-model:visible="visible"
    :confirm-loading="confirmLoading"
    title="修改密码"
    okText="确认"
    cancelText="取消"
    @ok="onSubmit"
    @cancel="onCancel"
  >
    <a-form name="custom-validation" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-form-item label="旧密码" v-bind="validateInfos.oldPass">
        <a-input v-model:value="modelRef.oldPass" type="password" autocomplete="off" />
      </a-form-item>
      <a-form-item label="新密码" v-bind="validateInfos.newPass">
        <a-input v-model:value="modelRef.newPass" type="password" autocomplete="off" />
      </a-form-item>
      <a-form-item
        label="确认新密码"
        v-bind="validateInfos.checkNewPass"
        autocomplete="off"
      >
        <a-input
          v-model:value="modelRef.checkNewPass"
          type="password"
          autocomplete="off"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts">
import { RuleObject } from "ant-design-vue/es/form/interface";
import { defineComponent, ref, reactive, computed, WritableComputedRef } from "vue";
import { Form } from "ant-design-vue";
import { updatePassword } from "@/server/login";
import { md5Hash } from "@/utils/security";

interface IProps {
  modelValue: boolean;
}

const useForm = Form.useForm;
export default defineComponent({
  props: {
    modelValue: {
      type: Boolean,
    },
  },
  setup(props: IProps, context) {
    const visible = computed<boolean>({
      get: () => props.modelValue,
      set: (val) => {
        context.emit("update:modelValue", val);
      },
    });

    const passwordForm = usePasswordForm(visible);

    return {
      visible,
      ...passwordForm,
    };
  },
});

function usePasswordForm(visible: WritableComputedRef<boolean>) {
  const confirmLoading = ref(false);
  const modelRef = reactive({
    oldPass: "",
    newPass: "",
    checkNewPass: "",
  });

  const { resetFields, validate, validateInfos } = useForm(
    modelRef,
    reactive({
      oldPass: [
        {
          required: true,
          validator: (rule: RuleObject, value: string) => {
            if (!value) {
              return Promise.reject("请输入密码");
            } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,16}$/.test(value)) {
              return Promise.reject("需要8-16个包含大小写字母和数字的字符");
            }
            return Promise.resolve();
          },
          trigger: "change",
        },
      ],
      newPass: [
        {
          required: true,
          validator: (rule: RuleObject, value: string) => {
            if (!value) {
              return Promise.reject("请输入密码");
            } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,16}$/.test(value)) {
              return Promise.reject("需要8-16个包含大小写字母和数字的字符");
            }
            if (modelRef.checkNewPass) {
              validate("checkNewPass");
            }

            return Promise.resolve();
          },
          trigger: "change",
        },
      ],
      checkNewPass: [
        {
          required: true,
          validator: (rule: RuleObject, value: string) => {
            if (!value) {
              return Promise.reject("请输入密码");
            } else if (value !== modelRef.newPass) {
              return Promise.reject("两次密码输入不一致");
            }
            return Promise.resolve();
          },
          trigger: "change",
        },
      ],
    })
  );

  const onSubmit = () => {
    validate().then(async () => {
      confirmLoading.value = true;
      try {
        const res = await updatePassword({
          oldPassword: md5Hash(modelRef.oldPass.trim()),
          newPassword: md5Hash(modelRef.newPass.trim()),
        });
        visible.value = false;
        console.log(res, "modelRef");
      } catch (error) {}

      confirmLoading.value = false;
    });
  };

  const onCancel = () => {
    resetFields();
  };

  return {
    confirmLoading,
    labelCol: { span: 4 },
    wrapperCol: { span: 14 },
    validateInfos,
    onCancel,
    modelRef,
    onSubmit,
  };
}
</script>
