/**
 * Formats a number as currency (USD-style grouping, 2 decimals).
 * @param {number|string} value
 * @returns {string}
 */
export function formatCurrency(value) {
  const n = Number(value) || 0
  return n.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

/**
 * Formats a date string (or Date) as YYYY-MM-DD.
 * @param {string|Date} value
 * @returns {string}
 */
export function formatDate(value) {
  if (!value) return ''
  const d = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(d.getTime())) return String(value)
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}
