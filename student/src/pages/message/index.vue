<template>
  <div class="list-common-table">
    <t-form ref="form" :data="queryParam" :label-width="80" colon @reset="resetData" @submit="searchData">
      <t-row>
        <t-col :span="10">
          <t-row :gutter="[24, 24]">
            <t-col :span="4">
              <t-form-item label="发送者用户名" name="sendUserName">
                <t-input
                  v-model="queryParam.sendUserName"
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
          <t-button theme="primary" @click="handleManageProduct()">
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
      </t-table>

      <dialog-message-form
        v-model:visible="formDialogVisible"
        :data="formData"
        @refresh="fetchData()"
      ></dialog-message-form>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue';

import message from '@/api/message';
import { t } from '@/locales';

import DialogMessageForm, { FormData } from './components/DialogMessageForm.vue';

const queryParam = ref({
  sendUserName: undefined,
});

const INITIAL_DATA: FormData = {
  title: '',
  content: '',
  receiveUserIds: undefined,
};

const data = ref([]);
const total = ref(0);
const dataLoading = ref(false);
const formDialogVisible = ref(false);
const formData = ref({ ...INITIAL_DATA });

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
    title: '标题',
    colKey: 'title',
    width: 180,
  },
  {
    title: '内容',
    colKey: 'content',
  },
  {
    title: '发送人',
    colKey: 'sendUserName',
    width: 120,
  },
  {
    title: '接收人',
    colKey: 'receives',
    width: 120,
  },
  {
    title: '已读数量',
    colKey: 'readCount',
    width: 70,
  },
  {
    title: '接收数量',
    colKey: 'receiveUserCount',
    width: 120,
  },
  {
    title: '发送时间',
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

    await message.pageList(query).then((res) => {
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

const handleManageProduct = () => {
  formData.value = { ...INITIAL_DATA };
  formDialogVisible.value = true;
};

onMounted(() => {
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
