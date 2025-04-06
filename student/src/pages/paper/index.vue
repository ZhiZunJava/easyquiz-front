<template>
  <div class="list-common-table">
    <t-form ref="form" :data="queryParam" :label-width="80" colon @reset="resetData" @submit="searchData">
      <t-row>
        <t-col :span="10">
          <t-row :gutter="[24, 24]">
            <t-col :span="4">
              <t-form-item label="题目年级" name="level">
                <t-select
                  v-model="queryParam.level"
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
                    :label="item.name + ' ( ' + item.levelName + ' )'"
                    :value="item.id"
                  ></t-option>
                </t-select>
              </t-form-item>
            </t-col>
            <t-col :span="4">
              <t-form-item label="试卷类型" name="paperType">
                <t-select
                  v-model="queryParam.paperType"
                  class="form-item-content"
                  placeholder="请选择题目类型"
                  clearable
                >
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
        </t-col>

        <t-col :span="2" class="operation-container">
          <t-button theme="primary" @click="router.push('/paper/edit')">
            {{ t('components.commonTable.add') }}
          </t-button>
          <t-button theme="primary" type="submit">
            {{ t('components.commonTable.query') }}
          </t-button>
          <t-button type="reset" variant="base" theme="default"> {{ t('components.commonTable.reset') }} </t-button>
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
            <t-link theme="primary"> 预览 </t-link>

            <t-link theme="primary" @click="editQuestion(slotProps.row)"> 编辑 </t-link>

            <t-link theme="danger" @click="handleClickDelete(slotProps.row.id)"> 删除</t-link>
          </t-space>
        </template>
      </t-table>
      <t-dialog
        v-model:visible="confirmVisible"
        header="确认删除当前所选试卷？"
        :body="confirmBody"
        :on-cancel="onCancel"
        @confirm="onConfirmDelete"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { MessagePlugin, TooltipProps } from 'tdesign-vue-next';
import { computed, onMounted, ref } from 'vue';

import examPaper from '@/api/examPaper';
import { t } from '@/locales';
import router from '@/router';
import { useExam } from '@/store';
import { useEnumItem } from '@/store/modules/enumitem';

const useExamStore = useExam();
const enumItemStore = useEnumItem();
const levelEnumText = computed(() => enumItemStore.user.levelEnum);
const paperEunmText = computed(() => enumItemStore.exam.examPaper.paperTypeEnum);

const queryParam = ref({
  paperType: undefined,
  subjectId: undefined,
  level: undefined,
});

const data = ref([]);
const total = ref(0);
const deleteIdx = ref(-1);
const dataLoading = ref(false);
const confirmVisible = ref(false);
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
      return useExamStore.subjectEnumFormat(subjects.value, row.subjectId);
    },
  },
  {
    title: '试卷标题',
    colKey: 'name',
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
    title: '试卷分数',
    colKey: 'score',
    width: 80,
  },
  {
    title: '试卷题数',
    colKey: 'questionCount',
    width: 80,
  },
  {
    title: '操作时间',
    colKey: 'createTime',
    width: 200,
  },
  {
    align: 'left',
    fixed: 'right',
    width: 160,
    colKey: 'op',
    title: '操作',
  },
];

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

    await examPaper.pageList(query).then((res) => {
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

const handleClickDelete = (id: number) => {
  deleteIdx.value = id;
  confirmVisible.value = true;
};

const resetIdx = () => {
  deleteIdx.value = -1;
};

const confirmBody = computed(() => {
  return `删除后，该试卷的所有信息将被清空，且无法恢复`;
});

const onCancel = () => {
  resetIdx();
};

const onConfirmDelete = async () => {
  await examPaper
    .deletePaper(deleteIdx.value)
    .then(() => {
      confirmVisible.value = false;
      MessagePlugin.success('删除成功');
      resetIdx();
      fetchData();
    })
    .catch((error) => {
      MessagePlugin.error(error);
    });
};

const levelChange = () => {
  queryParam.value.subjectId = undefined;
  subjectFilter.value = subjects.value.filter((item: any) => item.level === queryParam.value.level);
};

const editQuestion = (row: any) => {
  router.push({ path: '/paper/edit', query: { id: row.id } });
};

onMounted(() => {
  useExamStore.initSubject();
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
