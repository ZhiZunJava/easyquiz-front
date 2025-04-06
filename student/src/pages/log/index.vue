<template>
  <div class="list-common-table">
    <t-form ref="form" :data="queryParam" :label-width="80" colon @reset="resetData" @submit="searchData">
      <t-row>
        <t-col :span="10">
          <t-row :gutter="[24, 24]">
            <t-col :span="4">
              <t-form-item label="用户ID" name="userId">
                <t-input
                  v-model="queryParam.userId"
                  class="form-item-content"
                  type="search"
                  placeholder="用户ID"
                  :style="{ minWidth: '134px' }"
                />
              </t-form-item>
            </t-col>
            <t-col :span="4">
              <t-form-item label="用户名" name="userName">
                <t-input
                  v-model="queryParam.userName"
                  class="form-item-content"
                  type="search"
                  placeholder="用户名"
                  :style="{ minWidth: '134px' }"
                />
              </t-form-item>
            </t-col>
          </t-row>
        </t-col>

        <t-col :span="2" class="operation-container">
          <t-button theme="primary" type="submit" :style="{ marginLeft: 'var(--td-comp-margin-s)' }">
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
      ></t-table>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

import user from '@/api/user';
import { t } from '@/locales';

const route = useRoute();

const queryParam = ref({
  userId: null as any,
  userName: null as any,
});
const data = ref([]);
const total = ref(0);
const dataLoading = ref(false);

const rowKey = 'id';
const verticalAlign = 'top' as const;
const hover = true;

const COLUMNS = [
  {
    title: 'ID',
    colKey: 'id',
    width: 100,
  },
  {
    title: '用户ID',
    colKey: 'userId',
    width: 120,
  },
  {
    title: '用户名',
    colKey: 'userName',
    width: 150,
  },
  {
    title: '姓名',
    colKey: 'realName',
    width: 150,
  },
  {
    title: '事件内容',
    colKey: 'content',
  },
  {
    title: '操作时间',
    colKey: 'createTime',
    width: 200,
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

    await user.getUserEventPageList(query).then((res) => {
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
  const { userId } = route.query;
  if (userId) {
    queryParam.value.userId = typeof userId === 'string' ? userId : undefined;
  }
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
