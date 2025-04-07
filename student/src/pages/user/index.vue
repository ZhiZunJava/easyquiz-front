<template>
  <t-row :gutter="[24, 24]">
    <t-col :flex="1">
      <t-card class="user-intro" :bordered="false">
        <t-avatar size="80px">轻松考</t-avatar>
        <div class="name">用户中心</div>
        <div class="position"></div>
      </t-card>
    </t-col>
    <t-col :flex="3">
      <div class="user-left-greeting">
        <div>
          {{ getGreeting() }}，{{ form.userName }}
          <span class="regular">今天是你加入轻松考的第 {{ getJoinDays() }} 天</span>
        </div>
        <img src="@/assets/easy-exam-logo.png" class="logo" />
      </div>

      <t-card class="content-container" :bordered="false">
        <t-tabs v-model="tabPanel">
          <t-tab-panel value="first" label="用户日志">
            <t-timeline theme="dot" mode="same" style="padding-top: 15px">
              <t-timeline-item v-for="item in event" :key="item.id" :label="item.createTime">
                {{ item.content }}
              </t-timeline-item>
            </t-timeline>
          </t-tab-panel>
          <t-tab-panel value="pass" label="修改密码">
            <t-form
              ref="passwordForm"
              :data="passwordForm"
              :rules="passwordRules"
              label-width="100px"
              style="padding-top: 15px"
              @submit="onPasswordSubmit"
            >
              <t-form-item label="原密码" name="oldPassword">
                <t-input v-model="passwordForm.oldPassword" type="password" placeholder="请输入原密码" />
              </t-form-item>
              <t-form-item label="新密码" name="newPassword">
                <t-input v-model="passwordForm.newPassword" type="password" placeholder="请输入新密码" />
              </t-form-item>
              <t-form-item>
                <t-button theme="primary" type="submit">确认修改</t-button>
              </t-form-item>
            </t-form>
          </t-tab-panel>
        </t-tabs>
      </t-card>
    </t-col>
  </t-row>
</template>

<script setup lang="ts">
import { MessagePlugin, SubmitContext } from 'tdesign-vue-next';
import { onMounted, ref } from 'vue';

import user from '@/api/user';

const tabPanel = ref('first');
const event = ref();
const form = ref({
  userName: '',
  realName: '',
  age: '',
  sex: '',
  birthDay: null,
  phone: null,
  userLevel: null,
  createTime: null,
  imagePath: null,
});

const passwordForm = ref({
  oldPassword: '',
  newPassword: '',
});

const passwordRules: any = {
  oldPassword: [{ required: true, message: '请输入原密码', type: 'error', trigger: 'blur' }],
  newPassword: [{ required: true, message: '请输入新密码', type: 'error', trigger: 'blur' }],
};

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 9) {
    return '早上好';
  }
  if (hour >= 9 && hour < 12) {
    return '上午好';
  }
  if (hour >= 12 && hour < 14) {
    return '中午好';
  }
  if (hour >= 14 && hour < 18) {
    return '下午好';
  }
  return '晚上好';
};

const getJoinDays = () => {
  if (!form.value.createTime) return 0;
  const joinDate = new Date(form.value.createTime);
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - joinDate.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const onPasswordSubmit = async ({ validateResult }: SubmitContext) => {
  if (validateResult === true) {
    try {
      await user.password({
        oldPassword: passwordForm.value.oldPassword,
        newPassword: passwordForm.value.newPassword,
      });
      MessagePlugin.success('密码修改成功');
      passwordForm.value = {
        oldPassword: '',
        newPassword: '',
      };
    } catch (error) {
      MessagePlugin.error('密码修改失败');
    }
  }
};

onMounted(() => {
  user.getUserEvent().then((res) => {
    event.value = res;
  });
  user.getCurrentUser().then((res) => {
    form.value = res;
  });
});
</script>

<style lang="less" scoped>
@import './index.less';

.t-descriptions {
  margin-top: 24px;
}
</style>
