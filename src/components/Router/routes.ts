import type { RouteRecordRaw } from 'vue-router';

const Layout = () => import('../Layout/Layout.vue');

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('../Views/HomeView.vue')
      },
      {
        path: 'flight',
        name: 'flight',
        component: () => import('../Views/Flight.vue')
      },
      {
        path: 'civil',
        name: 'civil',
        component: () => import('../Views/Civil.vue')
      },
      {
        path: 'bus',
        name: 'bus',
        component: () => import('../Views/Bus.vue')
      },
      {
        path: 'netflix',
        name: 'netflix',
        component: () => import('../Views/Netflix.vue')
      }
    ]
  }
];
