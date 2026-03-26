<script lang="ts" setup>
defineProps<{
  t: Record<string, any>;
}>();
</script>

<template>
  <div>
    <p>Vue Example</p>
    <p>{{ t.translated }}</p>
  </div>
</template>
