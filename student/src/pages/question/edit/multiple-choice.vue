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
                <t-form-item required-mark>
                  <template #label>
                    <span>题目选项</span>
                    <t-button style="margin-left: 10px" size="small" theme="primary" @click="questionAdd"
                      >添加选项</t-button
                    >
                  </template>
                  <t-row :gutter="[8, 8]" style="margin-top: 10px; width: 100%">
                    <t-col v-for="(item, index) in formData.items" :key="item.prefix" :span="12">
                      <div style="display: flex; width: 100%">
                        <div style="flex: 1">
                          <t-input-adornment :prepend="item.prefix">
                            <t-input v-model="item.content" placeholder="请输入题目选项内容" />
                          </t-input-adornment>
                        </div>
                        <t-button
                          style="margin-left: 10px; height: auto"
                          size="small"
                          theme="danger"
                          @click="questionRemove(index)"
                          >删除</t-button
                        >
                      </div>
                    </t-col>
                  </t-row>
                </t-form-item>
              </t-col>
              <t-col :span="12">
                <t-form-item label="标准答案" name="correctArray">
                  <t-checkbox-group v-model="formData.correctArray">
                    <t-checkbox v-for="item in formData.items" :key="item.prefix" :value="item.prefix">{{
                      item.prefix
                    }}</t-checkbox>
                  </t-checkbox-group>
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
import { INITIAL_DATA_MULTIPLE_CHOICE } from './constants';

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
const formData = ref({ ...INITIAL_DATA_MULTIPLE_CHOICE });
const FORM_RULES: any = {
  gradeLevel: [{ required: true, message: '请选择年级', trigger: 'change' }],
  subjectId: [{ required: true, message: '请选择学科', trigger: 'change' }],
  title: [{ required: true, message: '请输入题干', trigger: 'blur' }],
  analyze: [{ required: true, message: '请输入解析', trigger: 'blur' }],
  score: [{ required: true, message: '请输入分数', trigger: 'blur' }],
  correctArray: [{ required: true, message: '请选择正确答案', trigger: 'change' }],
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
  questionShowConfig.qType = 2;
  questionShowConfig.dialog = true;
  questionShowConfig.question = formData.value;
};

const onReset = () => {
  formData.value = { ...INITIAL_DATA_MULTIPLE_CHOICE };
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

const questionRemove = (index: number) => {
  if (formData.value.items.length === 3) {
    MessagePlugin.warning('至少需要保留三个选项');
    return;
  }
  formData.value.items.splice(index, 1);
  formData.value.items.forEach((item, i) => {
    item.prefix = String.fromCharCode('A'.charCodeAt(0) + i);
  });
};

const questionAdd = () => {
  const { items } = formData.value;
  let newPrefix;
  if (items.length > 0) {
    const last = items[items.length - 1];
    newPrefix = String.fromCharCode(last.prefix.charCodeAt(0) + 1);
  } else {
    newPrefix = 'A';
  }
  items.push({
    prefix: newPrefix,
    content: '',
    id: null,
  });
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
