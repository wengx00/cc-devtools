<template>
  <div>Hello Index</div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';

import interact from '@/utils/interact';

onMounted(() => {
  interact.dialog({
    body: 'Hello Dialog',
  });
});
</script>

<style scoped></style>
