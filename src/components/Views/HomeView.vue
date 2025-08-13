<template>
  <div class="home-container">
    <div class="centered-content">
      <p>IBSheet Vue Sample</p>
    </div>
  </div>
</template>

<style scoped>
.home-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.centered-content {
  position: absolute;
  top: 50%;
  left: 50%;

  transform: translate(-50%, -50%);

  text-align: center;
  color: #555;
  font-size: 1.5rem;
  font-weight: 500;
}
</style>
