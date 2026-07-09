<template>
  <div class="page-container">
    <div class="page-header">
      <h2>កម្ចីទាំងអស់</h2>
      <el-button type="primary" :icon="Plus" @click="openCreateDialog">
        បន្ថែមកម្ចី
      </el-button>
    </div>

    <div class="page-toolbar">
      <el-input
        v-model="searchQuery"
        placeholder="Search by customer name..."
        :prefix-icon="Search"
        clearable
        style="max-width: 280px"
      />
      <el-select v-model="statusFilter" placeholder="Filter by status" style="width: 160px" clearable>
        <el-option label="Active" value="Active" />
        <el-option label="Paid" value="Paid" />
      </el-select>
    </div>

    <el-card shadow="never">
      <el-table v-loading="loading" :data="filteredLoans" stripe>
        <el-table-column prop="id" label="ល.រ" width="70" />
        <el-table-column prop="customer_name" label="ឈ្មោះអ្នកខ្ចី" min-width="150" />
        <el-table-column label="លុយដេីម" min-width="130">
          <template #default="{ row }">{{ formatCurrency(row.loan_amount) }}៛</template>
        </el-table-column>
        <el-table-column label="លុយនៅជំពាក់" min-width="150">
          <template #default="{ row }">{{ formatCurrency(row.remaining_balance) }}៛</template>
        </el-table-column>
        <el-table-column label="ស្ថានភាព" width="120">
          <template #default="{ row }">
            <StatusTag :status="row.status" />
          </template>
        </el-table-column>
        <el-table-column label="សកម្មភាព" width="250" >
          <template #default="{ row }">
            <el-button link type="primary" :icon="View" @click="viewLoan(row)">
              View
            </el-button>
            <el-button link type="primary" :icon="Edit" @click="openEditDialog(row)">
              Edit
            </el-button>
            <el-popconfirm
              title="Delete this loan?"
              confirm-button-text="Delete"
              cancel-button-text="Cancel"
              @confirm="removeLoan(row.id)"
            >
              <template #reference>
                <el-button link type="danger" :icon="Delete">Delete</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>

      <el-empty v-if="!loading && filteredLoans.length === 0" description="No loans found" />
    </el-card>

    <LoanFormDialog
      v-model="dialogVisible"
      :loan="selectedLoan"
      :customers="customers"
      :saving="saving"
      @submit="handleSubmit"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Plus, Search, Edit, Delete, View } from '@element-plus/icons-vue'
import LoanFormDialog from '../components/LoanFormDialog.vue'
import StatusTag from '../components/StatusTag.vue'
import { useLoans } from '../composables/useLoans'
import { formatCurrency } from '../utils/format'

const router = useRouter()

const {
  customers,
  loading,
  saving,
  loansWithCustomer,
  fetchLoans,
  addLoan,
  editLoan,
  removeLoan
} = useLoans()

const searchQuery = ref('')
const statusFilter = ref('')
const dialogVisible = ref(false)
const selectedLoan = ref(null)

const filteredLoans = computed(() => {
  let result = loansWithCustomer.value
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter((l) => (l.customer_name || '').toLowerCase().includes(q))
  }
  if (statusFilter.value) {
    result = result.filter((l) => l.status === statusFilter.value)
  }
  return result
})

function openCreateDialog() {
  selectedLoan.value = null
  dialogVisible.value = true
}

function openEditDialog(loan) {
  selectedLoan.value = loan
  dialogVisible.value = true
}

function viewLoan(loan) {
  router.push({ name: 'loan-detail', params: { id: loan.id } })
}

async function handleSubmit(payload) {
  const success = selectedLoan.value
    ? await editLoan(selectedLoan.value.id, payload)
    : await addLoan(payload)

  if (success) {
    dialogVisible.value = false
  }
}

onMounted(fetchLoans)
</script>
