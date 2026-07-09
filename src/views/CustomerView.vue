<template>
  <div class="page-container">
    <div class="page-header">
      <h2>Customers</h2>
      <el-button type="primary" :icon="Plus" @click="openCreateDialog">
        Add Customer
      </el-button>
    </div>

    <div class="page-toolbar">
      <el-input
        v-model="searchQuery"
        placeholder="Search by name or phone..."
        :prefix-icon="Search"
        clearable
        style="max-width: 320px"
      />
    </div>

    <el-card shadow="never">
      <el-table v-loading="loading" :data="filteredCustomers" stripe>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="customer_name" label="Name" min-width="160" />
        <el-table-column prop="phone" label="Phone" min-width="140" />
        <el-table-column prop="address" label="Address" min-width="200" />
        <el-table-column label="Actions" width="180">
          <template #default="{ row }">
            <el-button link type="primary" :icon="Edit" @click="openEditDialog(row)">
              Edit
            </el-button>
            <el-popconfirm
              title="Delete this customer?"
              confirm-button-text="Delete"
              cancel-button-text="Cancel"
              @confirm="removeCustomer(row.id)"
            >
              <template #reference>
                <el-button link type="danger" :icon="Delete">Delete</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>

      <el-empty
        v-if="!loading && filteredCustomers.length === 0"
        description="No customers found"
      />
    </el-card>

    <CustomerFormDialog
      v-model="dialogVisible"
      :customer="selectedCustomer"
      :saving="saving"
      @submit="handleSubmit"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Plus, Search, Edit, Delete } from '@element-plus/icons-vue'
import CustomerFormDialog from '../components/CustomerFormDialog.vue'
import { useCustomers } from '../composables/useCustomers'

const { customers, loading, saving, fetchCustomers, addCustomer, editCustomer, removeCustomer } =
  useCustomers()

const searchQuery = ref('')
const dialogVisible = ref(false)
const selectedCustomer = ref(null)

const filteredCustomers = computed(() => {
  if (!searchQuery.value) return customers.value
  const q = searchQuery.value.toLowerCase()
  return customers.value.filter(
    (c) =>
      (c.customer_name || '').toLowerCase().includes(q) ||
      (c.phone || '').toLowerCase().includes(q)
  )
})

function openCreateDialog() {
  selectedCustomer.value = null
  dialogVisible.value = true
}

function openEditDialog(customer) {
  selectedCustomer.value = customer
  dialogVisible.value = true
}

async function handleSubmit(payload) {
  const success = selectedCustomer.value
    ? await editCustomer(selectedCustomer.value.id, payload)
    : await addCustomer(payload)

  if (success) {
    dialogVisible.value = false
  }
}

onMounted(fetchCustomers)
</script>
