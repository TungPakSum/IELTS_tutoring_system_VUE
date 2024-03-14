<template>
  <div class="mt-3">
    <h2>Read the following passage below, then answer all questions</h2>
    <div class="mb-3 " :style="{ 'white-space': 'pre-line' }">
      <h4>{{ passage.title }}</h4>
    </div>
    <div class="mb-3" :style="{ 'white-space': 'pre-line' }">{{ passage.content }}</div>
    <h3>Questions</h3>
    <form @submit.prevent="answersChecked? retryQuiz() : checkAnswers()">
      <div v-for="(question, qIndex) in questions" :key="qIndex" class="mb-3">
        <h5>Question {{ qIndex + 1 }}</h5>
        <p> {{question.text }}</p>
        <div v-for="(option, oIndex) in question.options" :key="oIndex">
          <input type="radio" :id="'option' + qIndex + '-' + oIndex" :name="'question' + qIndex" :value="oIndex" v-model="question.selectedAnswer" :disabled="answersChecked">
          <label :for="'option' + qIndex + '-' + oIndex" class = "m-1">{{option }}</label>
          <!-- Display hint next to the option if it is the selected answer and the answers have been checked -->
          <span v-if="showHints && question.correctAnswer == oIndex" class="m-1 bi bi-check2 text-success">
            Correct Answer
          </span>
          <span 
            v-if="showHints && question.selectedAnswer == oIndex && question.correctAnswer != oIndex" 
            class="m-1 bi bi-x-lg text-danger">
            Wrong Answer
          </span>
        </div>
      </div>
      <button type="submit" class="btn btn-primary m-2">{{ answersChecked ? 'Retry' : 'Check Answers' }}</button>
    </form>
  </div>
</template>
    
    <script>
    import { reactive, ref, onMounted } from 'vue';
    import { useRoute } from "vue-router";
    import decode from "jwt-decode";
    
    export default {
      setup() {
        const showHints = ref(false);
        const router = useRoute();
        const answersChecked = ref(false);
        const passage = reactive({
          _id: '',
          title: '',
          content: ''
        });
        const questions = ref([]);
    
        onMounted(async () => {
          checkUserToken();
          await fetchPassageAndQuestions(router.params.pid);
        });


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
    
        const fetchPassageAndQuestions = async (pid) => {
          // Fetch the passage and questions from the backend
          const headers = {
            "x-access-token": `${localStorage.getItem("token")}`,
          };
    
          try {
            const [passageResponse, questionsResponse] = await Promise.all([
              fetch(`/api/readings/get/${pid}`, { headers }),
              fetch(`/api/readings/getquestions/${pid}`, { headers })
            ]);
    
            if (passageResponse.ok && questionsResponse.ok) {
              const passageData = await passageResponse.json();
              const questionsData = await questionsResponse.json();
    
              passage.title = passageData.passage.title;
              passage.content = passageData.passage.content;
              passage._id = passageData.passage._id;
              questions.value = questionsData.questions.map(q => ({ ...q, selectedAnswer: null }));
            } else {
              // Handle errors
              throw new Error('Failed to fetch data');
            }
          } catch (error) {
            console.error(error);
          }
        };
    
        const checkAnswers = async () => {
          let score = questions.value.reduce((acc, question) => {
            return acc + (question.selectedAnswer === question.correctAnswer ? 1 : 0);
          }, 0);
          
          const scoreData = {
            pid: passage._id,
            uid: decode(localStorage.getItem("token"))._id,
            score: `${score}/${questions.value.length}`
          };
    
          // Send the score to the backend

          await fetch(`/api/scores/create`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-access-token': localStorage.getItem("token")
            },
            body: JSON.stringify(scoreData)
            
          });
    
          // Display score to the user
          alert(`Your score is ${score}/${questions.value.length}`);
          showHints.value = true;
          answersChecked.value = true;
          
        };

        const retryQuiz = () => {
          questions.value.forEach(question => {
            question.selectedAnswer = null;
          });
          answersChecked.value = false;
          showHints.value = false;
        };
    
        return {
          passage,
          questions,
          checkAnswers,
          showHints,
          retryQuiz,
          answersChecked
        };
      }
    };
    </script>