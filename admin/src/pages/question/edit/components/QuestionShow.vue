<template>
  <t-dialog v-model:visible="formVisible" header="题目预览" :width="680" :footer="false">
    <template #body>
      <question-show-content :question="question" :q-type="qType"></question-show-content>
    </template>
  </t-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

import QuestionShowContent from './QuestionShowContent.vue';

const { question, qType, visible } = defineProps({
  question: {
    type: Object,
    default: () => ({}),
  },
  qLoading: {
    type: Boolean,
    default: false,
  },
  qType: {
    type: Number,
    default: 0,
  },
  visible: {
    type: Boolean,
    default: false,
  },
});

const formVisible = ref(false);
const emit = defineEmits(['update:visible']);

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
</script>

<style lang="less" scoped></style>
