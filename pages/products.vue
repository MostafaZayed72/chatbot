<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <h1 class="title">Products</h1>
      <button @click="openModal()" class="btn">+ Add Product</button>
    </div>

    <!-- Data Table -->
    <div class="data-table-wrapper card">
      <table class="data-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Price</th>
            <th>Percentage</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in products" :key="product.id">
            <td>
              <img
                v-if="product.image_url"
                :src="product.image_url"
                alt="Product"
                class="product-thumb"
              />
              <div v-else class="no-img">No Img</div>
            </td>
            <td>{{ product.name }}</td>
            <td>{{ product.price }}</td>
            <td>{{ product.profit_margin }}</td>
            <td>
              <button @click="openModal(product)" class="action-btn text-primary">Edit</button>
              <button @click="deleteProduct(product.id)" class="action-btn text-danger">Delete</button>
            </td>
          </tr>
          <tr v-if="!products?.length">
            <td colspan="5" class="text-center p-4">No products found.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
      <div class="modal card">
        <h2 class="mb-4">{{ isEditing ? 'Edit Product' : 'Add Product' }}</h2>
        <form @submit.prevent="saveProduct" class="grid-form">
          <div class="form-group">
            <label>Name</label>
            <input v-model="form.name" class="input" required />
          </div>
          <div class="form-group">
            <label>Price</label>
            <input v-model="form.price" type="number" class="input" required />
          </div>
          <div class="form-group">
            <label>Wholesale Price</label>
            <input v-model="form.wholesale_price" type="number" class="input" />
          </div>
          <div class="form-group">
            <label>Profit Margin</label>
            <input v-model="form.profit_margin" type="number" class="input" />
          </div>
          <div class="form-group">
            <label>Quantity</label>
            <input v-model="form.available_quantity" type="number" class="input" />
          </div>
          <div class="form-group">
            <label>Colors (comma separated)</label>
            <input v-model="form.colors_input" class="input" placeholder="Red, Blue, Green" />
          </div>
          <div class="form-group full-width">
            <label>Image URL</label>
            <input v-model="form.image_url" class="input" placeholder="https://..." />
          </div>
          <div class="form-group full-width">
            <label>Product URL</label>
            <input v-model="form.product_url" class="input" placeholder="https://..." />
          </div>
          <div class="form-group full-width">
            <label>Description</label>
            <textarea v-model="form.description" class="input" rows="3"></textarea>
          </div>

          <div class="modal-actions full-width flex gap-4 mt-4">
            <button type="button" @click="showModal = false" class="btn btn-secondary flex-1">Cancel</button>
            <button
              type="submit"
              class="btn flex-1"
              :disabled="saving"
            >{{ saving ? 'Saving...' : 'Save' }}</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
const { data: products, refresh } = await useFetch('/api/products')

const showModal = ref(false)
const isEditing = ref(false)
const saving = ref(false)
const form = ref({
  id: null,
  name: '',
  price: 0,
  wholesale_price: 0,
  profit_margin: 0,
  available_quantity: 0,
  colors_input: '',
  image_url: '',
  product_url: '',
  description: ''
})

const openModal = (product = null) => {
  if (product) {
    isEditing.value = true
    form.value = {
      ...product,
      colors_input: product.available_colors ? product.available_colors.join(', ') : ''
    }
  } else {
    isEditing.value = false
    form.value = {
      name: '', price: 0, wholesale_price: 0, profit_margin: 0,
      available_quantity: 0, colors_input: '', image_url: '', product_url: '', description: ''
    }
  }
  showModal.value = true
}

const saveProduct = async () => {
  saving.value = true
  try {
    const payload = {
      ...form.value,
      available_colors: form.value.colors_input.split(',').map(c => c.trim()).filter(Boolean)
    }
    delete payload.colors_input

    if (isEditing.value) {
      await $fetch(`/api/products/${form.value.id}`, { method: 'PUT', body: payload })
    } else {
      await $fetch('/api/products', { method: 'POST', body: payload })
    }
    await refresh()
    showModal.value = false
  } catch (err) {
    alert('Error saving product: ' + err.message)
  } finally {
    saving.value = false
  }
}

const deleteProduct = async (id) => {
  if (!confirm('Are you sure you want to delete this product?')) return
  try {
    await $fetch(`/api/products/${id}`, { method: 'DELETE' })
    refresh()
  } catch (err) {
    alert('Failed to delete')
  }
}
</script>

<style scoped>
.product-thumb {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 4px;
}
.no-img {
  width: 40px;
  height: 40px;
  background: var(--color-surface-hover);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.6rem;
  color: var(--color-text-muted);
}
.action-btn {
  background: none;
  border: none;
  cursor: pointer;
  margin-right: 0.5rem;
  font-weight: 500;
}
.text-danger {
  color: var(--color-danger);
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  backdrop-filter: blur(2px);
}
.modal {
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
}
.grid-form {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}
.full-width {
  grid-column: span 2;
}
label {
  display: block;
  margin-bottom: 0.25rem;
  font-size: 0.875rem;
  color: var(--color-text-muted);
}

.truncate-link {
  display: inline-block;
  max-width: 150px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  vertical-align: middle;
}
</style>
