import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { getLoans, updateLoan, LOAN_STATUS } from '../api/loans'
import { getCustomers } from '../api/customers'
import { createReceive, getReceives } from '../api/receives'
import { toNumber } from '../api/helpers'

/**
 * Business logic for recording a payment against a loan:
 * 1. Insert a new row into `receives`.
 * 2. Recompute the loan's remaining_balance = remaining_balance - total_receive.
 * 3. Clamp at 0, and flip status to Paid when balance reaches 0.
 */
export function useReceives() {
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

  // Only loans that still have a balance make sense to select for payment,
  // but we keep all loans visible with a clear label so users understand why
  // paid loans are disabled.
  const selectableLoans = computed(() =>
    loans.value.map((loan) => ({
      ...loan,
      loan_amount: toNumber(loan.loan_amount),
      remaining_balance: toNumber(loan.remaining_balance),
      customer_name: customerMap.value[String(loan.customer_id)] || 'Unknown'
    }))
  )

  async function fetchLoanOptions() {
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

  /**
   * Records a payment and updates the related loan's remaining_balance/status.
   * @param {{loan_id: number|string, receive_date: string, total_receive: number}} payload
   * @returns {Promise<boolean>} success
   */
  async function recordPayment(payload) {
    saving.value = true
    try {
      const loan = loans.value.find((l) => String(l.id) === String(payload.loan_id))
      if (!loan) {
        throw new Error('Selected loan could not be found')
      }

      const amount = toNumber(payload.total_receive)
      const currentBalance = toNumber(loan.remaining_balance)

      // Never allow remaining_balance to become negative.
      let newBalance = currentBalance - amount
      if (newBalance <= 0) {
        newBalance = 0
      }
      const newStatus = newBalance === 0 ? LOAN_STATUS.PAID : LOAN_STATUS.ACTIVE

      // 1. Insert the payment record.
      await createReceive({
        loan_id: payload.loan_id,
        receive_date: payload.receive_date,
        total_receive: amount
      })

      // 2. Update the loan balance/status.
      await updateLoan(loan.id, {
        remaining_balance: newBalance,
        status: newStatus
      })

      // keep local state in sync
      loan.remaining_balance = newBalance
      loan.status = newStatus

      ElMessage.success('Payment recorded successfully')
      return true
    } catch (err) {
      ElMessage.error(err.message || 'Failed to record payment')
      return false
    } finally {
      saving.value = false
    }
  }

  return {
    loans,
    selectableLoans,
    loading,
    saving,
    fetchLoanOptions,
    recordPayment
  }
}

/**
 * Standalone helper to fetch all receives (used by dashboard + loan detail page).
 */
export async function fetchAllReceives() {
  return getReceives()
}
