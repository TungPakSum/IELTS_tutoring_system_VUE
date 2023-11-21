<template>
  <div>
    <div class="chatbox">
      <div v-for="message in messages" :key="message.id" class="message">
        <div v-if="message.isBot" class="bot-message">{{ message.text }}</div>
        <div v-else class="user-message">{{ message.text }}</div>
      </div>
    </div>
    <form @submit.prevent="sendMessage">
      <input v-model="userInput" type="text" placeholder="Type your message..." required />
      <button type="submit">Send</button>
    </form>
  </div>
</template>

<script>
import { ref } from 'vue';
import axios from 'axios';

export default {
  setup() {
    const messages = ref([]);
    const userInput = ref('');

    const sendMessage = async () => {
      const userMessage = userInput.value;

      if (userMessage.trim() === '') {
        return;
      }

      messages.value.push({ text: userMessage, isBot: false });
      userInput.value = '';

      try {
        const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          messages: [{ role: 'system', content: 'You are a helpful assistant.' }, { role: 'user', content: userMessage }],
          max_tokens: 50,
        },
        {
          headers: {
            'Authorization': 'Bearer f0fd7c6f-6f19-41a3-8ec5-3226114e26c1',
            'Content-Type': 'application/json',
          },
        }
      );

        const botReply = response.data.choices[0].text.trim();
        messages.value.push({ text: botReply, isBot: true });
      } catch (error) {
        console.error(error);
        messages.value.push({ text: 'Error occurred while fetching bot response.', isBot: true });
      }
    };

    return {
      messages,
      userInput,
      sendMessage,
    };
  },
};
</script>

<style>
.chatbox {
  height: 300px;
  overflow-y: scroll;
  border: 1px solid #ccc;
  padding: 10px;
}

.message {
  margin-bottom: 10px;
}

.bot-message {
  background-color: #eee;
  padding: 5px;
}

.user-message {
  background-color: #f0f0f0;
  padding: 5px;
}

form {
  margin-top: 10px;
}

input[type="text"] {
  width: 80%;
  padding: 5px;
}

button {
  padding: 5px 10px;
}
</style>