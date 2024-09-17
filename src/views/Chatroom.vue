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
          <span class="username">{{ message.username }}</span>：
          <span class="text">{{ message.text }}</span>
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
export default {
  name: 'Chatroom',
  data() {
    return {
      currentUser: 'admin', // 暫定寫死為 'admin'
      newMessage: '',
      messages: [
        { username: 'Howard', text: '你好，大家好！' },
        { username: 'Kunling', text: '今天過得怎麼樣？' },
        { username: 'admin', text: '一切順利，謝謝關心。' },
      ],
    };
  },
  methods: {
    sendMessage() {
      if (this.newMessage.trim() !== '') {
        this.messages.push({
          username: this.currentUser,
          text: this.newMessage.trim(),
        });
        this.newMessage = '';
        // 自動滾動到最新訊息
        this.$nextTick(() => {
          const messagesContainer = this.$el.querySelector('.messages');
          messagesContainer.scrollTop = messagesContainer.scrollHeight;
        });
      }
    },
    logout() {
      // 清除本地存儲的使用者資料（如果有）
      localStorage.removeItem('username');
      // 導向登入頁面
      this.$router.push('/login');
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
  background-color: #34495e;
  padding: 10px;
  height: 400px;
  overflow-y: auto;
  margin-bottom: 10px;
  border-radius: 8px;
}

.message {
  margin-bottom: 10px;
}

.message.self .message-content {
  text-align: right;
}

.message.other .message-content {
  text-align: left;
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
