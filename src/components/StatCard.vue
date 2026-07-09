<template>
  <el-card shadow="hover" class="stat-card">
    <div class="stat-icon" :style="{ backgroundColor: iconBg, color: iconColor }">
      <el-icon :size="22">
        <component :is="icon" />
      </el-icon>
    </div>
    <el-statistic :value="value" :precision="precision">
      <template #title>
        <span class="stat-title">{{ title }}</span>
      </template>
      <template v-if="prefix" #prefix>{{ prefix }}</template>
    </el-statistic>
  </el-card>
</template>

<script setup>
defineProps({
  title: { type: String, required: true },
  value: { type: [Number, String], required: true },
  icon: { type: [String, Object], required: true },
  precision: { type: Number, default: 0 },
  prefix: { type: String, default: '' },
  iconColor: { type: String, default: '#2c4a6e' },
  iconBg: { type: String, default: '#eaf0f6' }
})
</script>

<style scoped>
.stat-card {
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-card :deep(.el-card__body) {
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
}

.stat-icon {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-title {
  color: var(--app-text-secondary);
  font-size: 13px;
}
</style>
