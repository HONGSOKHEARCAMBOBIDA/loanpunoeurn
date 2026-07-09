import http, { SHEETS } from './config'
import { getNextId } from './helpers'

export const LOAN_STATUS = {
  ACTIVE: 'Active',
  PAID: 'Paid'
}

/**
 * Fetch all loans.
 * @returns {Promise<Array>}
 */
export async function getLoans() {
  const { data } = await http.get('/', { params: { sheet: SHEETS.LOANS } })
  return Array.isArray(data) ? data : []
}

/**
 * Fetch a single loan by id.
 * @param {number|string} id
 * @returns {Promise<Object|null>}
 */
export async function getLoanById(id) {
  const { data } = await http.get(`/search`, {
    params: { sheet: SHEETS.LOANS, id }
  })
  return Array.isArray(data) && data.length ? data[0] : null
}

/**
 * Create a new loan. remaining_balance is set equal to loan_amount and
 * status defaults to Active.
 * @param {{customer_id: number|string, loan_amount: number}} payload
 * @returns {Promise<Object>} the created loan including its new id
 */
export async function createLoan(payload) {
  const id = await getNextId(SHEETS.LOANS)
  const record = {
    id,
    customer_id: payload.customer_id,
    loan_amount: payload.loan_amount,
    remaining_balance: payload.loan_amount,
    status: LOAN_STATUS.ACTIVE
  }
  await http.post('/', { data: [record] }, { params: { sheet: SHEETS.LOANS } })
  return record
}

/**
 * Update an existing loan record with arbitrary fields
 * (customer_id, loan_amount, remaining_balance, status).
 * @param {number|string} id
 * @param {Object} payload
 */
export async function updateLoan(id, payload) {
  await http.put(
    `/id/${id}`,
    { data: payload },
    { params: { sheet: SHEETS.LOANS } }
  )
  return { id, ...payload }
}

/**
 * Delete a loan by id.
 * @param {number|string} id
 */
export async function deleteLoan(id) {
  await http.delete(`/id/${id}`, { params: { sheet: SHEETS.LOANS } })
}
