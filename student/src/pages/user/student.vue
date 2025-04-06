<template>
  <div class="list-common-table">
    <t-form ref="form" :data="queryParam" :label-width="80" colon @reset="resetData" @submit="searchData">
      <t-row>
        <t-col :span="10">
          <t-row :gutter="[24, 24]">
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
            <t-col :span="4">
              <t-form-item label="用户年级" name="userLevel">
                <t-select v-model="queryParam.userLevel" class="form-item-content" placeholder="年级" clearable>
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
        <template #op="slotProps">
          <t-space>
            <t-link theme="primary" @click="changeStatus(slotProps.row)">
              {{ enumItemStore.enumFormat(statusBtnEnumText, slotProps.row.status) }}
            </t-link>
            <t-link theme="primary" @click="handleManageProduct(slotProps.row.id)"> 编辑 </t-link>
            <router-link :to="{ path: '/log/index', query: { userId: slotProps.row.id } }"
              ><t-link theme="primary"> 日志 </t-link></router-link
            >
            <t-link theme="danger" @click="handleClickDelete(slotProps.row.id)"> 删除</t-link>
          </t-space>
        </template>
      </t-table>
      <t-dialog
        v-model:visible="confirmVisible"
        header="确认删除当前所选用户？"
        :body="confirmBody"
        :on-cancel="onCancel"
        @confirm="onConfirmDelete"
      />
      <dialog-student-form
        v-model:visible="formDialogVisible"
        :data="formData"
        @refresh="fetchData()"
      ></dialog-student-form>
    </div>
  </div>
</template>
<script setup lang="tsx">
import { CheckCircleFilledIcon, CloseCircleFilledIcon } from 'tdesign-icons-vue-next';
import { MessagePlugin, TooltipProps } from 'tdesign-vue-next';
import { computed, onMounted, ref } from 'vue';

import user from '@/api/user';
import { t } from '@/locales';
import { useEnumItem } from '@/store/modules/enumitem';

import type { FormData } from './components/DialogStudentForm.vue';
import DialogStudentForm from './components/DialogStudentForm.vue';

const INITIAL_DATA: FormData = {
  id: null,
  userName: '',
  password: '',
  realName: '',
  age: 18,
  sex: 1,
  userLevel: undefined,
  status: 1,
  role: 1,
};

const enumItemStore = useEnumItem();
const levelEnumText = computed(() => enumItemStore.user.levelEnum);
const statusBtnEnumText = computed(() => enumItemStore.user.statusBtn);
const queryParam = ref({
  role: 1,
  userLevel: null as any,
  userName: null as any,
});
const data = ref([]);
const total = ref(0);
const deleteIdx = ref(-1);
const dataLoading = ref(false);
const confirmVisible = ref(false);
const formDialogVisible = ref(false);
const formData = ref({ ...INITIAL_DATA });

const rowKey = 'id';
const verticalAlign = 'top' as const;
const hover = true;

const statusNameListMap = {
  1: {
    label: '启用',
    theme: 'success',
    icon: <CheckCircleFilledIcon />,
  },
  2: {
    label: '禁用',
    theme: 'danger',
    icon: <CloseCircleFilledIcon />,
  },
};

const COLUMNS: any = [
  {
    title: 'ID',
    colKey: 'id',
    width: 50,
  },
  {
    title: '用户UUID',
    colKey: 'userUuid',
    width: 150,
    ellipsis: { theme: 'light', showArrow: false } as TooltipProps,
  },
  {
    title: '用户名',
    colKey: 'userName',
    width: 150,
  },
  {
    title: '真实姓名',
    colKey: 'realName',
    width: 150,
  },
  {
    title: '年级',
    colKey: 'userLevel',
    width: 150,
    cell: (h: any, { row }: { row: any }) => {
      return enumItemStore.enumFormat(levelEnumText.value, row.userLevel);
    },
  },
  {
    colKey: 'status',
    title: '状态',
    width: 120,
    cell: (h: any, { row }: { row: any }) => {
      const status = statusNameListMap[row.status as keyof typeof statusNameListMap];
      return (
        <t-tag shape="round" theme={status?.theme} variant="light-outline">
          {status?.icon}
          {status?.label}
        </t-tag>
      );
    },
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

    await user.getUserPageList(query).then((res) => {
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

const changeStatus = async (row: { id: string | number; status: number }) => {
  user
    .changeStatus(row.id)
    .then((res) => {
      row.status = res;
      MessagePlugin.success('状态修改成功');
    })
    .catch((err) => {
      MessagePlugin.error(err);
    });
};

const handleClickDelete = (id: number) => {
  deleteIdx.value = id;
  confirmVisible.value = true;
};

const resetIdx = () => {
  deleteIdx.value = -1;
};

const confirmBody = computed(() => {
  return `删除后，该用户的所有信息将被清空，且无法恢复`;
});

const onCancel = () => {
  resetIdx();
};

const onConfirmDelete = async () => {
  await user
    .deleteUser(deleteIdx.value)
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

const handleManageProduct = (id?: number) => {
  if (id) {
    user.selectUser(id).then((res) => {
      formData.value = res;
    });
  } else {
    formData.value = { ...INITIAL_DATA };
  }
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
