<template>
  <div>
    <t-loading :loading="formLoading">
      <t-form
        ref="form"
        class="base-form"
        :data="formData"
        :rules="FORM_RULES"
        label-align="top"
        :label-width="100"
        @reset="onReset"
        @submit="onSubmit"
      >
        <div class="form-basic-container">
          <div class="form-basic-item">
            <div class="form-basic-container-title">
              <span>多选题管理</span> <t-tag theme="primary">{{ formData.id ? '修改' : '新增' }}</t-tag>
            </div>
            <t-row class="row-gap" :gutter="[32, 24]">
              <t-col :span="6">
                <t-form-item label="题目年级" name="gradeLevel">
                  <t-select
                    v-model="formData.gradeLevel"
                    class="form-item-content"
                    placeholder="请选择题目年级"
                    clearable
                    @change="levelChange"
                  >
                    >
                    <t-option
                      v-for="item in levelEnumText"
                      :key="item.key"
                      :label="item.value"
                      :value="item.key"
                    ></t-option>
                  </t-select>
                </t-form-item>
              </t-col>
              <t-col :span="6">
                <t-form-item label="题目学科" name="subjectId">
                  <t-select
                    v-model="formData.subjectId"
                    class="form-item-content"
                    placeholder="请选择题目学科"
                    clearable
                  >
                    >
                    <t-option
                      v-for="item in subjectFilter"
                      :key="item.id"
                      :label="item.name + ' ( ' + item.levelName + ' )'"
                      :value="item.id"
                    ></t-option>
                  </t-select>
                </t-form-item>
              </t-col>
              <t-col :span="12">
                <t-form-item label="题目主干" name="title">
                  <t-input v-model="formData.title" class="form-item-content" placeholder="请输入题目主干" />
                </t-form-item>
              </t-col>
              <t-col :span="12">
                <t-form-item label="标准答案" name="correct">
                  <t-input v-model="formData.correct" class="form-item-content" placeholder="请输入答案" />
                </t-form-item>
              </t-col>
              <t-col :span="12">
                <t-form-item label="解析" name="analyze">
                  <t-input v-model="formData.analyze" class="form-item-content" placeholder="请输入解析" />
                </t-form-item>
              </t-col>
              <t-col :span="6">
                <t-form-item label="分数" name="score">
                  <t-input-number
                    v-model="formData.score"
                    auto-width
                    :decimal-places="1"
                    :min="0"
                    class="form-item-content"
                    placeholder="请输入分数"
                  />
                </t-form-item>
              </t-col>
              <t-col :span="6">
                <t-form-item label="难度" name="difficult">
                  <t-rate
                    v-model="formData.difficult"
                    class="form-item-content"
                    show-text
                    :texts="['入门', '简单', '中等', '困难', '专家']"
                  />
                </t-form-item>
              </t-col>
            </t-row>
          </div>
        </div>
        <div class="form-submit-container">
          <div class="form-submit-sub">
            <div class="form-submit-left">
              <t-button theme="primary" class="form-submit-confirm" type="submit">
                {{ formData.id ? '修改' : '添加' }}题目
              </t-button>
              <t-button class="form-submit-confirm" @click="showQuestion"> 预览题目 </t-button>
              <t-button type="reset" class="form-submit-cancel" theme="default" variant="base"> 重置题目 </t-button>
            </div>
          </div>
        </div>
      </t-form>
      <question-show
        v-model:visible="questionShowConfig.dialog"
        :question="questionShowConfig.question"
        :q-type="questionShowConfig.qType"
      />
    </t-loading>
  </div>
</template>
<script setup lang="ts">
import { MessagePlugin, SubmitContext } from 'tdesign-vue-next';
import { computed, onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import question from '@/api/question';
import { useExam } from '@/store';
import { useEnumItem } from '@/store/modules/enumitem';

import QuestionShow from './components/QuestionShow.vue';
import { INITIAL_DATA_SHORT_ANSWER } from './constants';

const route = useRoute();
const router = useRouter();
const useExamStore = useExam();
const enumItemStore = useEnumItem();
const levelEnumText = computed(() => {
  return enumItemStore.user.levelEnum;
});

const subjects = computed(() => useExamStore.subjects);
const subjectFilter = ref();
const formLoading = ref(false);
const formData = ref({ ...INITIAL_DATA_SHORT_ANSWER });
const FORM_RULES: any = {
  gradeLevel: [{ required: true, message: '请选择年级', trigger: 'change' }],
  subjectId: [{ required: true, message: '请选择学科', trigger: 'change' }],
  title: [{ required: true, message: '请输入题干', trigger: 'blur' }],
  analyze: [{ required: true, message: '请输入解析', trigger: 'blur' }],
  score: [{ required: true, message: '请输入分数', trigger: 'blur' }],
  correct: [{ required: true, message: '请输入答案', trigger: 'blur' }],
  difficult: [{ required: true, message: '请选择难度', trigger: 'change' }],
};
const questionShowConfig = reactive({
  qType: 0,
  dialog: false,
  question: {},
});

const levelChange = () => {
  formData.value.subjectId = undefined;
  subjectFilter.value = subjects.value.filter((item: any) => item.level === formData.value.gradeLevel);
};

const showQuestion = () => {
  questionShowConfig.qType = 5;
  questionShowConfig.dialog = true;
  questionShowConfig.question = formData.value;
};

const onReset = () => {
  formData.value = { ...INITIAL_DATA_SHORT_ANSWER };
  MessagePlugin.success('重置成功');
};

const onSubmit = ({ validateResult, firstError }: SubmitContext) => {
  if (!firstError) {
    question
      .edit(formData.value)
      .then((_res) => {
        MessagePlugin.success(formData.value.id ? '修改成功' : '添加成功');
        router.push('/question');
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

onMounted(() => {
  const { id } = route.query;
  if (id && parseInt(id as string, 10) !== 0) {
    formData.value.id = id as any;
    formLoading.value = true;
    question
      .select(id as string)
      .then((res) => {
        formData.value = res;
        formLoading.value = false;
      })
      .catch((err) => {
        formLoading.value = false;
        MessagePlugin.error(err.message);
      });
  }
  useExamStore.initSubject(() => {
    subjectFilter.value = subjects.value;
  });
});
</script>

<style lang="less" scoped>
@import './edit.less';
</style>
