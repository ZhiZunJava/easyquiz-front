<template>
  <div class="operator-block">
    <div class="operator-content">
      <div class="operator-title">
        <div v-if="question.itemOrder" class="num">{{ question.itemOrder }}</div>
        <t-tag v-if="qType === 4 || qType === 5" theme="warning">人工批阅</t-tag>
        <t-tag v-else theme="success">机器批阅</t-tag>
        <t-tag>{{ enumItemStore.enumFormat(questionTypeEnumText, qType) }}</t-tag>
        <h1 v-html="question.title"></h1>
      </div>
      <div class="op-content">
        <template v-if="qType == 1">
          <t-radio-group v-model="localAnswer" :disabled="qLoading">
            <t-radio v-for="item in question.items" :key="item.prefix" :value="item.prefix">
              <span class="question-prefix">{{ item.prefix }}.</span>
              <span class="q-item-span-content" v-html="item.content"></span>
            </t-radio>
          </t-radio-group>
        </template>
        <template v-else-if="qType == 2">
          <t-checkbox-group v-model="localAnswerArr" :disabled="qLoading">
            <t-checkbox v-for="item in question.items" :key="item.prefix" :value="item.prefix">
              <span class="question-prefix">{{ item.prefix }}.</span>
              <span class="q-item-span-content" v-html="item.content"></span>
            </t-checkbox>
          </t-checkbox-group>
        </template>
        <template v-else-if="qType == 3">
          <t-radio-group v-model="localAnswer" :disabled="qLoading">
            <t-radio v-for="item in question.items" :key="item.prefix" :label="item.prefix">
              <span class="question-prefix">{{ item.prefix }}.</span>
              <span class="q-item-span-content" v-html="item.content"></span>
            </t-radio>
          </t-radio-group>
        </template>
        <template v-else-if="qType == 4">
          <t-form-item
            v-for="(item, index) in question.items"
            :key="item.prefix"
            :label="item.prefix"
            label-width="50px"
            style="margin-top: 10px; margin-bottom: 10px"
          >
            <t-input
              :value="localAnswerArr[index]"
              :disabled="qLoading"
              @change="(val) => handleFillAnswerChange(index, val)"
            />
          </t-form-item>
        </template>
        <template v-else-if="qType == 5">
          <t-textarea v-model="localAnswer" rows="5" :disabled="qLoading" />
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import { useEnumItem } from '@/store/modules/enumitem';

const props = defineProps({
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
  answer: {
    type: Object,
    default() {
      return { id: null, content: '', contentArray: [] };
    },
  },
});

const emit = defineEmits(['update:answer']);

const { question, qType } = props;

// 确保question.items存在
const questionItems = computed(() => {
  return question?.items || [];
});

const localAnswer = computed({
  get: () => props.answer?.content || '',
  set: (val) => {
    const updatedAnswer = { ...props.answer, content: val, completed: true };
    emit('update:answer', updatedAnswer);
  },
});

// 处理多选题和填空题的答案数组
const localAnswerArr = computed({
  get: () => {
    // 如果是填空题，确保数组长度与问题项目数量匹配
    if (qType === 4) {
      const arr = [...(props.answer?.contentArray || [])];
      while (arr.length < questionItems.value.length) {
        arr.push('');
      }
      return arr;
    }
    // 如果是多选题，直接返回数组
    return props.answer?.contentArray || [];
  },
  set: (val) => {
    const updatedAnswer = { ...props.answer, contentArray: val, completed: true };
    emit('update:answer', updatedAnswer);
  },
});

// 处理填空题单个输入框的值变化
const handleFillAnswerChange = (index: number, value: any) => {
  const newAnswerArr = [...localAnswerArr.value];
  newAnswerArr[index] = String(value);
  localAnswerArr.value = newAnswerArr;
};

const enumItemStore = useEnumItem();
const questionTypeEnumText = computed(() => {
  return enumItemStore.exam.question.typeEnum;
});
</script>

<style lang="less" scoped>
.operator-block {
  position: relative;
  background-color: var(--td-bg-color-container);
  border: 1px solid var(--td-component-border);
  border-radius: var(--td-radius-medium);

  .operator-content {
    padding: var(--td-comp-paddingTB-xl) var(--td-comp-paddingLR-xl);

    .operator-title {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-bottom: 15px;
    }

    h1 {
      display: inline-block;
      font: var(--td-font-title-large);
      color: var(--td-text-color-primary);
    }

    .num {
      display: inline-block;
      background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACUAAAAlCAYAAADFniADAAABLUlEQVRYhe3YsSuFURjH8Q/uQiR/gYwWA5PBoExikbqDwebPsPgXDJJMDEwig5AkSQbKQCwmSUoYbgaltw5xc3V079U7nG/96tR7Ouf7Pj1neRqKs6VbtMoRBbSjJU9SjXjLgcc3GnPk8kmSiiVJxZKkYklSsSSpWJJULEkqliQVS5KKJUnFkqRiSVKx5FKqUKNzLnGGTvRXe1i1UjvYxhqu0IEiBjCKtv+SykZH69jCLl6+fHvEXMhgyDD66iV1gFUc4jRi/17IQqjcCMZj7syGZs+/lDmrwiI2cY67P/xEOc3owRAm0F1pYyXrI8zjJDRxLWZYJRyHLAfBSYz9JNUU1lk/LGEF17ivgUglbkL2MR0exRS6PqSyXslezwYe8FpHmXKeQi5C7/Vi5h0kKTc5za2mwgAAAABJRU5ErkJggg==)
        no-repeat 100% 100%;
      background-size: contain;
      height: 30px;
      width: 30px;
      line-height: 25px;
      color: #fff;
      font-size: 14px;
      text-align: center;
      margin-right: 15px;
      -ms-flex-negative: 0;
      flex-shrink: 0;
    }

    .qu-answer {
      margin-top: 15px;

      .item {
        display: flex;
        border: 1px solid #eee;
        border-radius: 5px;
        line-height: 20px;
        margin: 15px 0;
        padding: 10px;
        cursor: pointer;
        font-size: 14px;

        .tag {
          width: 10px;
          font-weight: 700;
          color: #0a84ff;
          display: flex;
          align-items: center;
        }

        .content {
          flex-grow: 1;
          padding-left: 10px;
        }

        .right {
          flex-shrink: 0;
        }
      }
    }

    .show-t {
      color: #1890ff;
      font-weight: 700;
      font-size: 14px;
    }
    .as-box {
      border: 1px solid #eee;
      border-radius: 5px;
      line-height: 24px;
      margin: 10px 0 10px 0;
      padding: 10px;
      font-size: 14px;
      color: #555;
      background: #fcfcfc;

      .min-tt {
        color: #222;
        font-weight: 700;
      }
    }
  }
}
</style>
