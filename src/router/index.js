import Vue from 'vue';
import VueRouter from 'vue-router';
import Login from '@/views/Login.vue';
import Register from '@/views/Register.vue';
import Chatroom from '@/views/Chatroom.vue'; // 新增

Vue.use(VueRouter);

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/chatroom', component: Chatroom }, // 新增
];

const router = new VueRouter({
  mode: 'history',
  routes,
});

export default router;
