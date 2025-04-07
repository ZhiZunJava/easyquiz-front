<template>
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
    <t-row :gutter="[8, 8]">
      <t-col :span="2">
        <t-card :bordered="false">
          <t-row :gutter="[8, 8]">
            <t-col :span="12">
              <t-form-item label="试卷年级" name="level">
                <t-select v-model="formData.level" class="form-item-content" placeholder="请选择试卷年级" clearable>
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
            <t-col :span="12">
              <t-form-item label="试卷学科" name="subjectId">
                <t-select v-model="formData.subjectId" class="form-item-content" placeholder="请选择试卷学科" clearable>
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
              <t-form-item label="试卷类型" name="paperType">
                <t-select v-model="formData.paperType" class="form-item-content" placeholder="请选择试卷类型" clearable>
                  >
                  <t-option
                    v-for="item in paperEunmText"
                    :key="item.key"
                    :label="item.value"
                    :value="item.key"
                  ></t-option>
                </t-select>
              </t-form-item>
            </t-col>
          </t-row>
        </t-card>
      </t-col>
      <t-col :span="10">
        <!-- toolbox -->
        <t-row :gutter="[16, 16]">
          <t-col :span="12">
            <t-card :bordered="false">
              <t-row>
                <t-col :span="10">
                  <t-row :gutter="[24, 24]">
                    <t-col :span="3">
                      <t-form-item label="试卷名称" name="name">
                        <t-input v-model="formData.name" placeholder="请输入试卷标题" />
                      </t-form-item>
                    </t-col>
                    <t-col :span="4">
                      <t-form-item label="试卷时长" name="suggestTime">
                        <t-input-number
                          v-model="formData.suggestTime"
                          :min="1"
                          placeholder="请输入试卷时长"
                          auto-width
                        />
                      </t-form-item>
                    </t-col>
                    <t-col v-if="formData.paperType === 2" :span="4">
                      <t-form-item label="试卷时间限制" name="limitDateTime">
                        <t-date-range-picker
                          v-model="formData.limitDateTime"
                          clearable
                          enable-time-picker
                          placeholder="请输入试卷时间限制"
                        />
                      </t-form-item>
                    </t-col>
                  </t-row>
                </t-col>
                <t-col :span="2" class="operation-container">
                  <t-button theme="warning" @click="addTitle()"> 添加大题 </t-button>
                  <t-button theme="primary" type="submit"> {{ formData.id ? '修改' : '添加' }}试卷 </t-button>
                  <t-button type="reset" variant="base" theme="default">
                    {{ t('components.commonTable.reset') }}
                  </t-button>
                </t-col>
              </t-row>
            </t-card>
          </t-col>
          <template v-if="formData.titleItems.length !== 0">
            <t-col v-for="(titleItem, index) in formData.titleItems" :key="index" :span="12">
              <t-card :bordered="false" header-bordered>
                <template #title>
                  <t-input v-model="formData.titleItems[index].name" />
                </template>
                <template #actions>
                  <t-button theme="primary" @click="addQuestion(titleItem)">添加试题</t-button>
                  <t-button theme="danger" @click="deleteTitle(index)">删除大题</t-button>
                </template>
                <div v-if="titleItem.questionItems.length !== 0" class="question-list-box">
                  <t-form-item
                    v-for="(questionItem, questionIndex) in titleItem.questionItems"
                    :key="questionIndex"
                    style="margin-bottom: 0px"
                  >
                    <div class="list-box">
                      <div class="list-qu">
                        <question-show-content
                          :question="questionItem"
                          :q-type="questionItem.questionType"
                          :q-index="questionIndex + 1"
                        ></question-show-content>
                      </div>
                      <div class="list-opt">
                        <t-button theme="danger" @click="removeTitleItem(titleItem, questionItem)">移除本题</t-button>
                        <t-button
                          theme="default"
                          style="margin-left: 0"
                          @click="moveQuestionUp(titleItem, questionIndex)"
                          >排序上序</t-button
                        >
                        <t-button
                          theme="default"
                          style="margin-left: 0"
                          @click="moveQuestionDown(titleItem, questionIndex)"
                          >排序下序</t-button
                        >
                      </div>
                    </div>
                  </t-form-item>
                </div>
              </t-card>
            </t-col>
          </template>
          <t-col v-else :span="12">
            <t-alert theme="info">点击右上角创建试卷题目部分吧！</t-alert>
          </t-col>
        </t-row>
      </t-col>
    </t-row>
    <t-dialog
      v-model:visible="questionConfig.showDialog"
      class="list-common-table"
      header="选择试题"
      width="90vw"
      :footer="false"
    >
      <t-form :data="questionConfig.queryParam" :label-width="80" label-align="left" colon>
        <t-row>
          <t-col :span="10">
            <t-row :gutter="[24, 24]">
              <t-col :span="4">
                <t-form-item label="ID" name="id">
                  <t-input v-model="questionConfig.queryParam.id" placeholder="请输入ID" />
                </t-form-item>
              </t-col>
              <t-col :span="4">
                <t-form-item label="题目类型" name="questionType">
                  <t-select
                    v-model="questionConfig.queryParam.questionType"
                    class="form-item-content"
                    placeholder="请选择题目类型"
                    clearable
                  >
                    >
                    <t-option
                      v-for="item in questionTypeEnumText"
                      :key="item.key"
                      :label="item.value"
                      :value="item.key"
                    ></t-option>
                  </t-select>
                </t-form-item>
              </t-col>
              <t-col :span="4">
                <t-form-item label="题目难度" name="difficult">
                  <t-select
                    v-model="questionConfig.queryParam.difficult"
                    class="form-item-content"
                    placeholder="请选择题目类型"
                    clearable
                  >
                    >
                    <t-option
                      v-for="item in difficultyEnumText"
                      :key="item.key"
                      :label="item.value"
                      :value="item.key"
                    ></t-option>
                  </t-select>
                </t-form-item>
              </t-col>
            </t-row>
          </t-col>

          <t-col :span="2" class="operation-container">
            <t-button theme="warning" @click="queryQuestion()">
              {{ t('components.commonTable.query') }}
            </t-button>
            <t-button theme="primary" class="form-submit-confirm" @click="confirmQuestionSelect()"> 添加题目 </t-button>
          </t-col>
        </t-row>
      </t-form>
      <div class="table-container">
        <t-table
          :data="questionConfig.tableData"
          :columns="COLUMNS"
          row-key="id"
          vertical-align="top"
          hover
          bordered
          :pagination="pagination"
          :loading="questionConfig.listLoading"
          @change="rehandleChange"
          @select-change="rehandleSelectChange"
        >
        </t-table>
      </div>
    </t-dialog>
  </t-form>
</template>

<script setup lang="ts">
import { MessagePlugin, SubmitContext, TableProps, TableRowData, TooltipProps } from 'tdesign-vue-next';
import { computed, onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import examPaper from '@/api/examPaper';
import question from '@/api/question';
import { t } from '@/locales';
import { useExam } from '@/store';
import { useEnumItem } from '@/store/modules/enumitem';

import QuestionShowContent from '../question/edit/components/QuestionShowContent.vue';

const enumItemStore = useEnumItem();
const examStore = useExam();

const INITIAL_DATA_PAPER_DATA = {
  id: undefined,
  level: undefined,
  subjectId: undefined,
  paperType: 1,
  limitDateTime: [],
  name: '',
  suggestTime: undefined,
  titleItems: [] as Array<{ name: string; questionItems: any[] }>,
};
const route = useRoute();
const router = useRouter();
const form = ref();
const formData = ref({ ...INITIAL_DATA_PAPER_DATA });
const levelEnumText = computed(() => enumItemStore.user.levelEnum);
const questionTypeEnumText = computed(() => enumItemStore.exam.question.typeEnum);
const difficultyEnumText = computed(() => enumItemStore.user.difficulty);
const paperEunmText = computed(() => enumItemStore.exam.examPaper.paperTypeEnum);
const subjects = computed(() => examStore.subjects);
const FORM_RULES: any = ref({
  level: [{ required: true, message: '请选择年级', trigger: 'change' }],
  subjectId: [{ required: true, message: '请选择学科', trigger: 'change' }],
  paperType: [{ required: true, message: '请选择试卷类型', trigger: 'change' }],
  name: [{ required: true, message: '请输入试卷名称', trigger: 'blur' }],
  suggestTime: [{ required: true, message: '请输入建议时长', trigger: 'blur' }],
});
const subjectFilter = ref();
const questionConfig = reactive({
  multipleSelection: [] as TableRowData[],
  showDialog: false,
  queryParam: {
    id: undefined,
    questionType: undefined,
    subjectId: undefined,
    difficult: undefined,
    pageIndex: 1,
    pageSize: 5,
  },
  listLoading: true,
  tableData: [],
  total: 0,
});
const pagination = ref({
  defaultPageSize: 10,
  total: 100,
  defaultCurrent: 1,
});
const currentTitleItem = ref();
const onReset = () => {
  formData.value = { ...INITIAL_DATA_PAPER_DATA };
};

const onSubmit = ({ validateResult, firstError }: SubmitContext) => {
  if (!firstError) {
    examPaper
      .edit(formData.value)
      .then((_res) => {
        MessagePlugin.success(formData.value.id ? '修改成功' : '添加成功');
        router.push('/paper/index');
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

const addTitle = () => {
  formData.value.titleItems.push({
    name: `第${formData.value.titleItems.length + 1}大题`,
    questionItems: [],
  });
};

const deleteTitle = (index: number) => {
  formData.value.titleItems.splice(index, 1);
};

const getQuestionData = async () => {
  questionConfig.queryParam.subjectId = formData.value.subjectId ? formData.value.subjectId : undefined;
  questionConfig.listLoading = true;
  questionConfig.queryParam = {
    ...questionConfig.queryParam,
    pageIndex: pagination.value.defaultCurrent,
    pageSize: pagination.value.defaultPageSize,
  };
  question
    .pageList(questionConfig.queryParam)
    .then((res) => {
      questionConfig.tableData = res.list;
      questionConfig.total = res.total;
      pagination.value.total = res.total;
      pagination.value.defaultCurrent = res.pageNum;
      questionConfig.listLoading = false;
    })
    .catch((err) => {
      MessagePlugin.warning(err.message);
    });
};

const rehandleChange = (changeParams: any) => {
  if (changeParams.pagination?.current) {
    pagination.value.defaultCurrent = changeParams.pagination.current;
    getQuestionData();
  }
};

const rehandleSelectChange: TableProps['onSelectChange'] = (_value, ctx) => {
  questionConfig.multipleSelection = ctx.selectedRowData;
};

const confirmQuestionSelect = () => {
  questionConfig.multipleSelection.forEach((q: any) => {
    question.select(q.id).then((res) => {
      currentTitleItem.value.questionItems.push(res);
    });
  });
  questionConfig.showDialog = false;
};

const addQuestion = (titleItem: any) => {
  currentTitleItem.value = titleItem;
  questionConfig.showDialog = true;
  getQuestionData();
};

const removeTitleItem = (titleItems: any, questionItem: any) => {
  const index = titleItems.questionItems.findIndex((item: any) => item.id === questionItem.id);
  if (index > -1) {
    titleItems.questionItems.splice(index, 1);
  }
};

const moveQuestionUp = (titleItem: any, index: number) => {
  if (index <= 0) return;
  const temp = titleItem.questionItems[index];
  titleItem.questionItems[index] = titleItem.questionItems[index - 1];
  titleItem.questionItems[index - 1] = temp;
};

const moveQuestionDown = (titleItem: any, index: number) => {
  if (index >= titleItem.questionItems.length - 1) return;
  const temp = titleItem.questionItems[index];
  titleItem.questionItems[index] = titleItem.questionItems[index + 1];
  titleItem.questionItems[index + 1] = temp;
};

const queryQuestion = () => {
  pagination.value.defaultCurrent = 1;
  getQuestionData();
};

const COLUMNS: any = [
  { colKey: 'row-select', type: 'multiple', width: 64, fixed: 'left' },
  {
    title: 'ID',
    colKey: 'id',
    width: 100,
  },
  {
    title: '学科名称',
    colKey: 'subjectId',
    width: 150,
    cell: (h: any, { row }: { row: any }) => {
      return examStore.subjectEnumFormat(subjects.value, row.subjectId);
    },
  },
  {
    title: '题目类型',
    colKey: 'questionType',
    width: 150,
    cell: (h: any, { row }: { row: any }) => {
      return enumItemStore.enumFormat(questionTypeEnumText.value, row.questionType);
    },
  },
  {
    title: '题目标题',
    colKey: 'shortTitle',
    ellipsis: { theme: 'light' } as TooltipProps,
  },
  {
    title: '分数',
    colKey: 'score',
    width: 80,
  },
  {
    title: '难度',
    colKey: 'difficult',
    width: 80,
    cell: (h: any, { row }: { row: any }) => {
      return `${row.difficult} (${enumItemStore.enumFormat(difficultyEnumText.value, row.difficult)})`;
    },
  },
];

onMounted(() => {
  const id = route.query.id as string;
  examStore.initSubject(() => {
    subjectFilter.value = subjects.value;
  });
  if (id && parseInt(id, 10) !== 0) {
    examPaper.select(id).then((res) => {
      formData.value = res;
    });
  }
});
</script>
<style lang="less" scoped>
.base-form {
  height: calc(100vh - 60px);
  overflow-y: auto;
  padding: 20px;

  :deep(.t-form__item) {
    margin-bottom: 16px;
  }
}

.list-common-table {
  background-color: var(--td-bg-color-container);
  padding: var(--td-comp-paddingTB-xxl) var(--td-comp-paddingLR-xxl);
  border-radius: var(--td-radius-medium);

  .table-container {
    margin-top: var(--td-comp-margin-xxl);
    height: calc(100vh - 350px);
    overflow-y: auto;
  }
}

.form-item-content {
  width: 100%;
}

.operation-container {
  display: flex;
  justify-content: flex-end;
  align-items: center;

  .expand {
    .t-button__text {
      display: flex;
      align-items: center;
    }
  }
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
</style>
