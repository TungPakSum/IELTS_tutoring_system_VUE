<template>
  <div class="practice-page">
    <div class="card-group">
      <div class="card">
        <img
          src="../assets/IELTS_writing_practice.png"
          class="card-img-top"
          alt="IELTS Writing Icon"
        />
        <div class="card-body">
          <h5 class="card-title">IELTS Writing Practice</h5>
          <p class="card-text">
            Practice your writing skills for the IELTS exam.
          </p>
          <button class="btn btn-primary" @click="startWritingPractice">
            Start Practice
          </button>
        </div>
      </div>

      <div class="card">
        <img
          src="../assets/IELTS_speaking_practice.png"
          class="card-img-top"
          alt="IELTS Speaking Icon"
        />
        <div class="card-body">
          <h5 class="card-title">IELTS Speaking Practice</h5>
          <p class="card-text">
            Improve your speaking skills for the IELTS exam.
          </p>
          <button class="btn btn-primary" @click="startSpeakingPractice">
            Start Practice
          </button>
        </div>
      </div>

      <div class="card">
        <img
          src="../assets/IELTS_reading_practice.png"
          class="card-img-top"
          alt="Reading Icon"
        />
        <div class="card-body">
          <h5 class="card-title">Reading Practice</h5>
          <p class="card-text">
            Enhance your reading skills for the IELTS exam.
          </p>
          <button class="btn btn-primary" @click="startReadingPractice">
            Start Practice
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  setup() {
    // Functions to handle button clicks
    const startWritingPractice = () => {
      window.location.assign(`/writing`);
      console.log("Start IELTS Writing Practice");
    };

    const startSpeakingPractice = () => {
      // Handle logic for starting IELTS speaking practice
      console.log("Start IELTS Speaking Practice");
    };

    const startReadingPractice = () => {
      // Handle logic for starting reading practice
      console.log("Start Reading Practice");
    };

    return {
      startWritingPractice,
      startSpeakingPractice,
      startReadingPractice,
    };
  },
};
</script>

<style>
.practice-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

.practice-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  margin-bottom: 20px;
  font-size: 20px;
  font-weight: bold;
  border-radius: 10px;
  cursor: pointer;
}
</style>
