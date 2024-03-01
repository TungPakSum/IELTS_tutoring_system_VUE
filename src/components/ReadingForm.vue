<template>
    <div>
      <h2>Add Reading Passage</h2>
      <form @submit.prevent="submitForm">
        <div class="mb-3">
          <label for="passageTitle" class="form-label">Passage Title</label>
          <input type="text" class="form-control" id="passageTitle" v-model="passage.title" required>
        </div>
        <div class="mb-3">
          <label for="passageContent" class="form-label">Passage Content</label>
          <textarea class="form-control" id="passageContent" v-model="passage.content" rows="5" required></textarea>
        </div>
        <h3>Add Multiple-Choice Questions</h3>
        <div v-for="(question, index) in questions" :key="index" class="mb-3">
          <h5>Question {{ index + 1 }}</h5>
          <div class="mb-2">
            <label for="questionText" class="form-label">Question Text</label>
            <input type="text" class="form-control" v-model="question.text" required>
          </div>
          <div class="mb-2">
            <label for="optionA" class="form-label">Option A</label>
            <input type="text" class="form-control" v-model="question.options[0]" required>
          </div>
          <div class="mb-2">
            <label for="optionB" class="form-label">Option B</label>
            <input type="text" class="form-control" v-model="question.options[1]" required>
          </div>
          <div class="mb-2">
            <label for="optionC" class="form-label">Option C</label>
            <input type="text" class="form-control" v-model="question.options[2]" required>
          </div>
          <div class="mb-2">
            <label for="optionD" class="form-label">Option D</label>
            <input type="text" class="form-control" v-model="question.options[3]" required>
          </div>
          <div class="mb-2">
            <label for="correctAnswer" class="form-label">Correct Answer</label>
            <select class="form-select" v-model="question.correctAnswer" required>
              <option value="">Select Correct Answer</option>
              <option v-for="(option, index) in question.options" :key="index" :value="index">{{ option }}</option>
            </select>
          </div>
          <button v-if="index === questions.length - 1" @click="addQuestion" type="button" class="btn btn-secondary">Add Additional Question</button>
        <hr v-if="index !== questions.length - 1">
        </div>
        <button type="submit" class="btn btn-primary">Save Passage</button>
      </form>
    </div>
  </template>
  
  <script>
  import { reactive } from 'vue';
  
  export default {
    setup() {
      const passage = reactive({
        title: '',
        content: ''
      });
  
      const questions = reactive([
        {
          text: '',
          options: ['', '', '', ''],
          correctAnswer: ''
        }
      ]);

      const addQuestion = () => {
      questions.push({
        text: '',
        options: ['', '', '', ''],
        correctAnswer: ''
      });
    };
  
      const submitForm = () => {
        // Here, you can send the passage and questions data to the backend for saving
        console.log(passage);
        console.log(questions);
      };

      const savePassage = async (passage) => {
        try {
            const response = await fetch(`/api/Reading/passages/save`, {
            method: "post",
            headers: {
                "Content-Type": "application/json",
                "x-access-token": `${localStorage.getItem("token")}`,
            },
            body: JSON.stringify(passage),
            });

            if (response.status === 201) {
            console.log("Passage saved successfully");
            } else {
            console.error("Error saving passage");
            }
        } catch (error) {
            console.error("Error saving passage:", error);
        }
        };

        const deletePassage = async (passageId) => {
        try {
            const response = await fetch(`/api/Reading/passages/delete/${passageId}`, {
            method: "delete",
            headers: {
                "x-access-token": `${localStorage.getItem("token")}`,
            },
            });

            if (response.ok) {
            console.log("Passage deleted successfully");
            } else {
            console.error("Error deleting passage");
            }
        } catch (error) {
            console.error("Error deleting passage:", error);
        }
        };

        const saveQuestion = async (passageId, question) => {
        try {
            const response = await fetch(`/api/Reading/passages/${passageId}/questions/save`, {
            method: "post",
            headers: {
                "Content-Type": "application/json",
                "x-access-token": `${localStorage.getItem("token")}`,
            },
            body: JSON.stringify(question),
            });

            if (response.status === 201) {
            console.log("Question saved successfully");
            } else {
            console.error("Error saving question");
            }
        } catch (error) {
            console.error("Error saving question:", error);
        }
        };

        const deleteQuestion = async (questionId) => {
        try {
            const response = await fetch(`/api/Reading/questions/delete/${questionId}`, {
            method: "delete",
            headers: {
                "x-access-token": `${localStorage.getItem("token")}`,
            },
            });

            if (response.ok) {
            console.log("Question deleted successfully");
            } else {
            console.error("Error deleting question");
            }
        } catch (error) {
            console.error("Error deleting question:", error);
        }
        };

        const getPassages = async () => {
        try {
            const response = await fetch(`/api/Reading/passages`, {
            headers: {
                "x-access-token": `${localStorage.getItem("token")}`,
            },
            });

            if (response.ok) {
            const data = await response.json();
            const passages = data.passages;
            console.log(passages);
            // Handle the fetched passages data as needed
            } else {
            console.error("Error fetching passages");
            }
        } catch (error) {
            console.error("Error fetching passages:", error);
        }
        };
  
      return {
        passage,
        questions,
        addQuestion,
        submitForm
      };
    }
  };
  </script>
  
  <style scoped>
  /* Add your custom Bootstrap 5 styles here */
  </style>