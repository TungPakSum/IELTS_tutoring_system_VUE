<template>
  <div class="row" >
    <div class="col">
      <div class="chatbot-interface flex-grow-1 mt-5 mb-5">
        <div class="chat-container">
          <div
            v-for="message in chatMessages"
            :key="message.id"
            class="message mb-3"
          >
            <div
              :class="{
                'user-message bg-warning text-black rounded p-3':
                  message.isUser,
                'chatbot-message bg-info text-black rounded p-3':
                  !message.isUser,
              }"
              style="white-space: pre-wrap"
            >
              <div class="text-break">
                {{
                  message.isUser
                    ? message.content
                    : "Your English Tutor: \n " + message.content
                }}
              </div>
            </div>
          </div>
          <div class="message mb-3">
            <button
              @click="generateNewWritingTask"
              class="btn btn-outline-secondary bi-arrow-right mt-5"
            >
              Generate a new writing task
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="row">
    <div class="col">
      <div class="user-input fixed-bottom bg-light mt-3">
        <div class="container py-3">
          <div class="row">
            <div class="col">
              <textarea
                ref="textarea"
                v-model="userMessage"
                @input="resizeTextarea"
                type="text"
                class="input-field rounded"
                placeholder="Type your writing here..."
              ></textarea>
            </div>
            <div class="col-auto">
              <button
                @click="sendMessage"
                class="btn bi-send btn-lg"
                :disabled="userMessage.trim() === ''"
              >
                Send
              </button>
              <button
                @click="deleteMessage"
                class="btn bi-trash btn-lg"
                :disabled="chatMessages.length === 0"
              >
                Delete chats
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
document.title = "Writing practice";
import { ref, onMounted } from "vue";
import axios from "axios";
import JwtDecode from "jwt-decode";

export default {
  name: "ChatbotInterface",
  setup() {
    const chatMessages = ref([]);
    const userMessage = ref("");
    const apiKey = `${process.env.VUE_APP_OPENAI_API_KEY}`;
    
    //const basicUrl = (
    //  <a
    //    href="https://chatgpt.hkbu.edu.hk/general/rest"
    //    class="underline"
    //    target="_blank"
    //  >
    //    Click this URL
    //  </a>
    //);
    //const modelName = "gpt-35-turbo-16k";
    //const apiVersion = "2023-08-01-preview";
    const conversation = ref([]);
    const user = ref();

    function Prompt() {
      const prompt = `You role is a IELTS english tutor, you should only answer topic related to english or IELTS, refuse to answer other irrelatant questions
          Generate an IETLS writing task 2 and the requirement (word count)for the user to practice with
          (Do not respond with the sentence Sure!I can ..., just generate the task right away)`

      conversation.value.push({
        role: "system",
        content: prompt
      });

      saveMessage(prompt, "system");
    }

    function generateNewWritingTask() {
      Prompt();
      sendMessage();
    }

    function PromptAfterSend() {
      const prompt = `Check if the previous message is a piece of writing. If Yes, then check if the content of the writing align with the task you have given. If yes, give detail analysis to the user's writing as an IELTS English Tutor. Analysis base on Grammatical range and accuracy, Lexical resource, task response and Coherence and cohesion. Quote specify section in the writing for further explaination and suggest which part can improve. If the writing is out of scope, ask user to write again . If the message is not a writing, refuse the request and you should only answer english base question`;
      conversation.value.push({
        role: "system",
        content: prompt,
      });

      saveMessage(prompt, "system");
    }

    const checkUserToken = async function () {
      const response = await fetch(`/api/users/check`, {
        headers: {
          "x-access-token": `${localStorage.getItem("token")}`,
        },
      });
      if (response.status === 401) {
        alert("session time out");
        location.assign("/login");
      } else if (response.status === 403) {
        alert(response.statusText);
        history.back();
      }
    };

    const resizeTextarea = (event) => {
      const textarea = event.target;
      console.log("s");
      textarea.style.overflow = "hidden";
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "px";
    };

    const saveMessage = async (messageText, role) => {
      try {
        const response = await fetch(`/api/chats/save`, {
          method: "post",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": `${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            uid: user.value._id,
            content: messageText,
            role: role,
          }),
        });

        if (response.status === 201) {
          console.log("Message saved successfully");
        } else {
          console.error("Error saving message");
        }
      } catch (error) {
        console.error("Error saving message:", error);
      }
    };

    const deleteMessage = async function (event) {
      event.preventDefault();

      if (confirm("are you sure to delete all your chats?")) {
        const response = await fetch(`/api/chats/delete/${user.value._id}`, {
          method: "delete",
          headers: {
            "x-access-token": `${localStorage.getItem("token")}`,
          },
        });
        if (response.ok) {
          alert("message cleared");
          location.reload();
        } else {
          alert(response.statusText);
        }
      }
    };

    const getConversation = async () => {
      const response = await fetch(`/api/chats/get/${user.value._id}`, {
        headers: {
          "x-access-token": `${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        const data = await response.json();

        const savedConversation = data.conversations.map((chat) => ({
          role: chat.role,
          content: chat.content,
        }));
        console.log(savedConversation);
        if (savedConversation) {
          conversation.value = savedConversation;

          chatMessages.value = data.conversations
          .filter((chat) => chat.role !== "system") // Exclude "system" role chats
          .map((chat) => ({
            content: chat.content,
            isUser: chat.role === "user",
          }));
        }
      } else if (response.status === 404) {
        generateNewWritingTask();
      }
    };

    const fetchCurrentUser = async function () {
      if (localStorage.getItem("token") !== null) {
        const decodedToken = JwtDecode(localStorage.getItem("token"));
        user.value = decodedToken;
        console.log(user.value._id);
      }
    };

    const sendMessage = async (event) => {
      if (userMessage.value) {
        saveMessage(userMessage.value, "user");

        const message = userMessage.value;

        // Add user message to chat
        chatMessages.value.push({
          content: message,
          isUser: true,
        });

        userMessage.value = "";
        // Call ChatGPT API to get the bot's response
        // Replace 'YOUR_CHATGPT_API_ENDPOINT' with the actual API endpoint
        conversation.value.push({ role: "user", content: message });
        PromptAfterSend();
      }

      const url =
        "https://chatgpt.hkbu.edu.hk/general/rest/deployments/gpt-35-turbo/chat/completions?api-version=2024-02-15-preview";
      const headers = { "Content-Type": "application/json", "api-key": apiKey };
      console.log(JSON.stringify(conversation.value));
      const payload = { messages: conversation.value };

      try {
        const response = await axios.post(url, payload, { headers });
        if (response.status === 200) {
          const botResponse = response.data.choices[0].message.content;
          const botResponseWithLineBreaks = botResponse.replace(/\n/g, "\n\n");

          chatMessages.value.push({
            content: botResponseWithLineBreaks,
            isUser: false,
          });

          // Save bot response to the backend
          saveMessage(response.data.choices[0].message.content, "assistant");

          conversation.value.push(response.data.choices[0].message);
          return response.data;
        } else {
          console.error("Error:", error);
          chatMessages.value.push({
            id: Date.now(),
            content: "Unable to connect",
            isUser: false,
          });
        }
      } catch (error) {
        console.error("Error:", error);
        chatMessages.value.push({
          id: Date.now(),
          content: "Unable to connect",
          isUser: false,
        });
      }
    };

    onMounted(() => {
      checkUserToken();
      fetchCurrentUser();
      getConversation();
    });

    return {
      chatMessages,
      userMessage,
      sendMessage,
      userMessage,
      resizeTextarea,
      saveMessage,
      fetchCurrentUser,
      getConversation,
      deleteMessage,
      PromptAfterSend,
      Prompt,
      generateNewWritingTask,
      checkUserToken,
    };
  },
};
</script>
<style>
.chatbot-interface {
  overflow-y: auto;
  width: 100%;
  padding-bottom: 100px;
}

.chat-container {
  width: 90%;
  margin-left: 1%;
}

.input-field {
  overflow: hidden;
  width: 100%;
  min-height: 40px;
  padding: 10px;
  font-size: 14px;
}

.user-message {
  justify-content: flex-end;
}

.chatbot-message {
  justify-content: flex-start;
}
</style>
