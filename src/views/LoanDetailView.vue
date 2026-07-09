<template>
  <div class="page-container">
    <div class="page-header">
      <h2>លំអិតពីកម្ចី</h2>
      <el-button :icon="Back" @click="router.push({ name: 'loans' })">
        ត្រឡប់
      </el-button>
    </div>

    <div v-loading="loading">
      <el-empty v-if="notFound" description="Loan not found" />

      <template v-else-if="loan">
        <el-row :gutter="20">
          <el-col :xs="24" :md="12">
            <el-card shadow="never" header="ព័ត៏មានទូទៅ" class="section-card">
              <template v-if="customer">
                <p><strong>ឈ្មោះ:</strong> {{ customer.customer_name }}</p>
                <p><strong>លេខទូរសព្ទ:</strong> {{ customer.phone }}</p>
                <p><strong>អាស័យដ្ឋាន:</strong> {{ customer.address }}</p>
              </template>
              <el-empty v-else description="Customer not found" :image-size="60" />
            </el-card>
          </el-col>

          <el-col :xs="24" :md="12">
            <el-card shadow="never" header="ព័ត៏កម្ចី" class="section-card">
              <p><strong>Loan ID:</strong> #{{ loan.id }}</p>
              <p><strong>ទំហំកម្ចី:</strong> {{ formatCurrency(loan.loan_amount) }}៛</p>
              <p>
                <strong>លុយនៅជំពាក់:</strong>
                {{ formatCurrency(loan.remaining_balance) }}៛
              </p>
              <p>
                <strong>ស្ថានភាព:</strong>
                <StatusTag :status="loan.status" />
              </p>
            </el-card>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :xs="24" :md="8">
            <StatCard
              title="លុយបានសងសរុប"
              :value="totalReceived"
              :icon="Coin"
              :precision="2"
              prefix="៛"
              icon-color="#1f9d63"
              icon-bg="#e4f5ec"
            />
          </el-col>
          <el-col :xs="24" :md="8">
            <StatCard
              title="លុយនៅជំពាក់សរុប"
              :value="Number(loan.remaining_balance)"
              :icon="Wallet"
              :precision="2"
              prefix="៛"
              icon-color="#d99a2b"
              icon-bg="#fbf1de"
            />
          </el-col>
          <el-col :xs="24" :md="8">
            <StatCard
              title="ទំហំកម្ចី"
              :value="Number(loan.loan_amount)"
              :icon="Money"
              :precision="2"
              prefix="៛"
            />
          </el-col>
        </el-row>

        <el-card shadow="never" header="ប្រវត្តសងលុយ" class="section-card">
          <el-table :data="receives" stripe>
            <el-table-column prop="id" label="ល.រ" width="80" />
            <el-table-column prop="receive_date" label="ថ្ងៃសងប្រាក់" min-width="150" />
            <el-table-column label="លុយបានសង" min-width="150">
              <template #default="{ row }">{{ formatCurrency(row.total_receive) }}៛</template>
            </el-table-column>
          </el-table>
          <el-empty v-if="receives.length === 0" description="No payments recorded yet" />
        </el-card>
      </template>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Back, Coin, Wallet, Money } from '@element-plus/icons-vue'
import StatCard from '../components/StatCard.vue'
import StatusTag from '../components/StatusTag.vue'
import { useLoanDetail } from '../composables/useLoanDetail'
import { formatCurrency } from '../utils/format'

const props = defineProps({
  id: { type: [String, Number], required: true }
})

const route = useRoute()
const router = useRouter()

const { loan, customer, receives, loading, notFound, totalReceived, fetchLoanDetail } =
  useLoanDetail()

onMounted(() => {
  fetchLoanDetail(props.id || route.params.id)
})
</script>
