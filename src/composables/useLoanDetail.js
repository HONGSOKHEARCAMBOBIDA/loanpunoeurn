import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { getLoanById } from '../api/loans'
import { getCustomerById } from '../api/customers'
import { getReceivesByLoanId } from '../api/receives'
import { toNumber } from '../api/helpers'

/**
 * Loads a single loan together with its customer and full payment history,
 * for use on the Loan Detail page.
 */
export function useLoanDetail() {
  const loan = ref(null)
  const customer = ref(null)
  const receives = ref([])
  const loading = ref(false)
  const notFound = ref(false)

  const totalReceived = computed(() =>
    receives.value.reduce((sum, r) => sum + toNumber(r.total_receive), 0)
  )

  async function fetchLoanDetail(loanId) {
    loading.value = true
    notFound.value = false
    try {
      const loanData = await getLoanById(loanId)
      if (!loanData) {
        notFound.value = true
        return
      }
      loan.value = loanData
      const [customerData, receiveData] = await Promise.all([
        getCustomerById(loanData.customer_id),
        getReceivesByLoanId(loanId)
      ])
      customer.value = customerData
      receives.value = receiveData.sort(
        (a, b) => new Date(a.receive_date) - new Date(b.receive_date)
      )
    } catch (err) {
      ElMessage.error(err.message || 'Failed to load loan details')
    } finally {
      loading.value = false
    }
  }

  return {
    loan,
    customer,
    receives,
    loading,
    notFound,
    totalReceived,
    fetchLoanDetail
  }
}
