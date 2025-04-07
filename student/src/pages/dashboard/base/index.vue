<template>
  <div class="dashboard-panel-detail">
    <t-card title="固定试卷" class="dashboard-detail-card" :bordered="false">
      <template #actions>
        <t-button @click="morePaper(1)">查看更多</t-button>
      </template>
      <t-row :gutter="[16, 16]">
        <t-col v-for="(item, index) in fixedPaper" :key="index" :xs="6" :xl="3">
          <t-card class="dashboard-list-card" :description="'试卷时长：' + item.suggestTime + '分钟'">
            <div class="dashboard-list-card__number">{{ item.name }}</div>
            <span>试卷题数：{{ item.questionCount }}</span>
            <div class="dashboard-list-card__text" style="justify-content: flex-end">
              <t-button @click="toDoPaper(item.id)"
                >开始答题 <template #suffix> <t-icon name="chevron-right" /> </template
              ></t-button>
            </div>
          </t-card>
        </t-col>
      </t-row>
    </t-card>
    <t-card :class="['dashboard-detail-card', 'row-margin']" title="时段试卷" :bordered="false">
      <template #actions>
        <t-button @click="morePaper(2)">查看更多</t-button>
      </template>
      <t-row :gutter="[16, 16]">
        <t-col v-for="(item, index) in timeLimitPaper" :key="index" :xs="6" :xl="3">
          <t-card class="dashboard-list-card" :description="'试卷时长：' + item.suggestTime + '分钟'">
            <div class="dashboard-list-card__number">{{ item.name }}</div>
            <span>试卷题数：{{ item.questionCount }}</span>
            <span>试卷时间：{{ item.startTime }} - {{ item.endTime }}</span>
            <div class="dashboard-list-card__text" style="justify-content: flex-end; margin-top: 10px">
              <t-button @click="toDoPaper(item.id)"
                >开始答题 <template #suffix> <t-icon name="chevron-right" /> </template
              ></t-button>
            </div>
          </t-card>
        </t-col>
      </t-row>
    </t-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import { request } from '@/utils/request';

const fixedPaper = ref<any>([]);
const timeLimitPaper = ref<any>([]);
const router = useRouter();
const getDashboardData = async () => {
  try {
    const res = await request.post({ url: '/student/dashboard/index' });
    fixedPaper.value = res.fixedPaper;
    timeLimitPaper.value = res.timeLimitPaper;
  } catch (err) {
    console.log(err);
  }
};

const morePaper = (id: number) => {
  router.push({ path: '/paper/index', query: { id } });
};

const toDoPaper = (id: number) => {
  const routeData = router.resolve({ path: '/do', query: { id } });
  window.open(routeData.href, '_blank');
};

onMounted(() => {
  getDashboardData();
});
</script>

<style lang="less" scoped>
.row-margin {
  margin-top: 16px;
}

.product-card {
  padding: var(--td-comp-paddingTB-xl) var(--td-comp-paddingTB-xl);

  :deep(.t-card__header) {
    padding: 0;
  }

  :deep(.t-card__body) {
    padding: 0;
    margin-top: var(--td-comp-margin-xxl);
    margin-bottom: var(--td-comp-margin-xxl);
  }

  :deep(.t-card__footer) {
    padding: 0;
  }
}
// 统一增加8px;
.dashboard-detail-card {
  padding: var(--td-comp-paddingTB-xxl) var(--td-comp-paddingLR-xxl);

  :deep(.t-card__header) {
    padding: 0;
  }

  :deep(.t-card__title) {
    font: var(--td-font-title-large);
    font-weight: 400;
  }

  :deep(.t-card__body) {
    padding: 0;
    margin-top: var(--td-comp-margin-xxl);
  }

  :deep(.t-card__actions) {
    display: flex;
    align-items: center;
  }
}

.dashboard-list-card {
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: var(--td-comp-paddingTB-xl) var(--td-comp-paddingLR-xl);

  :deep(.t-card__description) {
    margin: 0;
  }

  :deep(.t-card__body) {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-top: var(--td-comp-margin-s);
  }

  &.dark {
    &:hover {
      background: var(--td-gray-color-14);
      cursor: pointer;
    }
  }

  &.light {
    &:hover {
      background: var(--td-gray-color-14);
      cursor: pointer;
    }
  }

  &__number {
    font-size: var(--td-font-size-headline-medium);
    line-height: var(--td-font-size-headline-medium);
    color: var(--td-text-color-primary);
    margin-bottom: var(--td-comp-margin-xxl);
  }

  &__text {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    font: var(--td-font-body-medium);
    color: var(--td-text-color-placeholder);
    text-align: left;

    .t-icon {
      font-size: var(--td-comp-size-xxxs);
    }

    &-left {
      display: flex;

      .icon {
        margin: 0 var(--td-comp-margin-s);
      }
    }
  }
}
</style>
