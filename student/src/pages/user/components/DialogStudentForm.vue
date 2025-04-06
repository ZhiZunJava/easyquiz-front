<template>
  <t-dialog v-model:visible="formVisible" :header="formData.id ? '修改用户' : '新增用户'" :width="680" :footer="false">
    <template #body>
      <!-- 表单内容 -->
      <t-form ref="form" :data="formData" :rules="rules" :label-width="100" @submit="onSubmit">
        <t-form-item label="用户名" name="userName">
          <t-input
            v-model="formData.userName"
            :style="{ width: '480px' }"
            autocomplete="off"
            placeholder="请输入用户名"
          />
        </t-form-item>
        <t-form-item label="密码" name="password">
          <t-input
            v-model="formData.password"
            :style="{ width: '480px' }"
            autocomplete="off"
            placeholder="请输入密码"
          />
        </t-form-item>
        <t-form-item label="姓名" name="realName">
          <t-input v-model="formData.realName" placeholder="请输入姓名" :style="{ width: '480px' }" />
        </t-form-item>
        <t-form-item label="年龄" name="age">
          <t-input-number v-model="formData.age" placeholder="请输入年龄" />
        </t-form-item>
        <t-form-item label="年级" name="userLevel">
          <t-select
            v-model="formData.userLevel"
            class="form-item-content"
            placeholder="请选择年级"
            :style="{ width: '480px' }"
          >
            >
            <t-option v-for="item in levelEnumText" :key="item.key" :label="item.value" :value="item.key"></t-option>
          </t-select>
        </t-form-item>
        <t-form-item label="状态" name="status">
          <t-radio-group v-model="formData.status">
            <t-radio :value="1">启用</t-radio>
            <t-radio :value="2">禁用</t-radio>
          </t-radio-group>
        </t-form-item>
        <t-form-item style="float: right">
          <t-button variant="outline" @click="onClickCloseBtn">取消</t-button>
          <t-button theme="primary" type="submit">确定</t-button>
        </t-form-item>
      </t-form>
    </template>
  </t-dialog>
</template>

<script setup lang="ts">
import { FormRules, MessagePlugin, SubmitContext } from 'tdesign-vue-next';
import type { PropType } from 'vue';
import { computed, ref, watch } from 'vue';

import user from '@/api/user';
import { useEnumItem } from '@/store/modules/enumitem';

export interface FormData {
  id: number | null;
  userName: string;
  password: string;
  realName: string;
  age: number | undefined;
  sex: number;
  userLevel: number | undefined;
  status: number;
  role: number;
}

const INITIAL_DATA: FormData = {
  id: null,
  role: 1,
  userName: '',
  password: '',
  realName: '',
  age: undefined,
  sex: 1,
  userLevel: undefined,
  status: 1,
};

const { visible, data } = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  data: Object as PropType<FormData>,
});
const formVisible = ref(false);
const formData = ref({ ...INITIAL_DATA });
const enumItemStore = useEnumItem();
const levelEnumText = computed(() => enumItemStore.user.levelEnum);

const emit = defineEmits(['update:visible', 'refresh']);

const onSubmit = ({ validateResult, firstError }: SubmitContext) => {
  if (!firstError) {
    user
      .createUser(formData.value)
      .then((_res) => {
        MessagePlugin.success(formData.value.id ? '修改成功' : '添加成功');
        formVisible.value = false;
        emit('refresh');
      })
      .catch((err) => {
        console.log('Errors: ', err);
        MessagePlugin.warning(err.message);
      });
  } else {
    console.log('Errors: ', validateResult);
    MessagePlugin.warning(firstError);
  }
};

const onClickCloseBtn = () => {
  formVisible.value = false;
  formData.value = { ...INITIAL_DATA };
};

watch(
  () => formVisible.value,
  (val) => {
    emit('update:visible', val);
  },
);

watch(
  () => visible,
  (val) => {
    formVisible.value = val;
  },
);

watch(
  () => data,
  (val) => {
    if (val) {
      formData.value = val;
    }
  },
);

const rules: FormRules<FormData> = {
  userName: [{ required: true, message: '请输入用户名', type: 'error', trigger: 'blur' }],
  realName: [{ required: true, message: '请输入姓名', type: 'error', trigger: 'blur' }],
  userLevel: [{ required: true, message: '请选择年级', type: 'error', trigger: 'blur' }],
  status: [{ required: true, message: '请选择状态', type: 'error', trigger: 'blur' }],
};
</script>
