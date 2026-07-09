import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import {
  getCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer
} from '../api/customers'

/**
 * Encapsulates customer data fetching + CRUD operations with
 * loading/error state, so views stay free of direct API calls.
 */
export function useCustomers() {
  const customers = ref([])
  const loading = ref(false)
  const saving = ref(false)

  async function fetchCustomers() {
    loading.value = true
    try {
      customers.value = await getCustomers()
    } catch (err) {
      ElMessage.error(err.message || 'Failed to load customers')
    } finally {
      loading.value = false
    }
  }

  async function addCustomer(payload) {
    saving.value = true
    try {
      const created = await createCustomer(payload)
      customers.value.push(created)
      ElMessage.success('Customer created successfully')
      return true
    } catch (err) {
      ElMessage.error(err.message || 'Failed to create customer')
      return false
    } finally {
      saving.value = false
    }
  }

  async function editCustomer(id, payload) {
    saving.value = true
    try {
      await updateCustomer(id, payload)
      const idx = customers.value.findIndex((c) => String(c.id) === String(id))
      if (idx !== -1) {
        customers.value[idx] = { ...customers.value[idx], ...payload }
      }
      ElMessage.success('Customer updated successfully')
      return true
    } catch (err) {
      ElMessage.error(err.message || 'Failed to update customer')
      return false
    } finally {
      saving.value = false
    }
  }

  async function removeCustomer(id) {
    try {
      await deleteCustomer(id)
      customers.value = customers.value.filter((c) => String(c.id) !== String(id))
      ElMessage.success('Customer deleted successfully')
      return true
    } catch (err) {
      ElMessage.error(err.message || 'Failed to delete customer')
      return false
    }
  }

  return {
    customers,
    loading,
    saving,
    fetchCustomers,
    addCustomer,
    editCustomer,
    removeCustomer
  }
}
