<template>
  <div></div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';

import { request } from '@/utils/request';

const getDashboardData = async () => {
  try {
    const res = await request.post({ url: '/student/dashboard/index' });
    console.log(res);
  } catch (err) {
    console.log(err);
  }
};

onMounted(() => {
  getDashboardData();
});
</script>

<style lang="less" scoped></style>
