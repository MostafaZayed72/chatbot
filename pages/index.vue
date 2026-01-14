<template>
  <div>
    <h1 class="title mb-4">Dashboard Overview</h1>
    <div class="grid">
      <div class="card">
        <h3>Requests</h3>
        <p class="stat">{{ requests?.length || 0 }}</p>
        <NuxtLink to="/requests" class="btn btn-secondary mt-4">Manage Requests</NuxtLink>
      </div>
      <div class="card">
        <h3>Products</h3>
        <p class="stat">{{ products?.length || 0 }}</p>
        <NuxtLink to="/products" class="btn btn-secondary mt-4">Manage Products</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
const { data: requests } = await useFetch('/api/requests')
const { data: products } = await useFetch('/api/products')
</script>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

h3 {
  color: var(--color-text-muted);
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.5rem;
}

.stat {
  font-size: 3rem;
  font-weight: 700;
  color: var(--color-primary);
}
</style>
