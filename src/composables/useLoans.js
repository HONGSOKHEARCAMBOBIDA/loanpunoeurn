import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { getLoans, createLoan, updateLoan, deleteLoan } from '../api/loans'
import { getCustomers } from '../api/customers'
import { toNumber } from '../api/helpers'

/**
 * Encapsulates loan data fetching + CRUD operations, joined with customer
 * names so views can render "customer_name" without doing lookups themselves.
 */
export function useLoans() {
  const loans = ref([])
  const customers = ref([])
  const loading = ref(false)
  const saving = ref(false)

  const customerMap = computed(() => {
    const map = {}
    customers.value.forEach((c) => {
      map[String(c.id)] = c.customer_name
    })
    return map
  })

  const loansWithCustomer = computed(() =>
    loans.value.map((loan) => ({
      ...loan,
      customer_name: customerMap.value[String(loan.customer_id)] || 'Unknown',
      loan_amount: toNumber(loan.loan_amount),
      remaining_balance: toNumber(loan.remaining_balance)
    }))
  )

  async function fetchLoans() {
    loading.value = true
    try {
      const [loanData, customerData] = await Promise.all([getLoans(), getCustomers()])
      loans.value = loanData
      customers.value = customerData
    } catch (err) {
      ElMessage.error(err.message || 'Failed to load loans')
    } finally {
      loading.value = false
    }
  }

  async function addLoan(payload) {
    saving.value = true
    try {
      const created = await createLoan(payload)
      loans.value.push(created)
      ElMessage.success('Loan created successfully')
      return true
    } catch (err) {
      ElMessage.error(err.message || 'Failed to create loan')
      return false
    } finally {
      saving.value = false
    }
  }

  async function editLoan(id, payload) {
    saving.value = true
    try {
      await updateLoan(id, payload)
      const idx = loans.value.findIndex((l) => String(l.id) === String(id))
      if (idx !== -1) {
        loans.value[idx] = { ...loans.value[idx], ...payload }
      }
      ElMessage.success('Loan updated successfully')
      return true
    } catch (err) {
      ElMessage.error(err.message || 'Failed to update loan')
      return false
    } finally {
      saving.value = false
    }
  }

  async function removeLoan(id) {
    try {
      await deleteLoan(id)
      loans.value = loans.value.filter((l) => String(l.id) !== String(id))
      ElMessage.success('Loan deleted successfully')
      return true
    } catch (err) {
      ElMessage.error(err.message || 'Failed to delete loan')
      return false
    }
  }

  return {
    loans,
    customers,
    loading,
    saving,
    loansWithCustomer,
    fetchLoans,
    addLoan,
    editLoan,
    removeLoan
  }
}
