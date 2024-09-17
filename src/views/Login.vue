<template>
  <div class="login">
    <h1>登入</h1>
    <form @submit.prevent="login">
      <div>
        <label for="account">帳號：</label>
        <input type="text" v-model="account" id="account" required />
      </div>
      <div>
        <label for="password">密碼：</label>
        <input type="password" v-model="password" id="password" required />
      </div>
      <button type="submit">登入</button>
    </form>
    <button @click="goToRegister">前往註冊</button>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      account: '',
      password: '',
    };
  },
  methods: {
    login() {
      // 模擬登入成功，將使用者名稱設為 'admin'
      const username = 'admin';
      // 將使用者名稱存入本地存儲（可選）
      localStorage.setItem('username', username);
      // 導向聊天室頁面
      this.$router.push('/chatroom');
    },
    goToRegister() {
      this.$router.push('/register');
    },
  },
};
</script>

<style scoped>
.login {
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
