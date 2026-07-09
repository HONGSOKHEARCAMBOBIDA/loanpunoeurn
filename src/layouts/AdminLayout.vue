<template>
  <el-container style="height: 100vh">
    <el-aside :width="collapsed ? '64px' : '220px'" class="admin-aside">
      <div class="brand" :class="{ collapsed }">
        <el-icon :size="22"><OfficeBuilding /></el-icon>
        <span v-if="!collapsed" class="brand-text">កត់ត្រាអ្នកខ្ចីលុយ</span>
      </div>
      <el-menu
        :default-active="activeMenu"
        :collapse="collapsed"
        background-color="#1d3350"
        text-color="#c8d3e0"
        active-text-color="#ffffff"
        router
      >
        <el-menu-item index="/">
          <el-icon><Odometer /></el-icon>
          <template #title>សង្ខែប</template>
        </el-menu-item>
        <el-menu-item index="/customers">
          <el-icon><User /></el-icon>
          <template #title>អ្នកខ្ចី</template>
        </el-menu-item>
        <el-menu-item index="/loans">
          <el-icon><Tickets /></el-icon>
          <template #title>លុយជំពាក់</template>
        </el-menu-item>
        <el-menu-item index="/receive-payment">
          <el-icon><Wallet /></el-icon>
          <template #title>កន្លែងសងលុយ</template>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header class="admin-header">
        <el-icon class="collapse-btn" :size="20" @click="collapsed = !collapsed">
          <Fold v-if="!collapsed" />
          <Expand v-else />
        </el-icon>
        <span class="header-title">{{ pageTitle }}</span>
      </el-header>
      <el-main class="admin-main">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const collapsed = ref(false)

const activeMenu = computed(() => {
  // Loan detail route should keep "Loans" highlighted in the sidebar.
  if (route.name === 'loan-detail') return '/loans'
  return route.path
})

const pageTitle = computed(() => route.meta?.title || 'Loan Management System')
</script>

<style scoped>
.admin-aside {
  background-color: #1d3350;
  transition: width 0.2s ease;
  overflow-x: hidden;
}

.brand {
  height: 56px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 18px;
  color: #ffffff;
  font-weight: 600;
  font-size: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.brand.collapsed {
  padding: 0 20px;
}

.brand-text {
  white-space: nowrap;
}

.admin-header {
  background: var(--app-header-bg);
  border-bottom: 1px solid var(--app-border);
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 0 20px;
}

.collapse-btn {
  cursor: pointer;
  color: var(--app-text-secondary);
}

.header-title {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
}

.admin-main {
  background: var(--app-bg);
  padding: 0;
  overflow-y: auto;
}

:deep(.el-menu) {
  border-right: none;
}
</style>
