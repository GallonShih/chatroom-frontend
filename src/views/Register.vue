<template>
  <div class="register">
    <h1>註冊</h1>
    <form @submit.prevent="register">
      <div>
        <label for="account">帳號：</label>
        <input type="text" v-model="account" id="account" required />
      </div>
      <div>
        <label for="password">密碼：</label>
        <input type="password" v-model="password" id="password" required />
      </div>
      <div>
        <label for="username">名稱：</label>
        <input type="text" v-model="username" id="username" required />
      </div>
      <button type="submit">註冊</button>
    </form>
    <button @click="goToLogin">前往登入</button>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Register',
  data() {
    return {
      account: '',
      password: '',
      username: '',
    };
  },
  methods: {
    async register() {
      try {
        const response = await axios.post(
          `${process.env.VUE_APP_BACKEND_URL}/register`,
          {
            username: this.account,
            password: this.password,
            full_name: this.username,
          }
        );
        if (response.status === 200) {
          alert('註冊成功！');
          this.$router.push('/login');
        } else {
          alert('註冊失敗，請重試。');
        }
      } catch (error) {
        if (error.response && error.response.data && error.response.data.detail) {
          alert(`註冊失敗：${error.response.data.detail}`);
        } else {
          alert('註冊失敗，請檢查您的網路連線或稍後再試。');
        }
        console.error('註冊錯誤：', error);
      }
    },
    goToLogin() {
      this.$router.push('/login');
    },
  },
};
</script>

<style scoped>
.register {
  max-width: 400px;
  margin: 100px auto;
  background-color: #2c3e50;
  padding: 20px;
  border-radius: 8px;
}

h1 {
  text-align: center;
  color: #ecf0f1;
}

form div {
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
}

label {
  margin-bottom: 5px;
  color: #ecf0f1;
}

input {
  padding: 8px;
  font-size: 16px;
  border: none;
  border-radius: 4px;
}

button {
  padding: 10px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 10px;
  width: 100%;
  background-color: #34495e;
  color: #ecf0f1;
  border: none;
  border-radius: 4px;
}

button:hover {
  background-color: #3b5998;
}

button:focus {
  outline: none;
}
</style>
