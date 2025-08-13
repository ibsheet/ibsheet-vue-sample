<template>
  <div class="layout-container">
    <Sidebar @menu-click="onMenuClick" />
    <main class="main-content">
      <div v-if="tabs.length > 0" class="tab-bar">
        <div
          v-for="tab in tabs"
          :key="tab.route"
          class="tab"
          :class="{ active: tab.route === activeRoute }"
          :title="tab.title"
          @click="selectTab(tab)"
        >
          <span class="tab-title">{{ tab.title }}</span>
          <span class="close-btn" @click.stop="closeTab(tab)">×</span>
        </div>
      </div>

      <div class="content-container">
        <template v-for="tab in tabs" :key="tab.route">
          <div v-show="tab.route === activeRoute" class="view-wrapper">
            <component :is="tab.component" />
          </div>
        </template>

        <div v-if="tabs.length === 0 && homeComponent" class="view-wrapper">
          <component :is="homeComponent" />
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, shallowRef, defineAsyncComponent, markRaw, type Component } from 'vue';
import { useRouter } from 'vue-router';
import Sidebar from './Sidebar.vue';

import { routes } from '../Router/routes';
import router from '../Router';

interface MenuItem {
  title: string;
  route: string;
  name: string;
}

interface Tab {
  title: string;
  route: string;
  component: Component;
}

const tabs = ref<Tab[]>([]);
const activeRoute = ref<string | null>(null);
const componentMap = new Map<string, Component>();
const homeComponent = shallowRef<Component | null>(null);

const currentRoute = useRouter();

function buildComponentMap() {
  const layoutRoute = routes.find(r => r.path === '/' && r.children);

  if (layoutRoute && layoutRoute.children) {
    layoutRoute.children.forEach(route => {
      const componentLoader = route.component as () => Promise<Component>;
      const routeName = route.name?.toString();

      if (componentLoader && routeName) {
        const asyncComponent = defineAsyncComponent(componentLoader);
        componentMap.set(routeName, markRaw(asyncComponent));

        if (routeName === 'Home') {
          homeComponent.value = markRaw(asyncComponent);
        }
      }
    });
  }
}
buildComponentMap();

function onMenuClick(item: MenuItem) {
  if (!item.name || !componentMap.has(item.name)) return;

  const existingTab = tabs.value.find(tab => tab.route === item.route);

  if (!existingTab) {
    const component = componentMap.get(item.name);
    if (component) {
      tabs.value.push({
        title: item.title,
        route: item.route,
        component: component,
      });
    }
  }

  activeRoute.value = item.route;
  // router.push(item.route);
}

function selectTab(tab: Tab) {
  activeRoute.value = tab.route;
  // router.push(tab.route);
}

function closeTab(tab: Tab) {
  tabs.value = tabs.value.filter(t => t.route !== tab.route);

  if (activeRoute.value === tab.route) {
    if (tabs.value.length > 0) {
      selectTab(tabs.value[tabs.value.length - 1]);
    } else {
      activeRoute.value = '/';
      router.push('/');
    }
  }
}

buildComponentMap();
activeRoute.value = currentRoute.currentRoute.value.path;
</script>

<style lang="scss" scoped>
.content-container { flex: 1; overflow: auto; background-color: #fff; }
.view-wrapper { height: 100%; box-sizing: border-box;}

.layout-container { display: flex; height: 100vh; }
.main-content { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
.tab-bar {
  display: flex; border-bottom: 1px solid #ccc; background: #fafafa;
  padding: 8px 8px 0 8px; overflow-x: auto; flex-shrink: 0;
  .tab {
    display: flex; align-items: center; max-width: 150px; min-width: 100px;
    padding: 8px 12px; background: #e0e0e0; border: 1px solid #ccc;
    border-bottom: none; border-radius: 4px 4px 0 0; cursor: pointer;
    margin-right: 4px; position: relative; bottom: -1px;
    &.active { background: #fff; color: #2196f3; border-bottom: 1px solid #fff; }
    .tab-title { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex-grow: 1; }
    .close-btn {
      margin-left: 8px; cursor: pointer; font-weight: bold; flex-shrink: 0;
      border-radius: 50%; width: 16px; height: 16px; display: flex;
      align-items: center; justify-content: center;
      &:hover { background-color: #dcdcdc; }
    }
  }
}
.content-container { flex: 1; padding: 16px; overflow: auto; background-color: #fff; }
</style>
