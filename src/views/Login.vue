<template>
  <div class="login">
    <h1>登入</h1>
    <form @submit.prevent="login">
      <div>
        <label for="username">帳號：</label>
        <input type="text" v-model="username" id="username" required />
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
import axios from 'axios';
import Cookies from 'js-cookie';

export default {
  name: 'LoginPage',
  data() {
    return {
      username: '',
      password: '',
    };
  },
  async created() {
    await this.checkAccessToken();
  },
  methods: {
    async checkAccessToken() {
      const accessToken = Cookies.get('access_token');
      const tokenType = Cookies.get('token_type');

      if (accessToken && tokenType) {
        try {
          const response = await axios.get(`${process.env.VUE_APP_BACKEND_URL}/user`, {
            headers: {
              Authorization: `${tokenType} ${accessToken}`,
            },
            withCredentials: true,
          });

          // 若成功，直接跳轉到聊天室頁面
          if (response.status === 200) {
            const userInfo = response.data;
            localStorage.setItem('userInfo', JSON.stringify(userInfo)); // 將用戶資訊轉換為字串並儲存
            this.$router.push('/chatroom');
          }
        } catch (error) {
          // 若驗證失敗，清除 Token
          Cookies.remove('access_token');
          Cookies.remove('token_type');
          localStorage.removeItem('userInfo'); // 清除本地儲存的用戶資訊
          console.error('Token 驗證失敗，已清除 Token:', error);
        }
      }
    },
    async login() {
      try {
        const params = new URLSearchParams();
        params.append('grant_type', 'password');
        params.append('username', this.username);
        params.append('password', this.password);
        params.append('scope', '');
        params.append('client_id', 'string');
        params.append('client_secret', 'string');

        const response = await axios.post(
          `${process.env.VUE_APP_BACKEND_URL}/login`,
          params
        );

        if (response.status === 200) {
          // 儲存 Token 到 Cookie 中
          const { access_token, token_type } = response.data;
          Cookies.set('access_token', access_token, { expires: 1, secure: true, sameSite: 'Strict' });
          Cookies.set('token_type', token_type, { expires: 1, secure: true, sameSite: 'Strict' });

          // 再次進行 Token 驗證並跳轉
          await this.checkAccessToken();
        }
      } catch (error) {
        if (error.response && error.response.data && error.response.data.detail) {
          alert(`登入失敗：${error.response.data.detail}`);
        } else {
          alert('登入失敗，請檢查您的網路連線或稍後再試。');
        }
        console.error('登入錯誤：', error);
      }
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
