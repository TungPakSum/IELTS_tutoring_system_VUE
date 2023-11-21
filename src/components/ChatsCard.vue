<template>
  <div class="chatbot-interface">
    <div class="chat-container">
      <div v-for="message in chatMessages" :key="message.id" class="message">
        <div class="message-content" :class="{'user-message': message.isUser}">
          {{ message.content }}
        </div>
      </div>
    </div>
    <div class="user-input">
      <input v-model="userMessage" @keydown.enter="sendMessage" type="text" class="form-control" placeholder="Type your message here..." />
      <button @click="sendMessage" class="btn btn-primary">Send</button>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import axios from 'axios';

export default {
  name: 'ChatbotInterface',
  setup() {
    const chatMessages = ref([]);
    const userMessage = ref('');

    const sendMessage = async () => {
      if (userMessage.value) {

        const message = userMessage.value;
        // Add user message to chat
        chatMessages.value.push({ id: Date.now(), content: message, isUser: true });
        userMessage.value = '';

        // Call ChatGPT API to get the bot's response
        // Replace 'YOUR_CHATGPT_API_ENDPOINT' with the actual API endpoint
        try {
          console.log(message)
          await new Promise(resolve => setTimeout(resolve, 1000));
          const response = await axios.post('https://chatgpt.hkbu.edu.hk/general/rest/deployments/gpt-35-turbo-16k/chat/completions?api-version=2023-08-01-preview', {
            model: 'gpt-3.5-turbo',
            messages: "i"
          }, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${process.env.VUE_APP_OPENAI_API_KEY}`
            }
          });

          const data = response.data;

          // Add bot's response to chat
          chatMessages.value.push({ id: Date.now(), content: data.choices[0].message.content, isUser: false });
        } catch (error) {
          console.error('Error:', error);
          chatMessages.value.push({ id: Date.now(), content: 'Error occurred', isUser: false });
        }
      }
    };

    return {
      chatMessages,
      userMessage,
      sendMessage
    };
  }
};
</script>

<style scoped>
.chatbot-interface {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.chat-container {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
}

.message {
  margin-bottom: 10px;
}

.message-content {
  padding: 8px;
  border-radius: 8px;
  background-color: #f2f2f2;
}

.user-message {
  align-self: flex-end;
  background-color: #c1f0c1;
}

.user-input {
  display: flex;
  align-items: center;
  padding: 10px;
  border-top: 1px solid #ccc;
}

.user-input input {
  flex: 1;
  padding: 8px;
  border-radius: 4px;
  margin-right: 10px;
}

.user-input button {
  padding: 8px 16px;
  border-radius: 4px;
}
</style>