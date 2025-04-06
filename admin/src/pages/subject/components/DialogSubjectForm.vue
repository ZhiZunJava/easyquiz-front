<template>
  <t-dialog
    ref="form"
    v-model:visible="formVisible"
    :header="formData.id ? '修改学科' : '新增学科'"
    :width="680"
    :footer="false"
  >
    <template #body>
      <!-- 表单内容 -->
      <t-form ref="form" :data="formData" :rules="rules" :label-width="100" @submit="onSubmit">
        <t-form-item label="用户名" name="name">
          <t-input v-model="formData.name" :style="{ width: '480px' }" autocomplete="off" placeholder="学科名称" />
        </t-form-item>
        <t-form-item label="学科年级" name="level">
          <t-select
            v-model="formData.level"
            class="form-item-content"
            placeholder="请选择年级"
            :style="{ width: '480px' }"
          >
            >
            <t-option v-for="item in levelEnumText" :key="item.key" :label="item.value" :value="item.key"></t-option>
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
import { FormInstanceFunctions, FormRules, MessagePlugin, SubmitContext } from 'tdesign-vue-next';
import type { PropType } from 'vue';
import { computed, ref, useTemplateRef, watch } from 'vue';

import subject from '@/api/subject';
import { useEnumItem } from '@/store/modules/enumitem';

export interface FormData {
  id: number | null;
  name: string;
  level: number | undefined;
  levelName: string | undefined;
}

const INITIAL_DATA: FormData = {
  id: null,
  name: '',
  level: undefined,
  levelName: undefined,
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
const formData = ref({ ...INITIAL_DATA });
const enumItemStore = useEnumItem();
const levelEnumText = computed(() => enumItemStore.user.levelEnum);

const emit = defineEmits(['update:visible', 'refresh']);

const onSubmit = ({ validateResult, firstError }: SubmitContext) => {
  if (!firstError) {
    formData.value.levelName = enumItemStore.enumFormat(levelEnumText.value, formData.value.level);
    subject
      .edit(formData.value)
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
  name: [{ required: true, message: '请输入学科名称', type: 'error', trigger: 'blur' }],
  level: [{ required: true, message: '请选择学科年级', type: 'error', trigger: 'blur' }],
};
</script>
