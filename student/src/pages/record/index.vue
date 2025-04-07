<template>
  <div class="list-common-table">
    <t-form ref="form" :data="queryParam" :label-width="80" colon @reset="resetData" @submit="searchData">
      <t-row>
        <t-col :span="10">
          <t-row :gutter="[24, 24]">
            <t-col :span="4">
              <t-form-item label="题目学科" name="subjectId">
                <t-select
                  v-model="queryParam.subjectId"
                  class="form-item-content"
                  placeholder="请选择题目学科"
                  clearable
                >
                  >
                  <t-option
                    v-for="item in subjectFilter"
                    :key="item.id"
                    :label="item.name"
                    :value="Number(item.id)"
                  ></t-option>
                </t-select>
              </t-form-item>
            </t-col>
          </t-row>
        </t-col>

        <t-col :span="2" class="operation-container">
          <t-button theme="primary" type="submit">
            {{ t('components.commonTable.query') }}
          </t-button>
        </t-col>
      </t-row>
    </t-form>

    <div class="table-container">
      <t-table
        :data="data"
        :columns="COLUMNS"
        :row-key="rowKey"
        :vertical-align="verticalAlign"
        :hover="hover"
        :pagination="pagination"
        :loading="dataLoading"
        @change="rehandleChange"
      >
        <template #op="slotProps">
          <t-space>
            <t-link v-if="slotProps.row.status === 2" theme="primary" @click="toDOPaper(slotProps.row.id)">
              查看试卷
            </t-link>
          </t-space>
        </template>
      </t-table>
    </div>
  </div>
</template>
<script setup lang="tsx">
import { CheckCircleFilledIcon, PendingFilledIcon } from 'tdesign-icons-vue-next';
import { TooltipProps } from 'tdesign-vue-next';
import { computed, onMounted, ref } from 'vue';

import examPaperAnswer from '@/api/examPaperAnswer';
import { t } from '@/locales';
import router from '@/router';
import { useExam } from '@/store';
import { useEnumItem } from '@/store/modules/enumitem';

const useExamStore = useExam();
const enumItemStore = useEnumItem();
const paperEunmText = computed(() => enumItemStore.exam.examPaper.paperTypeEnum);
const statusEnum = computed(() => enumItemStore.exam.examPaperAnswer.statusEnum);
const statusTag = computed(() => enumItemStore.exam.examPaperAnswer.statusTag);

const queryParam = ref({
  paperType: 1,
  subjectId: undefined,
});

const data = ref([]);
const total = ref(0);
const dataLoading = ref(false);
const subjectFilter = ref();
const subjects = computed(() => useExamStore.subjects);
const rowKey = 'id';
const verticalAlign = 'top' as const;
const hover = true;

const COLUMNS: any = [
  {
    title: 'ID',
    colKey: 'id',
    width: 100,
  },
  {
    title: '试卷学科名称',
    colKey: 'subjectId',
    width: 150,
    cell: (h: any, { row }: { row: any }) => {
      return useExamStore.subjectEnumFormat(subjects.value, String(row.subjectId));
    },
  },
  {
    title: '试卷标题',
    colKey: 'paperName',
    ellipsis: { theme: 'light' } as TooltipProps,
  },
  {
    title: '试卷类型',
    colKey: 'paperType',
    width: 150,
    cell: (h: any, { row }: { row: any }) => {
      return enumItemStore.enumFormat(paperEunmText.value, row.paperType);
    },
  },
  {
    title: '试卷总分',
    colKey: 'paperScore',
    width: 80,
  },
  {
    title: '系统判分',
    colKey: 'systemScore',
    width: 80,
  },
  {
    title: '最终得分',
    colKey: 'userScore',
    width: 80,
  },
  {
    title: '试卷题数',
    colKey: 'questionCount',
    width: 80,
  },
  {
    title: '正确题数',
    colKey: 'questionCorrect',
    width: 80,
  },
  {
    title: '操作时间',
    colKey: 'createTime',
    width: 200,
  },
  {
    title: '试卷状态',
    colKey: 'status',
    width: 150,
    cell: (h: any, { row }: { row: any }) => {
      return (
        <t-tag shape="round" theme={enumItemStore.enumFormat(statusTag.value, row.status)} variant="light-outline">
          {row.status === 2 ? <CheckCircleFilledIcon></CheckCircleFilledIcon> : <PendingFilledIcon></PendingFilledIcon>}
          {enumItemStore.enumFormat(statusEnum.value, row.status)}
        </t-tag>
      );
    },
  },
  {
    align: 'left',
    fixed: 'right',
    width: 160,
    colKey: 'op',
    title: '操作',
  },
];

const toDOPaper = (id: any) => {
  const url = router.resolve({ path: '/read', query: { id } });
  window.open(url.href, '_blank');
};

const pagination = ref({
  defaultPageSize: 20,
  total: 100,
  defaultCurrent: 1,
});

const rehandleChange = (changeParams: any) => {
  if (changeParams.pagination?.current) {
    pagination.value.defaultCurrent = changeParams.pagination.current;
    fetchData();
  }
};

const fetchData = async () => {
  dataLoading.value = true;
  try {
    const query = {
      ...queryParam.value,
      pageIndex: pagination.value.defaultCurrent,
      pageSize: pagination.value.defaultPageSize,
    };

    // 将空字符串转换为null
    Object.keys(query).forEach((key) => {
      if ((query as any)[key] === '') {
        (query as any)[key] = null;
      }
    });

    await examPaperAnswer.pageList(query).then((res) => {
      data.value = res.list;
      total.value = res.total;
      pagination.value = {
        ...pagination.value,
        total: res.total,
      };
    });
  } catch (error) {
    console.log(error);
  } finally {
    dataLoading.value = false;
  }
};

const searchData = () => {
  // 将空字符串转换为null
  Object.keys(queryParam.value).forEach((key) => {
    if ((queryParam.value as any)[key] === '') {
      (queryParam.value as any)[key] = null;
    }
  });

  pagination.value.defaultCurrent = 1;
  fetchData();
};

const resetData = () => {
  pagination.value.defaultCurrent = 1;
  fetchData();
};

onMounted(() => {
  useExamStore.initSubject(() => {
    subjectFilter.value = subjects.value;
  });
  fetchData();
});
</script>

<style lang="less" scoped>
.list-common-table {
  background-color: var(--td-bg-color-container);
  padding: var(--td-comp-paddingTB-xxl) var(--td-comp-paddingLR-xxl);
  border-radius: var(--td-radius-medium);

  .table-container {
    margin-top: var(--td-comp-margin-xxl);
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
</style>
