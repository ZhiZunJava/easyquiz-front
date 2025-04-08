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
              <span>填空题管理</span> <t-tag theme="primary">{{ formData.id ? '修改' : '新增' }}</t-tag>
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
                <t-form-item
                  name="title"
                  help="添加填空点击后，在题目标答中会自动生成填空题的序号和内容填充，不要随意更改内容！删除填空请将<span class='gapfilling-span'>序号</span>全部删除！"
                >
                  <template #label>
                    <span>题目主干</span>
                    <t-button style="margin-left: 10px" size="small" theme="primary" @click="questionAdd"
                      >添加填空</t-button
                    >
                  </template>
                  <t-textarea
                    ref="titleRef"
                    v-model="formData.title"
                    class="form-item-content"
                    placeholder="请输入题目主干"
                  />
                </t-form-item>
              </t-col>
              <t-col :span="12">
                <t-form-item required-mark>
                  <template #label>
                    <span>题目标答</span>
                  </template>
                  <t-row :gutter="[8, 8]" style="margin-top: 10px; width: 100%">
                    <t-col v-for="item in formData.items" :key="item.prefix" :span="12">
                      <div style="display: flex; width: 100%">
                        <div style="flex: 1">
                          <t-input-adornment :prepend="item.prefix">
                            <t-input v-model="item.content" placeholder="请输入题目选项内容" />
                            <template #append>
                              <t-input-number
                                v-model="item.score"
                                auto-width
                                :decimal-places="1"
                                :min="0"
                                class="form-item-content"
                                placeholder="请输入分数"
                              />
                            </template>
                          </t-input-adornment>
                        </div>
                      </div>
                    </t-col>
                  </t-row>
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
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import question from '@/api/question';
import { useExam } from '@/store';
import { useEnumItem } from '@/store/modules/enumitem';

import QuestionShow from './components/QuestionShow.vue';
import { INITIAL_DATA_GAP_FILLING } from './constants';

// 添加题目选项接口定义
interface QuestionItem {
  prefix: string;
  content: string;
  itemUuid: string;
  score: number;
}

// 定义问题表单接口，扩展INITIAL_DATA_GAP_FILLING结构
interface QuestionForm {
  id?: string | number;
  questionType: number;
  gradeLevel?: number;
  subjectId?: number;
  title: string;
  items: QuestionItem[];
  analyze: string;
  correct: string;
  score: string | number;
  difficult: number;
}

const route = useRoute();
const router = useRouter();
const useExamStore = useExam();
const enumItemStore = useEnumItem();
const levelEnumText = computed(() => {
  return enumItemStore.user.levelEnum;
});
const titleRef = ref<HTMLTextAreaElement | null>(null);
const subjects = computed(() => useExamStore.subjects);
const subjectFilter = ref();
const formLoading = ref(false);
const formData = ref<QuestionForm>({
  ...INITIAL_DATA_GAP_FILLING,
  items: [] as QuestionItem[],
});
const FORM_RULES: any = {
  gradeLevel: [{ required: true, message: '请选择年级', trigger: 'change' }],
  subjectId: [{ required: true, message: '请选择学科', trigger: 'change' }],
  title: [{ required: true, message: '请输入题干', trigger: 'blur' }],
  analyze: [{ required: true, message: '请输入解析', trigger: 'blur' }],
  score: [{ required: true, message: '请输入分数', trigger: 'blur' }],
  correct: [{ required: true, message: '请选择正确答案', trigger: 'change' }],
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
  questionShowConfig.qType = 4;
  questionShowConfig.dialog = true;
  questionShowConfig.question = formData.value;
};

const onReset = () => {
  formData.value = {
    ...INITIAL_DATA_GAP_FILLING,
    items: [] as QuestionItem[],
  };
  MessagePlugin.success('重置成功');
};

function randomUUID() {
  const hexDigits = '0123456789abcdef';
  let uuid = '';

  for (let i = 0; i < 36; i++) {
    if (i === 8 || i === 13 || i === 18 || i === 23) {
      uuid += '-';
    } else if (i === 14) {
      uuid += '4';
    } else if (i === 19) {
      uuid += hexDigits[Math.floor(Math.random() * 4) + 8];
    } else {
      uuid += hexDigits[Math.floor(Math.random() * 16)];
    }
  }
  return uuid;
}

const questionAdd = () => {
  const uuid = randomUUID();
  const index = formData.value.items ? formData.value.items.length + 1 : 1;
  const spanText = `<span class="gapfilling-span ${uuid}">${index}</span>`;

  // 向文本区域插入标签
  const textarea = titleRef.value;
  if (textarea) {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = formData.value.title;
    formData.value.title = text.substring(0, start) + spanText + text.substring(end);
    formData.value.items.push({
      prefix: index.toString(),
      content: '',
      itemUuid: uuid,
    } as QuestionItem);
  }
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

// 添加防抖函数
function debounce(fn: Function, delay: number) {
  let timer: number | null = null;
  return (...args: any[]) => {
    if (timer) clearTimeout(timer);
    timer = window.setTimeout(() => {
      fn(...args);
      timer = null;
    }, delay);
  };
}

// 监听文本区域内容变化，同步更新答案选项
const updateItemsDebounced = debounce((newTitle: string) => {
  if (!formData.value.items || formData.value.items.length === 0) return;

  // 保存符合条件的题目项
  const newItems: QuestionItem[] = [];

  // 遍历每个答案项，使用更宽松的正则表达式检查UUID是否存在
  formData.value.items.forEach((item) => {
    // 只检查UUID是否在文本中，不要求完整标签格式
    const uuidExists = new RegExp(item.itemUuid).test(newTitle);

    if (uuidExists) {
      // 尝试提取序号，如果能提取到就更新
      const prefixMatch = newTitle.match(new RegExp(`class="gapfilling-span ${item.itemUuid}">(.*?)</span>`));
      if (prefixMatch && prefixMatch[1] !== item.prefix) {
        const [, newPrefix] = prefixMatch;
        item.prefix = newPrefix;
      }
      newItems.push(item);
    }
  });

  // 只有当项目数量确实减少时才更新
  if (newItems.length < formData.value.items.length) {
    formData.value.items = newItems;
  } else if (newItems.length === formData.value.items.length) {
    // 如果数量相同，只更新前缀
    formData.value.items.forEach((item, index) => {
      const [newItem] = [newItems[index]];
      if (newItem && newItem.prefix !== item.prefix) {
        item.prefix = newItem.prefix;
      }
    });
  }
}, 500);

watch(
  () => formData.value.title,
  (newTitle) => {
    updateItemsDebounced(newTitle);
  },
  { deep: true },
);

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
