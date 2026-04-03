import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'game',
      component: () => import('@/layouts/GameLayout.vue')
    },
    {
      path: '/map-test',
      name: 'map-test',
      component: () => import('@/views/MapTest.vue')
    },
    {
      path: '/simple-map',
      name: 'simple-map',
      component: () => import('@/views/SimpleMapTest.vue')
    },
    {
      path: '/team-setup',
      name: 'team-setup',
      component: () => import('@/views/team/TeamSetupView.vue')
    },
    {
      path: '/hq-test',
      name: 'hq-test',
      component: () => import('@/views/HeadquartersTest.vue')
    },
    {
      path: '/team',
      name: 'team',
      component: () => import('@/views/team/TeamView.vue')
    }
  ]
})

export default router
