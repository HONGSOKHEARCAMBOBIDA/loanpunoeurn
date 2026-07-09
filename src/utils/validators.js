/**
 * Shared Element Plus form validation rule sets.
 */

export const customerRules = {
  customer_name: [
    { required: true, message: 'Customer name is required', trigger: 'blur' }
  ],
  phone: [{ required: true, message: 'Phone number is required', trigger: 'blur' }],
  address: [{ required: true, message: 'Address is required', trigger: 'blur' }]
}

export const loanRules = {
  customer_id: [
    { required: true, message: 'Please select a customer', trigger: 'change' }
  ],
  loan_amount: [
    { required: true, message: 'Loan amount is required', trigger: 'blur' },
    {
      validator: (_rule, value, callback) => {
        if (value === null || value === undefined || value === '') {
          callback()
        } else if (Number(value) <= 0) {
          callback(new Error('Loan amount must be greater than 0'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

export const receiveRules = {
  loan_id: [{ required: true, message: 'Please select a loan', trigger: 'change' }],
  receive_date: [
    { required: true, message: 'Receive date is required', trigger: 'change' }
  ],
  total_receive: [
    { required: true, message: 'Amount received is required', trigger: 'blur' },
    {
      validator: (_rule, value, callback) => {
        if (value === null || value === undefined || value === '') {
          callback()
        } else if (Number(value) <= 0) {
          callback(new Error('Amount must be greater than 0'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}
