<template>
  <div class="page-container">
    <div class="page-header">
      <h2>សង្ខែប</h2>
      <el-button :icon="Refresh" :loading="loading" @click="fetchDashboardData">
        Refresh
      </el-button>
    </div>

    <div v-loading="loading" class="stat-grid">
      <StatCard title="Total Customers" :value="totalCustomers" :icon="User" />
      <StatCard title="Total Loans" :value="totalLoans" :icon="Tickets" />
      <StatCard
        title="Active Loans"
        :value="activeLoans"
        :icon="Clock"
        icon-color="#d99a2b"
        icon-bg="#fbf1de"
      />
      <StatCard
        title="Paid Loans"
        :value="paidLoans"
        :icon="CircleCheck"
        icon-color="#1f9d63"
        icon-bg="#e4f5ec"
      />
      <StatCard
        title="Total Loan Amount"
        :value="totalLoanAmount"
        :icon="Money"
        :precision="2"
        prefix="៛"
      />
      <StatCard
        title="Remaining Balance"
        :value="totalRemainingBalance"
        :icon="Wallet"
        :precision="2"
        prefix="៛"
        icon-color="#d99a2b"
        icon-bg="#fbf1de"
      />
      <StatCard
        title="Total Money Received"
        :value="totalReceived"
        :icon="Coin"
        :precision="2"
        prefix="៛"
        icon-color="#1f9d63"
        icon-bg="#e4f5ec"
      />
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { Refresh, User, Tickets, Clock, CircleCheck, Money, Wallet, Coin } from '@element-plus/icons-vue'
import StatCard from '../components/StatCard.vue'
import { useDashboard } from '../composables/useDashboard'

const {
  loading,
  totalCustomers,
  totalLoans,
  activeLoans,
  paidLoans,
  totalLoanAmount,
  totalRemainingBalance,
  totalReceived,
  fetchDashboardData
} = useDashboard()

onMounted(fetchDashboardData)
</script>
