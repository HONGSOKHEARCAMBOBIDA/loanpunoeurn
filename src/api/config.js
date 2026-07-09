import axios from 'axios'

// Base URL of the SheetDB API endpoint, e.g. https://sheetdb.io/api/v1/xxxxxxxx
const BASE_URL = import.meta.env.VITE_SHEETDB_BASE_URL

if (!BASE_URL) {
  // eslint-disable-next-line no-console
  console.warn(
    '[SheetDB] VITE_SHEETDB_BASE_URL is not set. Please configure it in your .env file.'
  )
}

const http = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 15000
})

// Normalize error messages so composables/components can display something useful.
http.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error?.response?.data?.error ||
      error?.response?.data?.message ||
      error?.message ||
      'Unexpected network error. Please try again.'
    return Promise.reject(new Error(message))
  }
)

/**
 * Sheet names used across the app. Keeping these in one place avoids typos
 * when building query strings such as `?sheet=customers`.
 */
export const SHEETS = {
  CUSTOMERS: 'customers',
  LOANS: 'loans',
  RECEIVES: 'receives'
}

export default http
