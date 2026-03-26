<script lang="ts" setup>
defineProps<{
  t: Record<string, any>;
}>();
</script>

<template>
  <div class="p-4">
    <p class="text-2xl">Vue Example</p>
    <p>{{ t.translated }}</p>
  </div>
</template>
