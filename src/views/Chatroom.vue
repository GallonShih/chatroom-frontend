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
      currentUser: localStorage.getItem('username') || 'admin', // Retrieve stored username or fallback to 'admin'
      newMessage: '',
      messages: [],
      ws: null,
    };
  },
  created() {
    // Connect to WebSocket server when the component is created
    this.connectWebSocket();
  },
  beforeDestroy() {
    // Close WebSocket connection when the component is destroyed
    if (this.ws) {
      this.ws.close();
    }
  },
  methods: {
    connectWebSocket() {
      this.ws = new WebSocket('ws://localhost:8080');

      this.ws.onopen = () => {
        console.log('WebSocket connection established');
      };

      this.ws.onmessage = (event) => {
        const receivedMessage = JSON.parse(event.data);
        this.messages.push(receivedMessage);

        // Auto scroll to the latest message
        this.$nextTick(() => {
          const messagesContainer = this.$el.querySelector('.messages');
          messagesContainer.scrollTop = messagesContainer.scrollHeight;
        });
      };

      this.ws.onclose = () => {
        console.log('WebSocket connection closed');
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    },
    sendMessage() {
      if (this.newMessage.trim() !== '') {
        const messageData = {
          username: this.currentUser,
          text: this.newMessage.trim(),
        };

        // Send message through WebSocket
        this.ws.send(JSON.stringify(messageData));

        // Add the message to the local messages list (for immediate feedback)
        this.messages.push(messageData);
        this.newMessage = '';

        // Auto scroll to the latest message
        this.$nextTick(() => {
          const messagesContainer = this.$el.querySelector('.messages');
          messagesContainer.scrollTop = messagesContainer.scrollHeight;
        });
      }
    },
    logout() {
      // Clear stored username
      localStorage.removeItem('username');
      // Redirect to login page
      this.$router.push('/login');
    },
  },
};
</script>

<style scoped>
/* Styles remain unchanged */
</style>
