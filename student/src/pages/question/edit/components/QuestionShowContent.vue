<template>
  <div class="operator-block">
    <div class="operator-content">
      <div class="operator-title">
        <div v-if="qIndex" class="num">{{ qIndex }}</div>
        <t-tag v-if="qType === 4 || qType === 5" theme="warning">人工批阅</t-tag>
        <t-tag v-else theme="success">机器批阅</t-tag>
        <t-tag>{{ enumItemStore.enumFormat(questionTypeEnumText, qType) }}</t-tag>
        <h1 v-html="question.title"></h1>
      </div>
      <div v-if="qType !== 5" class="qu-answer">
        <div v-for="(item, index) in question.items" :key="index" class="item">
          <div class="tag">{{ item.prefix }}</div>
          <div class="content">{{ item.content }}</div>
          <div class="right">
            <t-tag v-if="isCorrectAnswer(item.prefix)" shape="round" theme="success" variant="light-outline">
              <check-circle-filled-icon></check-circle-filled-icon>
              正确
            </t-tag>
          </div>
        </div>
      </div>
      <div v-if="qType === 5" class="show-t">参考答案：</div>
      <div v-if="qType === 5" class="qu-answer">
        <div class="item">
          <div class="content">{{ question.correct }}</div>
        </div>
      </div>
      <div v-if="question.analyze" class="as-box">
        <div>
          <div class="min-tt">大题解析</div>
          <div>
            <p v-html="question.analyze"></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CheckCircleFilledIcon } from 'tdesign-icons-vue-next';
import { computed } from 'vue';

import { useEnumItem } from '@/store/modules/enumitem';

const { question, qType, qIndex } = defineProps({
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
  qIndex: {
    type: Number,
  },
});

const enumItemStore = useEnumItem();
const questionTypeEnumText = computed(() => {
  return enumItemStore.exam.question.typeEnum;
});

// 判断选项是否为正确答案
const isCorrectAnswer = (prefix: string) => {
  if (qType === 1 || qType === 3) {
    return question.correct === prefix;
  }
  if (qType === 2) {
    return question.correctArray?.includes(prefix);
  }
  // 如果是其他类型（排除qType===5，因为它没有呈现此部分）
  return true;
};
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
