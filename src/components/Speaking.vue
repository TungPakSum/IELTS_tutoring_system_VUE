<template>
  <div class="row">
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

              <button
                @click="startSpeechToText"
                class="btn bi-mic btn-lg"
                :disabled="isRecording"
              >
                Speak
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
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

    const isRecording = ref(false);
    const recognition = new webkitSpeechRecognition();
    const utterance = new SpeechSynthesisUtterance();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    const startSpeechToText = () => {
      isRecording.value = true;
      recognition.start();
    };

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0])
        .map((result) => result.transcript)
        .join("");
      userMessage.value = transcript;
    };

    recognition.onend = () => {
      isRecording.value = false;
      // Automatically send the message when the user stops talking
      sendMessage();
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error", event.error);
      isRecording.value = false;
    };

    function Prompt() {
      conversation.value.push({
        role: "system",
        content: `You role is a IELTS speaking examiner, you should only answer response related to IELTS speaking, refuse to answer other irrelatant questions
          Ask question in the actual IELTS speaking including part 1 and part 2 one by one, then let the user answer it, the exam should last for 10mins and you should a lot of question.
          (Do not respond with point form skip the question number, just ask the question right away)`,
      });
    }

    function generateNewWritingTask() {
      Prompt();
      sendMessage();
    }

    function systemMessage() {
      console.log(systemPrompt);
      conversation.value.push({
        role: "system",
        content: systemPrompt,
      });
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

          chatMessages.value = data.conversations.map((chat) => ({
            content: chat.content,
            isUser: chat.role === "user" ? true : false,
          }));
        }
      } else if (response.status === 404) {
        firstPrompt();
        sendMessage();
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
          //id: Date.now(),
          content: message,
          isUser: true,
        });

        userMessage.value = "";
        // Call ChatGPT API to get the bot's response
        // Replace 'YOUR_CHATGPT_API_ENDPOINT' with the actual API endpoint
        conversation.value.push({ role: "user", content: message });
        prompt();
      }

      const url =
        "https://chatgpt.hkbu.edu.hk/general/rest/deployments/gpt-35-turbo-16k/chat/completions?api-version=2023-08-01-preview";
      const headers = { "Content-Type": "application/json", "api-key": apiKey };
      console.log(JSON.stringify(conversation.value));
      const payload = { messages: conversation.value };

      try {
        const response = await axios.post(url, payload, { headers });
        if (response.status === 200) {
          const botResponse = response.data.choices[0].message.content;
          const botResponseWithLineBreaks = botResponse.replace(/\n/g, "\n\n");

          chatMessages.value.push({
            //id: Date.now(),
            content: botResponseWithLineBreaks,
            isUser: false,
          });

          // Save bot response to the backend
          saveMessage(response.data.choices[0].message.content, "assistant");

          conversation.value.push(response.data.choices[0].message);

          const sentences =
            response.data.choices[0].message.content.split("/n "); // Split the completion into sentences
          const delay = 2000; // Delay between playing each sentence in milliseconds

          for (const sentence of sentences) {
            utterance.text = sentence.trim();
            utterance.lang = "en-UK";
            const voices = speechSynthesis.getVoices();
            utterance.voice = voices[1];
            

            // Play the sentence
            speechSynthesis.speak(utterance);

            // Wait for the sentence to finish before playing the next one
            await new Promise((resolve) => setTimeout(resolve, delay));
          }

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
      systemMessage,
      Prompt,
      generateNewWritingTask,
      checkUserToken,
      isRecording,
      startSpeechToText,
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
