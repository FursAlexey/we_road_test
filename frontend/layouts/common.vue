<script></script>

<template>
  <div class="app-layout">
    <Sidebar />
    <div class="content-wrapper">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.app-layout {
  height: 100%;
  display: flex;
}

.content-wrapper {
  width: 100%;
  margin: 2rem 1rem;
}
</style>
