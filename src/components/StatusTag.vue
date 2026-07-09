<template>
  <el-tag :type="tagType" effect="light" round>{{ status }}</el-tag>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  status: { type: String, required: true }
})

const tagType = computed(() => (props.status === 'Paid' ? 'success' : 'warning'))
</script>
