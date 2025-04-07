<template>
  <t-form
    ref="form"
    :class="['item-container', `register-${type}`]"
    :data="formData"
    :rules="FORM_RULES"
    label-width="0"
    @submit="onSubmit"
  >
    <t-form-item name="userName">
      <t-input v-model="formData.userName" size="large" placeholder="请输入您的用户名" autocomplete="off">
        <template #prefix-icon>
          <t-icon name="user" />
        </template>
      </t-input>
    </t-form-item>

    <t-form-item name="password">
      <t-input
        v-model="formData.password"
        size="large"
        :type="showPsw ? 'text' : 'password'"
        clearable
        placeholder="请输入登录密码"
        autocomplete="off"
      >
        <template #prefix-icon>
          <t-icon name="lock-on" />
        </template>
        <template #suffix-icon>
          <t-icon :name="showPsw ? 'browse' : 'browse-off'" @click="showPsw = !showPsw" />
        </template>
      </t-input>
    </t-form-item>

    <t-form-item class="verification-code" name="userLevel">
      <t-select v-model="formData.userLevel" size="large" class="form-item-content" placeholder="请选择年级" clearable>
        >
        <template #prefix-icon>
          <t-icon name="education"></t-icon>
        </template>
        <t-option v-for="item in levelEnumText" :key="item.key" :label="item.value" :value="item.key"></t-option>
      </t-select>
    </t-form-item>

    <!-- <t-form-item class="check-container" name="checked">
      <t-checkbox v-model="formData.checked">我已阅读并同意 </t-checkbox> <span>TDesign服务协议</span> 和
      <span>TDesign 隐私声明</span>
    </t-form-item> -->

    <t-form-item>
      <t-button block size="large" type="submit"> 注册 </t-button>
    </t-form-item>

    <!-- <div class="switch-container">
      <span class="tip" @click="switchType(type == 'phone' ? 'email' : 'phone')">{{
        type == 'phone' ? '使用邮箱注册' : '使用手机号注册'
      }}</span>
    </div> -->
  </t-form>
</template>

<script setup lang="ts">
import type { FormRule, SubmitContext } from 'tdesign-vue-next';
import { MessagePlugin } from 'tdesign-vue-next';
import { computed, ref } from 'vue';

import { useUserStore } from '@/store';
import { useEnumItem } from '@/store/modules/enumitem';

const userStore = useUserStore();
const enumItemStore = useEnumItem();
const levelEnumText = computed(() => enumItemStore.user.levelEnum);
const INITIAL_DATA = {
  userName: '',
  password: '',
  userLevel: 1,
};

const FORM_RULES: Record<string, FormRule[]> = {
  userName: [{ required: true, message: '请输入用户名', type: 'error', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', type: 'error', trigger: 'blur' }],
  userLevel: [{ required: true, message: '请选择年级', type: 'error', trigger: 'change' }],
};

const type = ref('phone');

const form = ref();
const formData = ref({ ...INITIAL_DATA });

const showPsw = ref(false);

const emit = defineEmits(['registerSuccess']);

const onSubmit = async (ctx: SubmitContext) => {
  if (ctx.validateResult === true) {
    try {
      await userStore.register(formData.value);
      MessagePlugin.success('注册成功');
      emit('registerSuccess');
    } catch (e: unknown) {
      console.log(e);
      if (e instanceof Error) {
        MessagePlugin.error(e.message);
      }
    }
  }
};

// const switchType = (val: string) => {
//   form.value.reset();
//   type.value = val;
// };
</script>

<style lang="less" scoped>
@import '../index.less';
</style>
