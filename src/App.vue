<template>
  <Layout />
</template>

<script setup>
import Layout from './components/Layout/Layout.vue';
import loader from '@ibsheet/loader';

loader.load({
  name: 'ibsheet',
  baseUrl: 'https://demo.ibsheet.com/ibsheet/v8/samples/customer-sample/assets/ibsheet',
  locales: ['ko'],
  // plugins: ['excel', 'common', 'dialog']
})
</script>
