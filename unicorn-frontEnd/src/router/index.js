import { createRouter, createWebHashHistory } from "vue-router";

const router = createRouter({
    history: createWebHashHistory(),
    routes: [{
        path: '/editorPage/:productName',
        component: () =>
            import ('@/Pages/EditorPage.vue')
    }, {
        path: '/login',
        name: 'login',
        component: () =>
            import ('@/Pages/Login.vue')
    }, {
        path: '/register',
        name: 'register',
        component: () =>
            import ('@/Pages/Register.vue')
    }, {
        path: '/userPage',
        name: 'userPage',
        component: () =>
            import ('@/Pages/UserPage.vue')
    }, {
        path: '/',
        name: 'guide',
        component: () =>
            import ('@/Pages/Guide.vue')
    }, {

        path: '/preview/:projectId',
        name: 'preview',
        component: () =>
            import ('@/components/ProjectPreview.vue'),
        props: true

    }, {
        path: '/publish/:productName',
        name: 'publish',
        component: () =>
            import ('@/components/Publish.vue'),
        props: true
    }]
})

export default router