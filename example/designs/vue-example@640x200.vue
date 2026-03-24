<script lang="ts" setup>
import "../assets/styles.css";

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
