<template>
  <div class="chatroom">
    <div class="header">
      <h1>聊天室</h1>
      <button @click="logout" class="logout-button">登出</button>
    </div>
    <div class="messages">
      <div
          v-for="(message, index) in messages"
          :key="index"
          :class="['message', message.username === currentUser ? 'self' : 'other']"
      >
        <div class="message-content">
          <div class="message-header">
            <span class="username">{{ message.full_name }}</span>
            <span class="timestamp">{{ formatTimestamp(message.timestamp) }}</span>
          </div>
          <div class="text">{{ message.message }}</div>
        </div>
      </div>
    </div>
    <div class="input-area">
      <input
          type="text"
          v-model="newMessage"
          placeholder="輸入訊息..."
          @keyup.enter="sendMessage"
      />
      <button @click="sendMessage">送出</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Cookies from 'js-cookie';

export default {
  name: 'Chatroom',
  data() {
    return {
      currentUser: JSON.parse(localStorage.getItem('userInfo')).username || 'admin',
      newMessage: '',
      messages: [],
      ws: null,
    };
  },
  async created() {
    await this.checkAccessToken();
    this.connectWebSocket();
  },
  beforeDestroy() {
    if (this.ws) {
      this.ws.close();
    }
  },
  methods: {
    async checkAccessToken() {
      const accessToken = Cookies.get('access_token');
      const tokenType = Cookies.get('token_type');

      if (accessToken && tokenType) {
        try {
          const response = await axios.get(`${this.$backendUrl}/user`, {
            headers: {
              Authorization: `${tokenType} ${accessToken}`,
            },
            withCredentials: true,
          });

          // 若成功，直接跳轉到聊天室頁面
          if (response.status === 200) {
            const userInfo = response.data;
            localStorage.setItem('userInfo', JSON.stringify(userInfo)); // 將用戶資訊轉換為字串並儲存
          }
        } catch (error) {
          // 若驗證失敗，清除 Token
          Cookies.remove('access_token');
          Cookies.remove('token_type');
          localStorage.removeItem('userInfo'); // 清除本地儲存的用戶資訊
          console.error('Token 驗證失敗，已清除 Token:', error);
        }
      } else {
        alert('請重新登入。');
        this.logout();
      }
    },
    connectWebSocket() {
      this.ws = new WebSocket(`${this.$websocketUrl}/ws/chat/${this.currentUser}`);

      this.ws.onopen = () => {
        console.log('WebSocket 連線已建立');
      };

      this.ws.onmessage = (event) => {
        const receivedMessage = JSON.parse(event.data);
        this.messages.push(receivedMessage);

        this.$nextTick(() => {
          const messagesContainer = this.$el.querySelector('.messages');
          messagesContainer.scrollTop = messagesContainer.scrollHeight;
        });
      };

      this.ws.onclose = () => {
        console.log('WebSocket 連線已關閉');
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket 錯誤:', error);
      };
    },
    async sendMessage() {
      if (this.newMessage.trim() !== '') {
        try {
          const accessToken = Cookies.get('access_token');
          const tokenType = Cookies.get('token_type');

          await axios.post(
            `${this.$backendUrl}/chat`,
            {
              user_id: JSON.parse(localStorage.getItem('userInfo')).id,
              message: this.newMessage.trim(),
            },
            {
              headers: {
                Authorization: `${tokenType} ${accessToken}`,
              },
            }
          );

          this.newMessage = '';
          this.$nextTick(() => {
            const messagesContainer = this.$el.querySelector('.messages');
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
          });
        } catch (error) {
          if (error.response && error.response.status === 401) {
            alert('未經授權，請重新登入');
            this.logout();
          } else if (error.response && error.response.status === 404) {
            alert('用戶不存在，請檢查您的帳戶資訊');
            this.logout();
          } else if (error.response && error.response.status === 500) {
            alert('伺服器發生錯誤，請稍後再試');
          } else {
            console.error('訊息發送失敗:', error);
            alert('發送訊息失敗，請稍後再試');
          }
        }
      }
    },
    logout() {
      Cookies.remove('access_token');
      Cookies.remove('token_type');
      localStorage.removeItem('userInfo');
      this.$router.push('/login');
    },
    formatTimestamp(timestamp) {
      const date = new Date(timestamp);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    },
  },
};
</script>

<style scoped>
.chatroom {
  max-width: 600px;
  margin: 20px auto;
  color: #ecf0f1;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

h1 {
  text-align: center;
  flex: 1;
}

.logout-button {
  padding: 10px;
  font-size: 16px;
  cursor: pointer;
  background-color: #34495e;
  color: #ecf0f1;
  border: none;
  border-radius: 4px;
}

.logout-button:hover {
  background-color: #3b5998;
}

.messages {
  background-color: #1c2833;
  padding: 10px;
  height: 400px;
  overflow-y: auto;
  margin-bottom: 10px;
  border-radius: 0 0 8px 8px;
}

.message {
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
}

.message.self {
  align-items: flex-end;
}

.message.other {
  align-items: flex-start;
}

.message-content {
  max-width: 70%;
  padding: 10px;
  border-radius: 10px;
  color: #ecf0f1;
  word-wrap: break-word;
}

.self .message-content {
  background-color: #2ecc71;
  align-self: flex-end;
}

.other .message-content {
  background-color: #3498db;
  align-self: flex-start;
}

.message-header {
  display: flex;
  justify-content: space-between;
  font-size: 0.75em;
  margin-bottom: 4px;
}

.username {
  font-weight: bold;
}

.input-area {
  display: flex;
}

.input-area input {
  flex: 1;
  padding: 10px;
  font-size: 16px;
  border: none;
  border-radius: 4px 0 0 4px;
}

.input-area button {
  padding: 10px;
  font-size: 16px;
  cursor: pointer;
  border: none;
  border-radius: 0 4px 4px 0;
  background-color: #34495e;
  color: #ecf0f1;
}

.input-area button:hover {
  background-color: #3b5998;
}

.input-area input:focus,
.logout-button:focus,
.input-area button:focus {
  outline: none;
}
</style>
