<template>
  <div class="layout flex">
    <!-- Sidebar -->
    <aside class="sidebar">
      <div class="sidebar-header">
        <h2>Chatbot<span class="text-primary">Admin</span></h2>
      </div>
      <nav class="sidebar-nav">
        <NuxtLink to="/" class="nav-item">
          Dashboard
        </NuxtLink>
        <NuxtLink to="/requests" class="nav-item">
          Requests
        </NuxtLink>
        <NuxtLink to="/products" class="nav-item">
          Products
        </NuxtLink>
      </nav>
      <div class="sidebar-footer">
        <button @click="logout" class="btn btn-secondary w-full">Logout</button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="main-content">
      <slot />
    </main>
  </div>
</template>

<script setup>
const auth = useCookie('auth_token')

const logout = () => {
  auth.value = null
  navigateTo('/login')
}
</script>

<style scoped>
.layout {
  min-height: 100vh;
  background-color: var(--color-bg);
}

.sidebar {
  width: 250px;
  background-color: var(--color-surface);
  border-right: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  position: fixed;
  height: 100vh;
}

.sidebar-header {
  margin-bottom: 2rem;
}

.sidebar-header h2 {
  font-size: 1.5rem;
  color: var(--color-text);
}

.text-primary {
  color: var(--color-primary);
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
}

.nav-item {
  display: block;
  padding: 0.75rem 1rem;
  border-radius: var(--radius-sm);
  color: var(--color-text-muted);
  font-weight: 500;
  transition: all 0.2s;
}

.nav-item:hover, .nav-item.router-link-active {
  background-color: var(--color-surface-hover);
  color: var(--color-text);
  transform: translateX(4px);
}

.nav-item.router-link-active {
  color: var(--color-primary);
  background-color: rgba(99, 102, 241, 0.1);
}

.main-content {
  margin-left: 250px;
  flex: 1;
  padding: 2rem;
  width: calc(100% - 250px);
}

.w-full { width: 100%; }
</style>
