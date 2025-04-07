<template>
  <div ref="root" class="do-exam">
    <div class="paper-item-order-fake">
      <div class="paper-item-order">
        <t-card :title="form.name" header-bordered>
          <t-descriptions size="small" layout="vertical">
            <t-descriptions-item label="试卷总分">{{ form.score }}分</t-descriptions-item>
            <t-descriptions-item label="考试时间">{{ form.suggestTime }}分钟</t-descriptions-item>
          </t-descriptions>
          <t-divider dashed></t-divider>
          <t-space break-line size="small">
            <span v-for="item in answer.answerItems" :key="item.itemOrder">
              <t-tag
                :theme="questionCompleted(item.completed)"
                class="do-exam-title-tag"
                @click="goAnchor('#question-' + item.itemOrder)"
                >{{ item.itemOrder }}</t-tag
              >
            </span>
          </t-space>
          <t-divider dashed></t-divider>
          <div class="do-exam-time">
            <div class="title">剩余时间</div>
            <div class="time">
              {{ formatSeconds(remainTime) }}
            </div>
            <t-divider dashed></t-divider>
            <t-button @click="submitForm()">提交试卷</t-button>
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
                <question-edit
                  :question="questionItem"
                  :q-type="questionItem.questionType"
                  :answer="answer.answerItems[questionItem.itemOrder - 1]"
                  @update:answer="handleAnswerUpdate"
                ></question-edit>
              </div>
            </div>
          </t-form-item>
        </div>
      </t-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { DialogPlugin, MessagePlugin } from 'tdesign-vue-next';
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useRoute } from 'vue-router';

import examPaper from '@/api/examPaper';
import examPaperAnswer from '@/api/examPaperAnswer';
import router from '@/router';
import { useEnumItem } from '@/store/modules/enumitem';
import { formatSeconds } from '@/utils/date';

import QuestionEdit from '../components/QuestionEdit.vue';

const route = useRoute();
const enumItemStore = useEnumItem();
const doCompletedTag = computed(() => enumItemStore.exam.question.answer.doCompletedTag);
const form = ref<any>({});
const answer = ref<any>({
  questionId: null,
  doTime: 0,
  answerItems: [],
});
const timer = ref<any>(null);
const remainTime = ref(0);
const initAnswer = () => {
  answer.value.id = form.value.id;
  const titleItemArray = form.value.titleItems;
  for (const tIndex in titleItemArray) {
    const questionArray = titleItemArray[tIndex].questionItems;
    for (const qIndex in questionArray) {
      const question = questionArray[qIndex];
      answer.value.answerItems.push({
        questionId: question.id,
        content: null,
        contentArray: [],
        completed: false,
        itemOrder: question.itemOrder,
      });
    }
  }
};

const timeReduce = () => {
  timer.value = setInterval(() => {
    if (remainTime.value <= 0) {
      submitForm();
    } else {
      ++answer.value.doTime;
      --remainTime.value;
    }
  }, 1000);
};

const submitForm = () => {
  window.clearInterval(timer.value);
  examPaperAnswer
    .answerSubmit(answer.value)
    .then((res) => {
      const confirmDia = DialogPlugin.alert({
        header: '考试结果',
        body: `试卷得分：${res}分`,
        confirmBtn: '返回考试记录',
        onConfirm: () => {
          router.push('/record/index');
          // 请求成功后，销毁弹框
          confirmDia.destroy();
        },
        onClose: () => {
          router.push('/record/index');
          confirmDia.hide();
        },
      });
    })
    .catch((e) => {
      MessagePlugin.warning(e.messgae);
    });
};

const handleAnswerUpdate = (newAnswer: any) => {
  console.log(newAnswer);
  // 根据题目序号找到对应的答案项
  const answerItem = answer.value.answerItems[newAnswer.itemOrder - 1];
  if (answerItem) {
    // 更新答案内容
    answerItem.content = newAnswer.content;
    answerItem.contentArray = newAnswer.contentArray;
    answerItem.completed = newAnswer.completed;
  }
};

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
    examPaper.select(id as string).then((res) => {
      form.value = res;
      remainTime.value = res.suggestTime * 60;
      initAnswer();
      console.log(answer.value);
      timeReduce();
    });
  }
});

onUnmounted(() => {
  window.clearInterval(timer.value);
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
