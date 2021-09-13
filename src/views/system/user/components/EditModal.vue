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
      <a-form-item label="用户名" v-bind="validateInfos.userName">
        <a-input
          v-model:value="formData.userName"
          @blur="validate('userName', { trigger: 'blur' }).catch(() => {})"
        />
      </a-form-item>
      <a-form-item label="真实姓名" v-bind="validateInfos.realName">
        <a-input
          v-model:value="formData.realName"
          @blur="validate('realName', { trigger: 'blur' }).catch(() => {})"
        />
      </a-form-item>
      <a-form-item label="密码" v-bind="validateInfos.password">
        <a-input-password
          v-model:value="formData.password"
          @blur="validate('password', { trigger: 'blur' }).catch(() => {})"
        />
      </a-form-item>
      <a-form-item label="电话号码" v-bind="validateInfos.phone">
        <a-input
          v-model:value="formData.phone"
          @blur="validate('phone', { trigger: 'blur' }).catch(() => {})"
        />
      </a-form-item>
      <a-form-item label="邮箱" v-bind="validateInfos.email">
        <a-input
          v-model:value="formData.email"
          @blur="validate('email', { trigger: 'blur' }).catch(() => {})"
        />
      </a-form-item>
      <a-form-item label="是否启用" v-bind="validateInfos.status">
        <a-radio-group name="radioGroup" v-model:value="formData.status">
          <a-radio :value="1">启用</a-radio>
          <a-radio :value="2">禁用</a-radio>
        </a-radio-group>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts">
import { defineComponent, ref, reactive } from "vue";
import { IUser } from "@/server/interface";
import userSvr from "@/server/user";
import { Form } from "ant-design-vue";
import { message } from "ant-design-vue";
import { RuleObject } from "ant-design-vue/es/form/interface";
import { md5Hash } from "@/utils/security";
import { useStore } from "vuex";

const useForm = Form.useForm;
const visible = ref(false);
const confirmLoading = ref(false);
const formData = ref<IUser>();

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
    function show(item: IUser | undefined) {
      visible.value = true;

      if (!item) {
        title.value = "创建用户";
        formData.value = {
          id: "",
          userName: "",
          realName: "",
          password: "",
          status: 1,
        };
      } else {
        title.value = "编辑用户";
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
      userName: [
        {
          required: true,
          message: "必填项",
          trigger: "blur",
        },
        {
          validator: async (rule: RuleObject, value: string) => {
            if (!/^[a-zA-Z\d]\w{3,19}[a-zA-Z\d]$/.test(value)) {
              return Promise.reject(
                "用户名由字母（大小写敏感），数字，下划线，不能以下划线开头和结尾"
              );
            } else {
              return Promise.resolve();
            }
          },
          trigger: "blur",
        },
      ],
      realName: [
        {
          required: true,
          message: "必填项",
          trigger: "blur",
        },
      ],
      password: [
        {
          validator: async (rule: RuleObject, value: string) => {
            if (value && !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,16}$/.test(value)) {
              return Promise.reject("需要8-16个包含大小写字母和数字的字符");
            } else {
              return Promise.resolve();
            }
          },
          trigger: "blur",
        },
      ],
      phone: [
        {
          validator: async (rule: RuleObject, value: string) => {
            if (
              value &&
              !/^1(3\d|4[5-9]|5[0-35-9]|6[567]|7[0-8]|8\d|9[0-35-9])\d{8}$/.test(value)
            ) {
              return Promise.reject("非法的手机号");
            } else {
              return Promise.resolve();
            }
          },
          trigger: "blur",
        },
      ],
      email: [
        {
          validator: async (rule: RuleObject, value: string) => {
            if (
              value &&
              !/^([a-zA-Z0-9]+[_|_|\-|.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|_|.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/.test(
                value
              )
            ) {
              return Promise.reject("非法的邮箱");
            } else {
              return Promise.resolve();
            }
          },
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
          const userInfo = {
            ...formData.value,
          };
          userInfo.password = md5Hash((userInfo.password || "").trim());
          await userSvr.update(userInfo);
          message.success("更新成功");
        } else {
          if (formData.value) {
            const userInfo = {
              ...formData.value,
            };
            userInfo.password = md5Hash((userInfo.password || "").trim());
            await userSvr.create(userInfo);
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
