<template>
  <div class="login-container">
    <div class="card login-card">
      <h1 class="title mb-4 text-center">Login</h1>
      <form @submit.prevent="handleLogin" class="flex flex-col gap-4">
        <div class="form-group">
          <label>Username</label>
          <input v-model="form.username" type="text" class="input" placeholder="Enter username" required />
        </div>
        <div class="form-group">
          <label>Password</label>
          <input v-model="form.password" type="password" class="input" placeholder="Enter password" required />
        </div>
        <button type="submit" class="btn mt-4" :disabled="loading">
          {{ loading ? 'Logging in...' : 'Login' }}
        </button>
        <p v-if="error" class="error-msg">{{ error }}</p>
      </form>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: false
})

const form = ref({ username: '', password: '' })
const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const { success } = await $fetch('/api/auth/login', {
      method: 'POST',
      body: form.value
    })
    
    if (success) {
      // Cookie is set by server, refresh hooks or just redirect
      const auth = useCookie('auth_token')
      auth.value = 'valid-session' // Client side sync just in case
      navigateTo('/')
    }
  } catch (err) {
    error.value = err.data?.message || 'Login failed'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg);
}

.login-card {
  width: 100%;
  max-width: 400px;
}

.text-center { text-align: center; }

.error-msg {
  color: var(--color-danger);
  margin-top: 1rem;
  font-size: 0.875rem;
  text-align: center;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--color-text-muted);
  font-size: 0.875rem;
}
</style>
