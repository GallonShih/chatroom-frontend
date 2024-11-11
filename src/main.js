import Vue from 'vue';
import App from './App.vue';
import router from './router';
import './assets/styles.css';

console.log('Backend URL:', window.env.BACKEND_URL);  // 後端 API 地址
console.log('WebSocket URL:', window.env.WEBSOCKET_URL);  // WebSocket 地址

Vue.config.productionTip = false;

// 將 `window.env` 中的變數設置為全局變數，方便在組件中使用
Vue.prototype.$backendUrl = window.env.BACKEND_URL;
Vue.prototype.$websocketUrl = window.env.WEBSOCKET_URL;

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');
