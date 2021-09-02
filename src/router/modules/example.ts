export default {
    path: 'example',
    name: "example",
    redirect: {
        name: 'exampleDemo'
    },
    component: () => import(/* webpackChunkName: "system" */ '@/views/example/index.vue'),
    children: [
        {
            name: 'exampleDemo',
            path: 'demo',
            component: () => import(/* webpackChunkName: "exampleDemo" */ '@/views/example/demo/index.vue'),
        }
    ]
}