<template>
  <el-dialog
    :model-value="modelValue"
    :title="isEdit ? 'Edit Loan' : 'Add Loan'"
    width="520px"
    :close-on-click-modal="false"
    @update:model-value="(v) => emit('update:modelValue', v)"
    @closed="resetForm"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="loanRules"
      label-position="top"
      @submit.prevent
    >
      <el-form-item label="Customer" prop="customer_id">
        <el-select
          v-model="form.customer_id"
          placeholder="Select a customer"
          filterable
          style="width: 100%"
        >
          <el-option
            v-for="c in customers"
            :key="c.id"
            :label="c.customer_name"
            :value="c.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="Loan Amount" prop="loan_amount">
        <el-input-number
          v-model="form.loan_amount"
          :min="0"
          :step="100"
          :precision="2"
          style="width: 100%"
        />
      </el-form-item>

      <template v-if="isEdit">
        <el-form-item label="Remaining Balance" prop="remaining_balance">
          <el-input-number
            v-model="form.remaining_balance"
            :min="0"
            :step="100"
            :precision="2"
            style="width: 100%"
          />
        </el-form-item>

        <el-form-item label="Status" prop="status">
          <el-select v-model="form.status" style="width: 100%">
            <el-option label="Active" value="Active" />
            <el-option label="Paid" value="Paid" />
          </el-select>
        </el-form-item>
      </template>

      <el-alert
        v-else
        type="info"
        :closable="false"
        show-icon
        title="Remaining balance will be set equal to the loan amount and status defaults to Active."
      />
    </el-form>

    <template #footer>
      <el-button @click="emit('update:modelValue', false)">Cancel</el-button>
      <el-button type="primary" :loading="saving" @click="handleSubmit">
        {{ isEdit ? 'Save Changes' : 'Create Loan' }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, watch, computed } from 'vue'
import { loanRules } from '../utils/validators'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  loan: { type: Object, default: null },
  customers: { type: Array, default: () => [] },
  saving: { type: Boolean, default: false }
})

const emit = defineEmits(['update:modelValue', 'submit'])

const formRef = ref(null)
const isEdit = computed(() => !!props.loan)

const form = reactive({
  customer_id: '',
  loan_amount: null,
  remaining_balance: null,
  status: 'Active'
})

watch(
  () => props.loan,
  (loan) => {
    if (loan) {
      form.customer_id = loan.customer_id
      form.loan_amount = Number(loan.loan_amount) || 0
      form.remaining_balance = Number(loan.remaining_balance) || 0
      form.status = loan.status || 'Active'
    } else {
      resetForm()
    }
  },
  { immediate: true }
)

function resetForm() {
  form.customer_id = ''
  form.loan_amount = null
  form.remaining_balance = null
  form.status = 'Active'
  formRef.value?.clearValidate()
}

async function handleSubmit() {
  if (!formRef.value) return
  await formRef.value.validate((valid) => {
    if (valid) {
      if (isEdit.value) {
        emit('submit', { ...form })
      } else {
        emit('submit', {
          customer_id: form.customer_id,
          loan_amount: form.loan_amount
        })
      }
    }
  })
}
</script>
