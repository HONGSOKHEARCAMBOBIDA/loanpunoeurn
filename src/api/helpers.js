import http from './config'

/**
 * SheetDB stores every cell as a string and does not guarantee auto-incrementing
 * IDs out of the box. To keep IDs stable and unique we compute the next ID
 * client-side by reading the current rows of a sheet and taking max(id) + 1.
 *
 * @param {string} sheet - sheet name, e.g. 'customers'
 * @returns {Promise<number>} next available numeric id
 */
export async function getNextId(sheet) {
  const { data } = await http.get('/', { params: { sheet } })
  const rows = Array.isArray(data) ? data : []
  const maxId = rows.reduce((max, row) => {
    const idNum = Number(row.id)
    return Number.isFinite(idNum) && idNum > max ? idNum : max
  }, 0)
  return maxId + 1
}

/**
 * Safely parses a value coming from SheetDB (always a string) into a float.
 * Falls back to 0 when the value is missing or not numeric.
 */
export function toNumber(value) {
  const n = parseFloat(value)
  return Number.isFinite(n) ? n : 0
}
