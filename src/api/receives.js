import http, { SHEETS } from './config'
import { getNextId } from './helpers'

/**
 * Fetch all payment receive records.
 * @returns {Promise<Array>}
 */
export async function getReceives() {
  const { data } = await http.get('/', { params: { sheet: SHEETS.RECEIVES } })
  return Array.isArray(data) ? data : []
}

/**
 * Fetch all receives belonging to a specific loan.
 * @param {number|string} loanId
 * @returns {Promise<Array>}
 */
export async function getReceivesByLoanId(loanId) {
  const { data } = await http.get('/search', {
    params: { sheet: SHEETS.RECEIVES, loan_id: loanId }
  })
  return Array.isArray(data) ? data : []
}

/**
 * Create a new receive (payment) record.
 * @param {{loan_id: number|string, receive_date: string, total_receive: number}} payload
 * @returns {Promise<Object>} the created record including its new id
 */
export async function createReceive(payload) {
  const id = await getNextId(SHEETS.RECEIVES)
  const record = {
    id,
    loan_id: payload.loan_id,
    receive_date: payload.receive_date,
    total_receive: payload.total_receive
  }
  await http.post('/', { data: [record] }, { params: { sheet: SHEETS.RECEIVES } })
  return record
}
