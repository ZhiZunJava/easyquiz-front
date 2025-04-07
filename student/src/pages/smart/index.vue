<template>
  <div>
    <t-row :gutter="[12, 12]">
      <t-col :span="3">
        <t-card title="智能训练试卷生成配置" :bordered="false" header-bordered>
          <t-form ref="form" :data="queryParam" :label-width="80" colon @submit="buildPapers">
            <t-row>
              <t-col :span="10">
                <t-row :gutter="[24, 24]">
                  <t-col :span="12">
                    <t-form-item label="题目学科" name="subjectId">
                      <t-select
                        v-model="buildPaper.subjectId"
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
                  <t-col :span="12">
                    <t-form-item label="单选题数量" name="singleChoiceCount">
                      <t-slider v-model="buildPaper.singleChoiceCount" :min="0" :max="50"></t-slider>
                    </t-form-item>
                  </t-col>
                  <t-col :span="12">
                    <t-form-item label="多选题数量" name="multipleChoiceCount">
                      <t-slider v-model="buildPaper.multipleChoiceCount" :min="0" :max="50"></t-slider>
                    </t-form-item>
                  </t-col>
                  <t-col :span="12">
                    <t-form-item label="判断题数量" name="judgementCount">
                      <t-slider v-model="buildPaper.judgementCount" :min="0" :max="50"></t-slider>
                    </t-form-item>
                  </t-col>
                  <t-col :span="12">
                    <t-form-item label="判断题数量" name="difficulty">
                      <t-rate
                        v-model="buildPaper.difficulty"
                        show-text
                        :texts="['入门', '简单', '中等', '困难', '专家']"
                      ></t-rate>
                    </t-form-item>
                  </t-col>
                </t-row>
              </t-col>

              <t-col :span="12" class="operation-container">
                <t-button theme="primary" type="submit"> 生成智能训练试卷 </t-button>
              </t-col>
            </t-row>
          </t-form>
        </t-card>
      </t-col>
      <t-col :span="9">
        <t-card title="智能训练试卷列表" :bordered="false" header-bordered>
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
                <t-link theme="primary" @click="toDOPaper(slotProps.row.id)"> 开始答题 </t-link>
              </t-space>
            </template>
          </t-table>
        </t-card>
      </t-col>
    </t-row>
  </div>
</template>
<script setup lang="ts">
import { MessagePlugin, TooltipProps } from 'tdesign-vue-next';
import { computed, onMounted, ref } from 'vue';

import examPaper from '@/api/examPaper';
import router from '@/router';
import { useExam } from '@/store';
import { useEnumItem } from '@/store/modules/enumitem';

const useExamStore = useExam();
const enumItemStore = useEnumItem();
const paperEunmText = computed(() => enumItemStore.exam.examPaper.paperTypeEnum);
const buildPaper = ref({
  subjectId: undefined,
  singleChoiceCount: 5,
  multipleChoiceCount: 5,
  judgementCount: 5,
  difficulty: 3,
});
const queryParam = ref({
  paperType: 3,
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
    colKey: 'scoreStr',
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

const toDOPaper = (id: any) => {
  const url = router.resolve({ path: '/do', query: { id } });
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

const buildPapers = () => {
  examPaper
    .generate(buildPaper.value)
    .then((_res) => {
      searchData();
    })
    .catch((err) => {
      MessagePlugin.warning(err.message);
    });
};

onMounted(() => {
  useExamStore.initSubject(() => {
    subjectFilter.value = subjects.value;
  });
  fetchData();
});
</script>

<style lang="less" scoped>
.form-item-content {
  width: 100%;
}

.operation-container {
  display: flex;
  margin-top: 20px;
  justify-content: center;
  align-items: center;

  .expand {
    .t-button__text {
      display: flex;
      align-items: center;
    }
  }
}
</style>
