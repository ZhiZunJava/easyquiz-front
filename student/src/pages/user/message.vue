<template>
  <div>
    <div class="secondary-notification">
      <t-tabs v-model="tabValue">
        <t-tab-panel v-for="(tab, tabIndex) in TAB_LIST" :key="tabIndex" :value="tab.value" :label="tab.label">
          <t-list v-if="msgDataList.length > 0" class="secondary-msg-list" :split="true">
            <t-list-item v-for="(item, index) in msgDataList" :key="index">
              <p :class="['content', { unread: !item.readed }]">
                <t-tag v-if="!item.readed" theme="danger">未读通知</t-tag>
                <t-tag size="medium" theme="warning" variant="light">
                  {{ item.title }}
                </t-tag>
                {{ item.content }}
              </p>
              <template #action>
                <span class="msg-date">{{ item.createTime }}</span>

                <div class="msg-action">
                  <t-tooltip
                    class="set-read-icon"
                    :overlay-style="{ margin: '6px' }"
                    :content="item.readed ? t('pages.detailSecondary.setRead') : t('pages.detailSecondary.setUnread')"
                  >
                    <span v-if="!item.readed" class="msg-action-icon" @click="setReadStatus(item)">
                      <t-icon name="queue" size="16px" />
                    </span>
                  </t-tooltip>
                </div>
              </template>
            </t-list-item>
          </t-list>
          <div v-else class="secondary-msg-list__empty-list">
            <empty-icon></empty-icon>
            <p>{{ t('pages.detailSecondary.empty') }}</p>
          </div>
        </t-tab-panel>
      </t-tabs>
      <t-pagination
        v-model="current"
        v-model:page-size="pageSize"
        :total="msgDataList.length"
        @change="onChange"
        @page-size-change="onPageSizeChange"
        @current-change="onCurrentChange"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { MessagePlugin, PaginationProps } from 'tdesign-vue-next';
import { computed, onMounted, ref, watch } from 'vue';

import user from '@/api/user';
import EmptyIcon from '@/assets/assets-empty.svg?component';
import { t } from '@/locales';
import { useNotificationStore, useUserStore } from '@/store';
import type { NotificationItem } from '@/types/interface';

const TAB_LIST = [
  {
    label: '全部通知',
    value: 'allMsg',
  },
  {
    label: '未读通知',
    value: 'unreadMsg',
  },
  {
    label: '已读通知',
    value: 'readMsg',
  },
];

const tabValue = ref('allMsg');
const userStore = useUserStore();
const store = useNotificationStore();
const { allMsg, unreadMsg, readMsg } = storeToRefs(store);

const current = ref(1);
const pageSize = ref(5);
const onPageSizeChange: PaginationProps['onPageSizeChange'] = (size) => {
  console.log('page-size:', size);
  MessagePlugin.success(`pageSize变化为${size}`);
};
const onCurrentChange: PaginationProps['onCurrentChange'] = (index, pageInfo) => {
  MessagePlugin.success(`转到第${index}页`);
  console.log(pageInfo);
};
const onChange: PaginationProps['onChange'] = (pageInfo) => {
  console.log(pageInfo);
};

const msgDataList = computed(() => {
  if (tabValue.value === 'allMsg') return allMsg.value.list;
  if (tabValue.value === 'unreadMsg') return unreadMsg.value.list;
  if (tabValue.value === 'readMsg') return readMsg.value.list;
  return [];
});

const setReadStatus = (item: NotificationItem) => {
  if (item.id) {
    user.read(item.id).then((_res) => {
      const index = msgDataList.value.findIndex((i: { id: number }) => i.id === item.id);
      msgDataList.value.splice(index, 1);
      userStore.messageCountSub(1);
    });
    getDateArray();
  }
};
const getDateArray = async () => {
  let readed;
  if (tabValue.value === 'unreadMsg') readed = 0;
  if (tabValue.value === 'readMsg') readed = 1;
  await store.getMessage(tabValue.value as any, { pageIndex: current.value, pageSize: pageSize.value, readed });
};
watch(tabValue, (newv, oldv) => {
  if (newv !== oldv) {
    getDateArray();
  }
});

onMounted(async () => {
  await getDateArray();
});
</script>

<style lang="less" scoped>
.secondary-notification {
  background-color: var(--td-bg-color-container);
  border-radius: var(--td-radius-medium);
  padding: var(--td-comp-paddingTB-xxl) var(--td-comp-paddingLR-xxl);

  .t-tabs__content {
    padding-top: 0;
  }
}

.secondary-msg-list {
  height: 70vh;

  .t-list-item {
    cursor: pointer;
    padding: var(--td-comp-paddingTB-l) 0 var(--td-comp-paddingTB-l) 10px;
    transition: 0.2s linear;

    &:hover {
      background-color: var(--td-bg-color-container-hover);

      .msg-date {
        display: none;
      }

      .msg-action {
        display: flex;
        align-items: center;

        &-icon {
          display: flex;
          align-items: center;
        }
      }
    }

    :deep(.t-tag) {
      margin-right: var(--td-comp-margin-l);
    }

    .t-tag.t-size-s {
      margin-right: var(--td-comp-margin-s);
      margin-left: 0;
    }
  }

  .content {
    font: var(--td-font-body-medium);
    color: var(--td-text-color-placeholder);
    text-align: left;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .unread {
    color: var(--td-text-color-primary);
  }

  .msg-action {
    display: none;
    margin-right: var(--td-comp-margin-xxl);
    transition: 0.2s linear;

    .set-read-icon {
      margin-right: var(--td-comp-margin-l);
    }
  }

  &__empty-list {
    min-height: 443px;
    padding-top: 170px;
    text-align: center;
    color: var(--td-text-color-primary);
  }
}
</style>
