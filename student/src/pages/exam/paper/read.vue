<template>
  <div ref="root" class="do-exam">
    <div class="paper-item-order-fake">
      <div class="paper-item-order">
        <t-card :title="form.name" header-bordered>
          <t-descriptions size="small" layout="vertical">
            <t-descriptions-item label="试卷得分">{{ answer.score }}分 / {{ form.score }}分</t-descriptions-item>
            <t-descriptions-item label="考试时间">{{ form.suggestTime }}分钟</t-descriptions-item>
          </t-descriptions>
          <t-divider dashed></t-divider>
          <t-space break-line size="small">
            <span v-for="item in answer.answerItems" :key="item.itemOrder">
              <t-tag
                :theme="questionCompleted(item.doRight)"
                class="do-exam-title-tag"
                @click="goAnchor('#question-' + item.itemOrder)"
                >{{ item.itemOrder }}</t-tag
              >
            </span>
          </t-space>
          <t-divider dashed></t-divider>
          <div class="do-exam-time">
            <div class="title">考生消耗时间</div>
            <div class="time">
              {{ formatSeconds(answer.doTime) }}
            </div>
          </div>
        </t-card>
      </div>
    </div>
    <div class="paper-question-content">
      <t-card v-for="(titleItem, index) in form.titleItems" :key="index" :title="titleItem.name" header-bordered>
        <div v-if="titleItem.questionItems.length !== 0" class="question-list-box">
          <t-form-item
            v-for="(questionItem, questionIndex) in titleItem.questionItems"
            :id="'question-' + questionItem.itemOrder"
            :key="questionIndex"
            style="margin-bottom: 0px"
          >
            <div class="list-box">
              <div class="list-qu">
                <question-answer-show
                  :q-type="questionItem.questionType"
                  :question="questionItem"
                  :answer="answer.answerItems[questionItem.itemOrder - 1]"
                  :q-loading="loading"
                ></question-answer-show>
              </div>
            </div>
          </t-form-item>
        </div>
      </t-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

import examPaperAnswer from '@/api/examPaperAnswer';
import { useEnumItem } from '@/store/modules/enumitem';
import { formatSeconds } from '@/utils/date';

import QuestionAnswerShow from '../components/QuestionAnswerShow.vue';

const route = useRoute();
const loading = ref(false);
const enumItemStore = useEnumItem();
const doCompletedTag = computed(() => enumItemStore.exam.question.answer.doRightTag);
const form = ref<any>({});
const answer = ref<any>({
  id: null,
  score: 0,
  doTime: 0,
  answerItems: [],
  doRight: false,
});

const questionCompleted = (completed: any) => {
  return enumItemStore.enumFormat(doCompletedTag.value, completed);
};

const root = ref<any>(null); // 获取根元素引用

const goAnchor = (selector: any) => {
  const el = root.value?.querySelector(selector);
  if (el) {
    el.scrollIntoView({
      behavior: 'instant', // 注意：部分浏览器可能不支持 'instant'
      block: 'center',
      inline: 'nearest',
    });
  }
};

onMounted(() => {
  const { id } = route.query;
  if (id && parseInt(id as string, 10) !== 0) {
    loading.value = true;
    examPaperAnswer.read(id as string).then((res) => {
      form.value = res.paper;
      answer.value = res.answer;
      loading.value = false;
    });
  }
});
</script>
<style lang="less" scoped>
.do-exam {
  display: flex;
  flex-direction: row;
  background-color: #eff3f7;
  padding: 20px 90px;
  min-height: 100%;

  .paper-item-order-fake {
    width: 270px;
    height: 100%;
  }

  .paper-item-order {
    width: 270px;
    height: 100%;
    position: fixed;
    z-index: 999;

    .t-card {
      height: calc(100% - 40px) !important;
      overflow: auto;
    }
  }
  .do-exam-title-tag {
    cursor: pointer;
  }
  .paper-question-content {
    flex: 1;
    margin-left: 20px;
  }

  .question-list-box {
    .list-box {
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      padding-bottom: 20px;
      border-bottom: 3px dotted #eee;
      margin-bottom: 20px;
      width: 100%;

      .list-qu {
        -webkit-box-flex: 1;
        -ms-flex-positive: 1;
        flex-grow: 1;
        padding-right: 20px;
      }

      .list-opt {
        width: 100px;
        text-align: center;
        font-size: 12px;
        line-height: 36px;
        -ms-flex-negative: 0;
        flex-shrink: 0;
      }
    }
  }

  .do-exam-time {
    display: flex;
    justify-content: center;
    flex-direction: column;
    .title {
      font: var(--td-font-title-medium);
      color: var(--td-text-color-primary);
      text-align: center;
    }
    .time {
      font: var(--td-font-title-large);
      margin-top: 10px;
      color: red;
      text-align: center;
    }
  }
}
</style>
