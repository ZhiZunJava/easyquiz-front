<template>
  <t-dialog ref="form" v-model:visible="formVisible" header="消息发送" :width="680" :footer="false">
    <template #body>
      <!-- 表单内容 -->
      <t-form ref="form" :data="formData" :rules="rules" :label-width="80" label-align="left" @submit="onSubmit">
        <t-form-item label="标题" name="title">
          <t-input v-model="formData.title" autocomplete="off" placeholder="请输入消息标题" />
        </t-form-item>
        <t-form-item label="内容" name="content">
          <t-textarea v-model="formData.content" :style="{ width: '480px' }" placeholder="请输入消息内容" />
        </t-form-item>
        <t-form-item label="接收人" name="receiveUserIds">
          <t-select
            v-model="formData.receiveUserIds"
            class="form-item-content"
            placeholder="请选择用户"
            multiple
            filterable
            :loading="searchLoading"
            reserve-keyword
            @search="remoteMethod"
          >
            >
            <t-option v-for="item in userOptions" :key="item.value" :label="item.name" :value="item.value"></t-option>
          </t-select>
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
import { FormInstanceFunctions, FormRules, MessagePlugin, SelectProps, SubmitContext } from 'tdesign-vue-next';
import type { PropType } from 'vue';
import { ref, useTemplateRef, watch } from 'vue';

import message from '@/api/message';
import user from '@/api/user';

export interface FormData {
  title: string;
  content: string;
  receiveUserIds: number[] | undefined;
}

const INITIAL_DATA: FormData = {
  title: '',
  content: '',
  receiveUserIds: undefined,
};

const { visible, data } = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  data: Object as PropType<FormData>,
});
const form = useTemplateRef<FormInstanceFunctions>('form');
const formVisible = ref(false);
const searchLoading = ref(false);
const formData = ref({ ...INITIAL_DATA });
const userOptions = ref<{ value: number; name: string }[]>([]);

const emit = defineEmits(['update:visible', 'refresh']);

const onSubmit = ({ validateResult, firstError }: SubmitContext) => {
  if (!firstError) {
    message
      .send(formData.value)
      .then((_res) => {
        MessagePlugin.success('发送成功');
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

const remoteMethod: SelectProps['onSearch'] = (search: string) => {
  console.log(search);
  if (search) {
    searchLoading.value = true;
    user
      .selectByUserName({ name: search })
      .then((res) => {
        userOptions.value = res;
      })
      .catch((err) => {
        console.log('Errors: ', err);
        MessagePlugin.warning(err.message);
      })
      .finally(() => {
        searchLoading.value = false;
      });
  }
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
  title: [{ required: true, message: '请输入标题', type: 'error', trigger: 'blur' }],
  content: [{ required: true, message: '请选择内容', type: 'error', trigger: 'blur' }],
};
</script>
