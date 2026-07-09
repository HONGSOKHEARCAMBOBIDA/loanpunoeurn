<template>
  <el-dialog
    :model-value="modelValue"
    :title="isEdit ? 'Edit Customer' : 'Add Customer'"
    width="480px"
    :close-on-click-modal="false"
    @update:model-value="(v) => emit('update:modelValue', v)"
    @closed="resetForm"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="customerRules"
      label-position="top"
      @submit.prevent
    >
      <el-form-item label="Customer Name" prop="customer_name">
        <el-input v-model="form.customer_name" placeholder="e.g. John Doe" />
      </el-form-item>
      <el-form-item label="Phone" prop="phone">
        <el-input v-model="form.phone" placeholder="e.g. 012 345 678" />
      </el-form-item>
      <el-form-item label="Address" prop="address">
        <el-input
          v-model="form.address"
          type="textarea"
          :rows="3"
          placeholder="Street, city, country"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="emit('update:modelValue', false)">Cancel</el-button>
      <el-button type="primary" :loading="saving" @click="handleSubmit">
        {{ isEdit ? 'Save Changes' : 'Create Customer' }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, watch, computed } from 'vue'
import { customerRules } from '../utils/validators'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  customer: { type: Object, default: null },
  saving: { type: Boolean, default: false }
})

const emit = defineEmits(['update:modelValue', 'submit'])

const formRef = ref(null)
const isEdit = computed(() => !!props.customer)

const form = reactive({
  customer_name: '',
  phone: '',
  address: ''
})

watch(
  () => props.customer,
  (customer) => {
    if (customer) {
      form.customer_name = customer.customer_name || ''
      form.phone = customer.phone || ''
      form.address = customer.address || ''
    } else {
      resetForm()
    }
  },
  { immediate: true }
)

function resetForm() {
  form.customer_name = ''
  form.phone = ''
  form.address = ''
  formRef.value?.clearValidate()
}

async function handleSubmit() {
  if (!formRef.value) return
  await formRef.value.validate((valid) => {
    if (valid) {
      emit('submit', { ...form })
    }
  })
}
</script>
