import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { getCustomers } from '../api/customers'
import { getLoans, LOAN_STATUS } from '../api/loans'
import { getReceives } from '../api/receives'
import { toNumber } from '../api/helpers'

/**
 * Aggregates the dashboard summary numbers from customers, loans and receives.
 */
export function useDashboard() {
  const customers = ref([])
  const loans = ref([])
  const receives = ref([])
  const loading = ref(false)

  const totalCustomers = computed(() => customers.value.length)
  const totalLoans = computed(() => loans.value.length)
  const activeLoans = computed(
    () => loans.value.filter((l) => l.status === LOAN_STATUS.ACTIVE).length
  )
  const paidLoans = computed(
    () => loans.value.filter((l) => l.status === LOAN_STATUS.PAID).length
  )
  const totalLoanAmount = computed(() =>
    loans.value.reduce((sum, l) => sum + toNumber(l.loan_amount), 0)
  )
  const totalRemainingBalance = computed(() =>
    loans.value.reduce((sum, l) => sum + toNumber(l.remaining_balance), 0)
  )
  const totalReceived = computed(() =>
    receives.value.reduce((sum, r) => sum + toNumber(r.total_receive), 0)
  )

  async function fetchDashboardData() {
    loading.value = true
    try {
      const [customerData, loanData, receiveData] = await Promise.all([
        getCustomers(),
        getLoans(),
        getReceives()
      ])
      customers.value = customerData
      loans.value = loanData
      receives.value = receiveData
    } catch (err) {
      ElMessage.error(err.message || 'Failed to load dashboard data')
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    totalCustomers,
    totalLoans,
    activeLoans,
    paidLoans,
    totalLoanAmount,
    totalRemainingBalance,
    totalReceived,
    fetchDashboardData
  }
}
