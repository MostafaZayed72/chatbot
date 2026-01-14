<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <h1 class="title">Requests</h1>
      <button @click="openModal()" class="btn">
        + Add Request
      </button>
    </div>

    <div class="data-table-wrapper card">
      <table class="data-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Name</th>
            <th>Phone</th>
            <th>Status</th>
            <th>Content</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="req in requests" :key="req.id">
            <td>{{ new Date(req.created_at).toLocaleDateString() }}</td>
            <td>{{ req.full_name }}</td>
            <td>
              <div>{{ req.phone }}</div>
              <div v-if="req.whatsapp" class="text-xs text-muted">WA: {{ req.whatsapp }}</div>
            </td>
            <td>
              <span :class="['badge', getStatusClass(req.status)]">{{ req.status }}</span>
            </td>
            <td class="truncate-cell" :title="req.request_content">
              {{ req.request_content }}
            </td>
            <td>
              <button @click="openModal(req)" class="action-btn text-primary">Edit</button>
              <button @click="deleteRequest(req.id)" class="action-btn text-danger">Delete</button>
            </td>
          </tr>
          <tr v-if="!requests?.length">
            <td colspan="6" class="text-center p-4">No requests found.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
      <div class="modal card">
        <h2 class="mb-4">{{ isEditing ? 'Edit Request' : 'New Request' }}</h2>
        <form @submit.prevent="saveRequest" class="grid-form">
          <div class="form-group full-width">
            <label>Full Name</label>
            <input v-model="form.full_name" class="input" required />
          </div>
          <div class="form-group">
            <label>Phone</label>
            <input v-model="form.phone" class="input" required />
          </div>
          <div class="form-group">
            <label>WhatsApp (Optional)</label>
            <input v-model="form.whatsapp" class="input" />
          </div>
          <div class="form-group full-width">
            <label>Address</label>
            <input v-model="form.address" class="input" required />
          </div>
          <div class="form-group full-width">
            <label>Content / Order Details</label>
            <textarea v-model="form.request_content" class="input" rows="4" required></textarea>
          </div>
           <div class="form-group">
            <label>Status</label>
            <select v-model="form.status" class="input">
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div class="modal-actions full-width flex gap-4 mt-4">
             <button type="button" @click="showModal = false" class="btn btn-secondary flex-1">Cancel</button>
             <button type="submit" class="btn flex-1" :disabled="saving">
               {{ saving ? 'Saving...' : 'Save' }}
             </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
const { data: requests, refresh } = await useFetch('/api/requests')

const showModal = ref(false)
const isEditing = ref(false)
const saving = ref(false)

const form = ref({
  id: null,
  full_name: '',
  phone: '',
  whatsapp: '',
  address: '',
  request_content: '',
  status: 'pending'
})

const openModal = (req = null) => {
  if (req) {
    isEditing.value = true
    form.value = { ...req }
  } else {
    isEditing.value = false
    form.value = {
      full_name: '', phone: '', whatsapp: '', address: '', request_content: '', status: 'pending'
    }
  }
  showModal.value = true
}

const saveRequest = async () => {
  saving.value = true
  try {
    if (isEditing.value) {
      await $fetch(`/api/requests/${form.value.id}`, { method: 'PUT', body: form.value })
    } else {
      await $fetch('/api/requests', { method: 'POST', body: form.value })
    }
    await refresh()
    showModal.value = false
  } catch (err) {
    alert('Error saving request')
  } finally {
    saving.value = false
  }
}

const deleteRequest = async (id) => {
  if (!confirm('Delete this request?')) return
  try {
    await $fetch(`/api/requests/${id}`, { method: 'DELETE' })
    refresh()
  } catch (err) {
    alert('Failed to delete')
  }
}

const getStatusClass = (status) => {
  if (status === 'completed') return 'success'
  if (status === 'cancelled') return 'danger'
  return ''
}
</script>

<style scoped>
.text-xs { font-size: 0.75rem; }
.truncate-cell {
  max-width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
/* Inherit others from main.css or copied from Products */
.product-thumb { width: 40px; height: 40px; object-fit: cover; border-radius: 4px; }
.action-btn { background: none; border: none; cursor: pointer; margin-right: 0.5rem; font-weight: 500; }
.text-danger { color: var(--color-danger); }
.modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; z-index: 100; backdrop-filter: blur(2px); }
.modal { width: 100%; max-width: 600px; max-height: 90vh; overflow-y: auto; }
.grid-form { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
.full-width { grid-column: span 2; }
label { display: block; margin-bottom: 0.25rem; font-size: 0.875rem; color: var(--color-text-muted); }
select.input { color: white; }
select.input option { color: black; }
</style>
