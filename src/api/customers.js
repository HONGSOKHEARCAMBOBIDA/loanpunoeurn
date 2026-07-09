import http, { SHEETS } from './config'
import { getNextId } from './helpers'

/**
 * Fetch all customers.
 * @returns {Promise<Array>}
 */
export async function getCustomers() {
  const { data } = await http.get('/', { params: { sheet: SHEETS.CUSTOMERS } })
  return Array.isArray(data) ? data : []
}

/**
 * Fetch a single customer by id.
 * @param {number|string} id
 * @returns {Promise<Object|null>}
 */
export async function getCustomerById(id) {
  const { data } = await http.get(`/search`, {
    params: { sheet: SHEETS.CUSTOMERS, id }
  })
  return Array.isArray(data) && data.length ? data[0] : null
}

/**
 * Create a new customer. Generates the next numeric id automatically.
 * @param {{customer_name: string, phone: string, address: string}} payload
 * @returns {Promise<Object>} the created customer including its new id
 */
export async function createCustomer(payload) {
  const id = await getNextId(SHEETS.CUSTOMERS)
  const record = {
    id,
    customer_name: payload.customer_name,
    phone: payload.phone,
    address: payload.address
  }
  await http.post('/', { data: [record] }, { params: { sheet: SHEETS.CUSTOMERS } })
  return record
}

/**
 * Update an existing customer.
 * @param {number|string} id
 * @param {{customer_name: string, phone: string, address: string}} payload
 */
export async function updateCustomer(id, payload) {
  await http.put(
    `/id/${id}`,
    {
      data: {
        customer_name: payload.customer_name,
        phone: payload.phone,
        address: payload.address
      }
    },
    { params: { sheet: SHEETS.CUSTOMERS } }
  )
  return { id, ...payload }
}

/**
 * Delete a customer by id.
 * @param {number|string} id
 */
export async function deleteCustomer(id) {
  await http.delete(`/id/${id}`, { params: { sheet: SHEETS.CUSTOMERS } })
}
