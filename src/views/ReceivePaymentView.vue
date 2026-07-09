<template>
  <div class="page-container">
    <div class="page-header">
      <h2>សងលុយ</h2>
    </div>

    <el-row :gutter="20">
      <el-col :xs="24" :md="14">
        <el-card shadow="never">
          <el-form
            ref="formRef"
            :model="form"
            :rules="receiveRules"
            label-position="top"
            @submit.prevent
          >
            <el-form-item label="រេីសអ្នកខ្ចី" prop="loan_id">
              <el-select
                v-model="form.loan_id"
                placeholder="Select a loan"
                filterable
                style="width: 100%"
                @change="handleLoanChange"
              >
                <el-option
                  v-for="loan in selectableLoans"
                  :key="loan.id"
                  :label="`#${loan.id} — ${loan.customer_name} (Balance: ៛${formatCurrency(loan.remaining_balance)})`"
                  :value="loan.id"
                  :disabled="loan.status === 'Paid'"
                />
              </el-select>
            </el-form-item>

            <el-form-item label="រេីសថ្ងៃសង" prop="receive_date">
              <el-date-picker
                v-model="form.receive_date"
                type="date"
                placeholder="Select date"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
                style="width: 100%"
              />
            </el-form-item>

            <el-form-item label="លុយសង" prop="total_receive">
              <el-input-number
                v-model="form.total_receive"
                :min="0"
                :max="maxReceivable || undefined"
                :step="10"
                :precision="2"
                style="width: 100%"
              />
              <div v-if="selectedLoan" class="text-muted hint">
                Current remaining balance: {{ formatCurrency(selectedLoan.remaining_balance) }}៛
              </div>
            </el-form-item>

            <el-button type="primary" :loading="saving" @click="handleSubmit">
              បង់ប្រាក់
            </el-button>
          </el-form>
        </el-card>
      </el-col>

      <el-col :xs="24" :md="10">
        <el-card v-if="selectedLoan" shadow="never" header="ព័ត៏កម្ចី">
          <p><strong>អ្នកខ្ចី:</strong> {{ selectedLoan.customer_name }}</p>
          <p><strong>ទំហំកម្ចី:</strong> {{ formatCurrency(selectedLoan.loan_amount) }}៛</p>
          <p>
            <strong>លុយនៅជំពាក់សរុប:</strong> {{ formatCurrency(selectedLoan.remaining_balance) }}៛
          </p>
          <p>
            <strong>ស្ថានភាព:</strong>
            <StatusTag :status="selectedLoan.status" />
          </p>
        </el-card>
        <el-empty v-else description="Select a loan to see its summary" />
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useReceives } from '../composables/useReceives'
import { receiveRules } from '../utils/validators'
import { formatCurrency } from '../utils/format'
import StatusTag from '../components/StatusTag.vue'

const { selectableLoans, saving, fetchLoanOptions, recordPayment } = useReceives()

const formRef = ref(null)
const form = ref({
  loan_id: '',
  receive_date: new Date().toISOString().split("T")[0],
  total_receive: null
})

const selectedLoan = computed(() =>
  selectableLoans.value.find((l) => String(l.id) === String(form.value.loan_id)) || null
)

const maxReceivable = computed(() =>
  selectedLoan.value ? selectedLoan.value.remaining_balance : null
)

function handleLoanChange() {
  form.value.total_receive = null
}

async function handleSubmit() {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (!valid) return
    const success = await recordPayment({ ...form.value })
    if (success) {
      form.value = { loan_id: '', receive_date: new Date().toISOString().split("T")[0], total_receive: null }
      formRef.value.clearValidate()
    }
  })
}

onMounted(fetchLoanOptions)
</script>

<style scoped>
.hint {
  font-size: 12px;
  margin-top: 6px;
}
</style>
