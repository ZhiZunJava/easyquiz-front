<template>
  <div>
    <div class="row-container">
      <t-row :gutter="[16, 16]">
        <t-col v-for="(item, index) in statisticsCards" :key="index" :xs="6" :xl="3">
          <t-card
            :title="item.title"
            :bordered="false"
            :class="{ 'dashboard-item': true, 'dashboard-item--main-color': false }"
          >
            <div class="dashboard-item-top">
              <t-statistic
                ref="refUp"
                :value="item.value"
                :animation="{
                  valueFrom: 0,
                  duration: 3000,
                }"
                :animation-start="start"
                :style="{ fontSize: `${resizeTime * 28}px` }"
                :suffix="item.suffix"
              />
            </div>
            <div class="dashboard-item-left">
              <span :style="{ marginTop: `-24px` }">
                <component :is="item.icon" />
              </span>
            </div>
          </t-card>
        </t-col>
      </t-row>
    </div>
    <div class="row-container detail-deploy">
      <t-row :gutter="16">
        <t-col :lg="6" :xs="12">
          <t-card title="学科题目分布" class="dashboard-chart-card" :bordered="false">
            <t-loading :loading="loadingState['questionCountBySubjectContainer']" size="medium">
              <div
                id="questionCountBySubjectContainer"
                class="dashboard-chart-container"
                style="width: 100%; height: 265px"
              ></div>
            </t-loading>
          </t-card>
        </t-col>
        <t-col :lg="6" :xs="12">
          <t-card title="难度题目分布" class="dashboard-chart-card" :bordered="false">
            <t-loading :loading="loadingState['difficultyCountBySubjectContainer']" size="medium">
              <div
                id="difficultyCountBySubjectContainer"
                class="dashboard-chart-container"
                style="width: 100%; height: 265px"
              ></div>
            </t-loading>
          </t-card>
        </t-col>
      </t-row>
    </div>
    <div class="row-container">
      <t-row :gutter="24">
        <t-col :xs="12">
          <t-card title="年级题目数量" class="dashboard-chart-card" :bordered="false">
            <t-loading :loading="loadingState['levelQuestionRankContainer']" size="medium">
              <div
                id="levelQuestionRankContainer"
                class="dashboard-chart-container"
                :style="{ width: '100%', height: `${resizeTime * 326}px` }"
              ></div>
            </t-loading>
          </t-card>
        </t-col>
      </t-row>
    </div>
    <div class="row-container">
      <t-row :gutter="16">
        <t-col :xs="6">
          <t-card title="年级题目正确率" class="dashboard-chart-card" :bordered="false">
            <t-loading :loading="loadingState['correctRateByGradeLevelContainer']" size="medium">
              <div
                id="correctRateByGradeLevelContainer"
                class="dashboard-chart-container"
                :style="{ width: '100%', height: `${resizeTime * 350}px` }"
              ></div>
            </t-loading>
          </t-card>
        </t-col>
        <t-col :xs="6">
          <t-card title="难度题目正确率" class="dashboard-chart-card" :bordered="false">
            <t-loading :loading="loadingState['correctRateByDifficultyContainer']" size="medium">
              <div
                id="correctRateByDifficultyContainer"
                class="dashboard-chart-container"
                :style="{ width: '100%', height: `${resizeTime * 350}px` }"
              ></div>
            </t-loading>
          </t-card>
        </t-col>
      </t-row>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'DashboardBase',
};
</script>

<script setup lang="ts">
import { BarChart, LineChart, PieChart } from 'echarts/charts';
import { GridComponent, LegendComponent, TitleComponent, ToolboxComponent, TooltipComponent } from 'echarts/components';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { CourseIcon, TaskIcon } from 'tdesign-icons-vue-next';
import { computed, onMounted, onUnmounted, ref } from 'vue';

import { TChartColor } from '@/config/color';
import { useSettingStore } from '@/store';
import { useEnumItem } from '@/store/modules/enumitem';
import { getChartListColor } from '@/utils/color';
import { request } from '@/utils/request';

// 注册echarts组件
echarts.use([
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  PieChart,
  BarChart,
  LineChart,
  CanvasRenderer,
]);

// 基础数据
const start = ref(false);
const resizeTime = ref(1);
const examPaperCount = ref(0);
const questionCount = ref(0);
const doQuestionCount = ref(0);
const doExamPaperCount = ref(0);
const questionCountByType = ref(null);
const questionCountByDifficulty = ref(null);
const questionCountByGradeLevel = ref(null);
const correctRateByGradeLevel = ref(null);
const correctRateByDifficulty = ref(null);
const hotQuestions = ref([]);

// 加载状态
const loadingState = ref({
  questionCountBySubjectContainer: true,
  difficultyCountBySubjectContainer: true,
  levelQuestionRankContainer: true,
  correctRateByGradeLevelContainer: true,
  correctRateByDifficultyContainer: true,
});

// 状态管理
const store = useSettingStore();
const enumItem = useEnumItem();

// 计算属性
const chartColors = computed(() => store.chartColors);
const difficultyText = computed(() => enumItem.user.difficulty);
const typeEnumText = computed(() => enumItem.exam.question.typeEnum);
const levelEnumText = computed(() => enumItem.user.levelEnum);

// 统计卡片数据
const statisticsCards = computed(() => [
  {
    title: '试卷总数',
    value: examPaperCount.value,
    suffix: '张',
    icon: TaskIcon,
  },
  {
    title: '题目总数',
    value: questionCount.value,
    suffix: '个',
    icon: CourseIcon,
  },
  {
    title: '答卷总数',
    value: doExamPaperCount.value,
    suffix: '张',
    icon: TaskIcon,
  },
  {
    title: '答题总数',
    value: doQuestionCount.value,
    suffix: '个',
    icon: CourseIcon,
  },
]);

// 图表实例管理
const chartInstances = ref<{ [key: string]: echarts.ECharts }>({});

// 创建图表实例函数
function createChart(elementId: string): echarts.ECharts | null {
  const container = document.getElementById(elementId);
  if (!container) return null;

  const chart = echarts.init(container);
  chartInstances.value[elementId] = chart;
  return chart;
}

// 获取或创建图表实例
function getChart(elementId: string): echarts.ECharts | null {
  if (chartInstances.value[elementId]) {
    return chartInstances.value[elementId];
  }
  return createChart(elementId);
}

// 柱状图配置生成函数
function getColBarChartDataSet({ placeholderColor, borderColor }: TChartColor) {
  const categories: string[] = [];
  const values: any[] = [];

  // 如果有数据，就进行处理
  if (questionCountByType.value) {
    // 遍历问题类型枚举，找到对应的数据
    typeEnumText.value.forEach((type) => {
      const { key } = type;
      const count = questionCountByType.value ? questionCountByType.value[key] || 0 : 0;
      categories.push(type.value);
      values.push(count);
    });
  }

  return {
    color: getChartListColor(),
    tooltip: {
      trigger: 'item',
    },
    grid: {
      top: '10px',
      left: '0',
      right: '0',
      bottom: '36px',
      containLabel: true,
    },
    xAxis: [
      {
        type: 'category',
        data: categories,
        axisTick: {
          alignWithLabel: true,
        },
        axisLabel: {
          color: placeholderColor,
        },
        axisLine: {
          lineStyle: {
            color: borderColor,
            width: 1,
          },
        },
      },
    ],
    yAxis: [
      {
        type: 'value',
        axisLabel: {
          color: placeholderColor,
        },
        splitLine: {
          lineStyle: {
            color: borderColor,
          },
        },
      },
    ],
    series: [
      {
        name: '题目数量',
        type: 'bar',
        barWidth: '30%',
        data: values,
        itemStyle: {
          color: (params: { value: number }) => {
            if (params.value >= 5) {
              return getChartListColor()[1];
            }
            return getChartListColor()[0];
          },
        },
      },
    ],
  };
}

// 难度柱状图配置生成函数
function getDifficultyChartDataSet({ placeholderColor, borderColor }: TChartColor) {
  const categories: string[] = [];
  const values: any[] = [];

  // 如果有数据，就进行处理
  if (questionCountByDifficulty.value) {
    // 遍历difficulty枚举，找到对应的数据
    difficultyText.value.forEach((diff) => {
      const count = questionCountByDifficulty.value ? questionCountByDifficulty.value[diff.key] || 0 : 0;
      categories.push(diff.value);
      values.push(count);
    });
  }

  return {
    color: getChartListColor(),
    tooltip: {
      trigger: 'item',
    },
    grid: {
      top: '10px',
      left: '0',
      right: '0',
      bottom: '36px',
      containLabel: true,
    },
    xAxis: [
      {
        type: 'category',
        data: categories,
        axisTick: {
          alignWithLabel: true,
        },
        axisLabel: {
          color: placeholderColor,
        },
        axisLine: {
          lineStyle: {
            color: borderColor,
            width: 1,
          },
        },
      },
    ],
    yAxis: [
      {
        type: 'value',
        axisLabel: {
          color: placeholderColor,
        },
        splitLine: {
          lineStyle: {
            color: borderColor,
          },
        },
      },
    ],
    series: [
      {
        name: '题目数量',
        type: 'bar',
        barWidth: '30%',
        data: values,
        itemStyle: {
          color: (params: { value: number }) => {
            if (params.value >= 5) {
              return getChartListColor()[1];
            }
            return getChartListColor()[0];
          },
        },
      },
    ],
  };
}

// 年级线图配置生成函数
function getLevelChartDataSet({ placeholderColor, borderColor }: TChartColor) {
  const categories: string[] = [];
  const values: any[] = [];

  // 如果有数据，就进行处理
  if (questionCountByGradeLevel.value) {
    // 遍历difficulty枚举，找到对应的数据
    levelEnumText.value.forEach((diff) => {
      const count = questionCountByGradeLevel.value ? questionCountByGradeLevel.value[diff.key] || 0 : 0;
      categories.push(diff.value);
      values.push(count);
    });
  }

  return {
    color: getChartListColor(),
    tooltip: {
      trigger: 'item',
    },
    grid: {
      top: '5px',
      left: '25px',
      right: '5px',
      bottom: '60px',
      containLabel: true,
    },
    xAxis: [
      {
        type: 'category',
        data: categories,
        axisTick: {
          alignWithLabel: true,
        },
        axisLabel: {
          color: placeholderColor,
        },
        axisLine: {
          lineStyle: {
            color: borderColor,
            width: 1,
          },
        },
      },
    ],
    yAxis: [
      {
        type: 'value',
        axisLabel: {
          color: placeholderColor,
        },
        splitLine: {
          lineStyle: {
            color: borderColor,
          },
        },
      },
    ],
    series: [
      {
        name: '题目数量',
        type: 'line',
        data: values,
        itemStyle: {
          color: (params: { value: number }) => {
            if (params.value >= 5) {
              return getChartListColor()[1];
            }
            return getChartListColor()[0];
          },
        },
        showSymbol: true,
        symbol: 'circle',
        symbolSize: 8,
        lineStyle: {
          width: 2,
        },
      },
    ],
  };
}

// 饼图配置生成函数
function getPieChartDataSet(pieData: any, { placeholderColor, textColor, containerColor }: TChartColor) {
  return {
    color: getChartListColor(),
    tooltip: {
      show: true,
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)',
    },
    grid: {
      top: '0',
      left: '25px',
      right: '5px',
      bottom: '30px',
      containLabel: true,
    },
    legend: {
      selectedMode: true,
      itemWidth: 14,
      itemHeight: 14,
      textStyle: {
        fontSize: 12,
        color: placeholderColor,
      },
      left: 'center',
      bottom: '0',
      orient: 'horizontal',
    },
    series: [
      {
        name: '题目',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['50%', '45%'],
        avoidLabelOverlap: true,
        itemStyle: {
          borderColor: containerColor,
          borderWidth: 1,
          borderRadius: 0,
        },
        label: {
          show: true,
          position: 'outside',
          formatter: '{b}: {d}%',
          color: textColor,
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
          label: {
            show: true,
            fontWeight: 'bold',
          },
        },
        labelLine: {
          show: true,
          length: 10,
          length2: 10,
          smooth: true,
        },
        data: pieData,
      },
    ],
  };
}

// 生成饼图数据函数
function generatePieData(dataSource: any, enumSource: any[]) {
  const pieData: any = [];
  if (dataSource) {
    enumSource.forEach((item) => {
      const value = dataSource[item.key] || 0;
      pieData.push({
        name: item.value,
        value,
      });
    });
  }
  return pieData;
}

const chartQueue = [
  { id: 'questionCountBySubjectContainer', priority: 1, renderer: renderQuestionChart },
  { id: 'difficultyCountBySubjectContainer', priority: 2, renderer: renderDifficultyChart },
  { id: 'levelQuestionRankContainer', priority: 3, renderer: renderLevelChart },
  { id: 'correctRateByGradeLevelContainer', priority: 4, renderer: renderGradeLevelPieChart },
  { id: 'correctRateByDifficultyContainer', priority: 5, renderer: renderDifficultyPieChart },
];

function processChartQueue() {
  const sortedQueue = [...chartQueue].sort((a, b) => a.priority - b.priority);
  let index = 0;

  function renderNext() {
    if (index >= sortedQueue.length) return;

    const chart = sortedQueue[index++];
    chart.renderer();

    // 使用requestAnimationFrame等待下一帧渲染
    requestAnimationFrame(renderNext);
  }

  renderNext();
}

// 初始化所有图表
function initAllCharts() {
  processChartQueue();
}

// 获取仪表盘数据
const getDashboardData = async () => {
  try {
    const res = await request.post({ url: '/admin/dashboard/index' });
    // 更新数据
    examPaperCount.value = res.examPaperCount;
    questionCount.value = res.questionCount;
    doExamPaperCount.value = res.doExamPaperCount;
    doQuestionCount.value = res.doQuestionCount;
    questionCountByType.value = res.questionCountByType;
    questionCountByDifficulty.value = res.questionCountByDifficulty;
    questionCountByGradeLevel.value = res.questionCountByGradeLevel;
    correctRateByGradeLevel.value = res.correctRateByGradeLevel;
    correctRateByDifficulty.value = res.correctRateByDifficulty;
    hotQuestions.value = res.hotQuestions;
    start.value = true;

    // 初始化图表
    initAllCharts();
  } catch (error) {
    console.error('获取仪表盘数据失败:', error);
  }
};

// 窗口大小改变时重绘图表
function handleResize() {
  Object.values(chartInstances.value).forEach((chart) => {
    chart?.resize();
  });
}

// 生命周期钩子
onMounted(() => {
  getDashboardData();
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  // 销毁图表实例
  Object.values(chartInstances.value).forEach((chart) => {
    chart?.dispose();
  });
  window.removeEventListener('resize', handleResize);
});

// 渲染函数定义
function renderQuestionChart() {
  loadingState.value.questionCountBySubjectContainer = true;
  const chart = getChart('questionCountBySubjectContainer');
  if (chart) {
    chart.setOption(getColBarChartDataSet(chartColors.value));
    loadingState.value.questionCountBySubjectContainer = false;
  }
}

function renderDifficultyChart() {
  loadingState.value.difficultyCountBySubjectContainer = true;
  const chart = getChart('difficultyCountBySubjectContainer');
  if (chart) {
    chart.setOption(getDifficultyChartDataSet(chartColors.value));
    loadingState.value.difficultyCountBySubjectContainer = false;
  }
}

function renderLevelChart() {
  loadingState.value.levelQuestionRankContainer = true;
  const chart = getChart('levelQuestionRankContainer');
  if (chart) {
    chart.setOption(getLevelChartDataSet(chartColors.value));
    loadingState.value.levelQuestionRankContainer = false;
  }
}

function renderGradeLevelPieChart() {
  loadingState.value.correctRateByGradeLevelContainer = true;
  const chart = getChart('correctRateByGradeLevelContainer');
  if (chart) {
    const pieData = generatePieData(correctRateByGradeLevel.value, levelEnumText.value);
    chart.setOption(getPieChartDataSet(pieData, chartColors.value));
    loadingState.value.correctRateByGradeLevelContainer = false;
  }
}

function renderDifficultyPieChart() {
  loadingState.value.correctRateByDifficultyContainer = true;
  const chart = getChart('correctRateByDifficultyContainer');
  if (chart) {
    const pieData = generatePieData(correctRateByDifficulty.value, difficultyText.value);
    chart.setOption(getPieChartDataSet(pieData, chartColors.value));
    loadingState.value.correctRateByDifficultyContainer = false;
  }
}
</script>

<style lang="less" scoped>
.row-container:not(:last-child) {
  margin-bottom: 16px;
}

.dashboard-item {
  padding: var(--td-comp-paddingTB-xl) var(--td-comp-paddingLR-xxl);

  :deep(.t-card__header) {
    padding: 0;
  }

  :deep(.t-card__footer) {
    padding: 0;
  }

  :deep(.t-card__title) {
    font: var(--td-font-body-medium);
    color: var(--td-text-color-secondary);
  }

  :deep(.t-card__body) {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex: 1;
    position: relative;
    padding: 0;
    margin-top: var(--td-comp-margin-s);
  }

  &:hover {
    cursor: pointer;
  }

  &-top {
    display: flex;
    flex-direction: row;
    align-items: flex-start;

    > span {
      display: inline-block;
      color: var(--td-text-color-primary);
      font-size: var(--td-font-size-headline-medium);
      line-height: var(--td-line-height-headline-medium);
    }
  }

  &-bottom {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    > .t-icon {
      cursor: pointer;
      font-size: var(--td-comp-size-xxxs);
    }
  }

  &-block {
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--td-text-color-placeholder);
  }

  &-trend {
    margin-left: var(--td-comp-margin-s);
  }

  &-left {
    position: absolute;
    top: 0;
    right: 0;

    > span {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: var(--td-comp-size-xxxl);
      height: var(--td-comp-size-xxxl);
      background: var(--td-brand-color-light);
      border-radius: 50%;

      .t-icon {
        font-size: 24px;
        color: var(--td-brand-color);
      }
    }
  }

  // 针对第一个卡片需要反色处理
  &--main-color {
    background: var(--td-brand-color);
    color: var(--td-text-color-primary);

    :deep(.t-card__title),
    .dashboard-item-top span,
    .dashboard-item-bottom {
      color: var(--td-text-color-anti);
    }

    .dashboard-item-block {
      color: var(--td-text-color-anti);
      opacity: 0.6;
    }

    .dashboard-item-bottom {
      color: var(--td-text-color-anti);
    }
  }
}

.detail-deploy {
  :deep(.t-card) {
    padding: var(--td-comp-paddingTB-xxl) var(--td-comp-paddingLR-xxl);
  }

  :deep(.t-card__header) {
    padding: 0;
  }

  :deep(.t-card__body) {
    padding: 0;
    margin-top: var(--td-comp-margin-xxl);
  }

  :deep(.t-text-ellipsis) {
    width: auto;
  }
}
</style>
