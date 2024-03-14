<template>
    <div class ="mt-3">
      <h2>Reading Passage</h2>
      <form @submit.prevent="submit">
        <div class="mb-3">
          <label for="passageTitle" class="form-label">Passage Title</label>
          <input type="text" class="form-control" id="passageTitle" v-model="passage.title" required>
        </div>
        <div class="mb-3">
          <label for="passageContent" class="form-label">Passage Content</label>
          <textarea class="form-control" id="passageContent" v-model="passage.content" rows="5" required></textarea>
        </div>
        <h3>Multiple-Choice Questions</h3>
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

          
            <button v-if="index !== 0" @click="deleteQuestion(index)" type="button" class="btn btn-danger m-2 bi bi-dash-square"> Delete Question</button>
          

          <button v-if="index === questions.length - 1" @click="addQuestion" type="button" class="btn btn-secondary m-2 bi bi-plus-square"> Add Question</button>
        <hr v-if="index !== questions.length - 1">
        </div>
        <button type="submit" class="btn btn-primary m-2">Save Passage</button>
        <button type="button" class="btn btn-danger m-2" v-if="updateForm" @click="deletePassage(passage._id)">Delete Passage</button>
      </form>
    </div>
  </template>
  
  <script>
  import { reactive, onMounted, ref } from 'vue';
  import { useRoute } from "vue-router";
  import decode from "jwt-decode";
  import bcrypt from "bcryptjs";

  export default {
    setup() {

      let updateForm = ref(false);
      const path = ref("");
      const router = useRoute();
      

    
      const passage = ref({
        title: '',
        content: ''
      });
  
      const questions = ref([
        {
          text: '',
          options: ['', '', '', ''],
          correctAnswer: ''
        }
      ]);

      const addQuestion = () => {
      questions.value.push({
        text: '',
        options: ['', '', '', ''],
        correctAnswer: ''
      });
    };

    const deleteQuestion = function(index) {
      if (questions.value.length === 1) {
        // If there is only one question, clear its fields instead of deleting it
        questions.value[0] = {
          text: '',
          options: ['', '', '', ''],
          correctAnswer: '',
        };
      } else {
        // Delete the question from the questions array
        questions.value.splice(index, 1);
      }
    }

    onMounted(() => {
      if (router.params.pid) {
        console.log("yes")
        updateForm.value = true;
        fetchPage();
      }
      checkUserToken();
      checkUserType();
      getPath();
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

    const checkUserType = function () {
      const token = decode(localStorage.getItem("token"));
      if (token.role !== "admin") {
        alert("you do not have the premisson to access this page");
        history.back();
      }
    };


    const fetchPage = async function () {
      const response1 = await fetch(`/api/readings/get/${router.params.pid}`, {
        headers: {
          "x-access-token": `${localStorage.getItem("token")}`,
        },
      });

      const response2 = await fetch(`/api/readings/getquestions/${router.params.pid}`, {
        headers: {
          "x-access-token": `${localStorage.getItem("token")}`,
        },
      });
      if (response1.ok && response2.ok) {

        let data = await response1.json();
        passage.value = data.passage;
        console.log(passage);

        data = await response2.json();
        questions.value = data.questions;
        console.log(questions);
        
        
      } else {
        if (response1.status === 401 || response2.status === 401) {
          alert("session time out");
          location.assign("/login");
        } else if (response1.status === 403 || response2.status === 403) {
          alert(response1.statusText + ' ' + response2.statusText);
          history.back();
        } else alert(response1.statusText + ' ' + response2.statusText);
      }
    };

    

    const getPath = function () {
      let elements = router.path.split("/");
      path.value = "/" + elements[1];
      for (let i = 2; i < elements.length - 1; i++) {
        path.value += "/" + elements[i];
      }
    };

  
      

      

        const submit = async function(event) {
            event.preventDefault();
            if (!updateForm.value) {        //create
                // Insert Passage
                const response1 = await fetch(`/api/readings/create`, {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                    "x-access-token": `${localStorage.getItem("token")}`,
                },
                body: JSON.stringify(passage.value),
                });

                if (response1.ok) {
                const passageId = await response1.json(); // Retrieve the created passage ID

                // Bundle passageId in each question object
                const questionsWithPid = questions.value.map(question => ({
                    ...question,
                    pid: passageId, // Assign the passageId as the pid for each question
                }));

                // Insert Questions with passageId
                const response2 = await fetch(`/api/readings/createquestion`, {
                    method: "post",
                    headers: {
                    "Content-Type": "application/json",
                    "x-access-token": `${localStorage.getItem("token")}`,
                    },
                    body: JSON.stringify(questionsWithPid), // Send questions with pid included
                });

                if (response2.ok) {
                    alert("New passage and questions created successfully");
                    window.location.replace(path.value);
                } else {
                    alert("Error creating questions: " + response2.statusText);
                }
                } else {
                alert("Error creating passage: " + response1.statusText);
                }
            } else {                                 //update
                console.log(passage.value);
                let id = passage.value._id;
                delete passage.value._id;

                const response1 = await fetch(`/api/readings/update/${router.params.pid}`, {
                method: "put",
                headers: {
                    "Content-Type": "application/json",
                    "x-access-token": `${localStorage.getItem("token")}`,
                },
                body: JSON.stringify(passage.value),
                });


                const updatedQuestions = questions.value.map(({ _id, ...rest }) => rest); // remove all _id in all questions
                const response2 = await fetch(`/api/readings/updatequestion/${router.params.pid}`, {
                method: "put",
                headers: {
                    "Content-Type": "application/json",
                    "x-access-token": `${localStorage.getItem("token")}`,
                },
                body: JSON.stringify(updatedQuestions),
                });

                console.log(response1 + ' ' + response2);

                if (response1.ok && response2.ok) 
                {
                    alert("update passage and questions sucessfully");
                    window.location.replace(path.value);
                } else {
                    alert(response1.statusText + ' ' + response2.statusText);
                }
            }
            };
 
        const deletePassage = async function (id) {
            if (confirm("Are you sure to delete this passage?")) {
                const response = await fetch(`/api/readings/get/${id}/confirm/delete`, {
                method: "delete",
                body: JSON.stringify(passage.value),
                headers: {
                    "x-access-token": `${localStorage.getItem("token")}`,
                },
                });
                if (response.ok) {
                alert("Passage Deleted");
                window.location.replace(path.value);
                } else {
                alert(response.statusText);
                }
            } else {
                return;
            }
        };

        


        
  
      return {
        passage,
        questions,
        addQuestion,
        updateForm,
        submit,
        deletePassage,
        deleteQuestion
      };
    }
  };
  </script>
  
  <style scoped>
  /* Add your custom Bootstrap 5 styles here */
  </style>