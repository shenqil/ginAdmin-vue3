import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import beforeEachHandle from './beforeEachHandle'
import AdminLayout from '@/layouts/AdminLayout.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: AdminLayout,
    children: [
      {
        path: '',
        name: "Home",
        meta: {
          code: 'page_home'
        },
        component: () => import(/* webpackChunkName: "home", webpackPrefetch:true */ '@/views/home/index.vue'),
      }
    ]
  },
  {
    path: '/login',
    name: "Login",
    component: () => import(/* webpackChunkName: "Login" */ '@/views/login/index.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

/**
 * 注册所有的路由拦截器
 * */
beforeEachHandle.forEach(callbackFn => {
  router.beforeEach(callbackFn)
})


export default router;
