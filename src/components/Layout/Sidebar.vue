<template>
  <div class="sidebar">
    <div
      v-for="item in menuItems"
      :key="item.title"
      class="menu-item"
      :class="{ active: item.route === activeRoute }"
      @click="navigate(item)"
    >
      <span v-if="item.icon" class="icon">
        <font-awesome-icon :icon="item.icon" />
      </span>
      <span class="title">{{ item.title }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faPlane, faShieldHalved, faBus, faTv } from '@fortawesome/free-solid-svg-icons';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';

interface MenuItem {
  title: string;
  route: string;
  name: string;
  icon?: IconDefinition
}

const emit = defineEmits<{
  (e: 'menu-click', item: MenuItem): void;
}>();

const menuItems = ref<MenuItem[]>([
  { title: '인천국제공항공사_국가별 항공 통계 서비스', route: '/flight', name: 'flight', icon: faPlane },
  { title: '행정안전부_민방위대피시설', route: '/civil', name: 'civil', icon: faShieldHalved },
  { title: '서울시_정류장 운행 통계', route: '/bus', name: 'bus', icon: faBus },
  { title: '넷플릭스_국가별 최고 인기 작품 (영화, TV)', route: '/netflix', name: 'netflix', icon: faTv },
]);

const route = useRoute();
const activeRoute = ref(route.path);

function navigate(item: MenuItem) {
  activeRoute.value = item.route;
  emit('menu-click', item);
}

watch(
  () => route.path,
  (newPath) => {
    activeRoute.value = newPath;
  }
);
</script>

<style lang="scss" scoped>
.sidebar {
  width: 240px;
  flex-shrink: 0;
  background-color: #2C3E50;
  color: #ECF0F1;
  padding: 16px 0;
  height: 100vh;
  overflow-y: auto;

  .menu-item {
    padding: 12px 20px;
    display: flex;
    align-items: center;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
      background-color: #34495E;
    }

    &.active {
      background-color: #1ABC9C;
      color: #fff;
    }

    .icon {
      margin-right: 12px;
      font-size: 1.2em;
      width: 20px;
      text-align: center;
    }

    .title {
      font-size: 1em;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
</style>
