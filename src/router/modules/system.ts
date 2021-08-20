export default {
    path: 'system',
    redirect: {
        name: 'systemMenu'
    },
    component: () => import(/* webpackChunkName: "system" */ '@/views/system/index.vue'),
    children: [
        {
            name: 'systemMenu',
            path: 'menu',
            component: () => import(/* webpackChunkName: "systemMenu" */ '@/views/system/menu/index.vue'),
        },
        {
            name: 'systemRole',
            path: 'role',
            component: () => import(/* webpackChunkName: "systemRole" */ '@/views/system/role/index.vue'),
        },
        {
            name: 'systemUser',
            path: 'user',
            component: () => import(/* webpackChunkName: "systemUser" */ '@/views/system/user/index.vue'),
        }
    ]
}