import { createRouter, createWebHistory } from 'vue-router'
import AdminLayout from '../layouts/AdminLayout.vue'

const routes = [
  {
    path: '/',
    component: AdminLayout,
    children: [
      {
        path: '',
        name: 'dashboard',
        component: () => import('../views/DashboardView.vue'),
        meta: { title: 'Dashboard' }
      },
      {
        path: 'customers',
        name: 'customers',
        component: () => import('../views/CustomerView.vue'),
        meta: { title: 'Customers' }
      },
      {
        path: 'loans',
        name: 'loans',
        component: () => import('../views/LoanView.vue'),
        meta: { title: 'Loans' }
      },
      {
        path: 'loans/:id',
        name: 'loan-detail',
        component: () => import('../views/LoanDetailView.vue'),
        meta: { title: 'Loan Detail' },
        props: true
      },
      {
        path: 'receive-payment',
        name: 'receive-payment',
        component: () => import('../views/ReceivePaymentView.vue'),
        meta: { title: 'Receive Payment' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
