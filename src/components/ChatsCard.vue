<template>
  <div class="row">
    <div class="col">
      <div class="chatbot-interface flex-grow-1 mt-5">
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

    function systemMessage() {
      conversation.value.push({
        role: "system",
        content: `You role is a IELTS english tutor, you should only answer topic related to english or IELTS, refuse to answer other irrelatant questions
        This is the marking scheme for IELTS writing task:
          1. Task Achievement (TA) = how well you answer the question.
              To increase score for TA:

              present the information accurately
              answer all parts of the task
              provide a clear overview
              give a clear position, have a definite opinion

          2. Coherence and Cohesion (CC) = how well is your text structured.
              To increase score for CC:

              manage paragraphing
              make sure that each paragraph has a central idea
              use linking words and cohesive devices (firstly, in contrast, thus, in my opinion, to sum up etc)

          3.Lexical Resource (LR) = how good is your vocabulary.
              To increase score for LR:

              use a wide range of vocabulary
              use less common lexical items
              avoid errors in spelling and word formation

          4.Grammatical Range and Accuracy (GRA) = how good is your grammar.
              To increase score for GRA:

              use a wide range of grammatical structures and tenses
              manage punctuation
              avoid errors in sentences

          IELTS Writing score calculation
          Each of these four criteria receives a score from 0 to 9 points. After that, an arithmetic mean is calculated to determine the task's total score.

          For example, if it gets following marks:

          Task Achievement: 6.0,
          Coherence and Cohesion: 7.5,
          Lexical Resource: 7.0,
          Grammatical Range and Accuracy - 7.5.
          then score is (6.0+7.5+7.0+7.5)/4 =7.0.

          Generate any IETLS writing task for the user to practice with, then give a band score base on the above marking scheme
          (Do not respond with the sentence Sure!I can ..., just generate the task right away)
          Do not hesitate to give extremely low mark to writing that are low in word count or out of topic
          (Do not respond with a sample writing unless the user told to, focus on the writing that the user had respond)`,
      });
    }

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
        console.error("no message found");
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
        systemMessage();
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
      fetchCurrentUser();
      getConversation();
      systemMessage();
      sendMessage();
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
