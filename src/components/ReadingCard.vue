<template>
  <div class="row mt-4">
    <div class="col-12 p-3 searchBox">
      <input
        id="form1"
        v-model="Search"
        type="search"
        class="form-control"
        placeholder="Search"
      />
    </div>
  </div>
  <div class="row">
    <div
      v-for="(item, index) in resultItems"
      :key="item._id"
      class="col-md-6 col-lg-4 mb-4 d-flex align-items-stretch"
    >
      <div class="card testimonial-card w-100">
        <div class="card-up aqua-gradient"></div>
        <div class="avatar mx-auto white">
          <img
            src="../assets/bookIcon.png"
            class="rounded-circle img-fluid"
            alt="Book icon"
          />
        </div>
        <div class="card-body text-center">
          <!-- Reading Practice Index -->
          <p class="fw-bold fs-3">Reading Practice {{ index + 1 }}</p>
          <!-- Passage Title -->
          <h4 class="card-title font-weight-bold fs-5">
            {{ item.title }}
          </h4>
          <hr/>
          <div class="card-footer" v-if="item.score">
            Your Score: {{ item.score }}
          </div>
          <!-- Start Practice Button -->
          <router-link :to="`/reading/${item._id}`" class="btn btn-primary btn-block mt-3">Start Practice</router-link>
        </div>
      </div>
    </div>
  </div>

  <!-- Pagination -->
  <div class="pagination-group row justify-content-center">
    <nav aria-label="Page navigation example">
      <ul class="pagination">
        <li class="page-item" @click="previousPage">
          <a class="page-link" href="#" aria-label="Previous">
            <span aria-hidden="true">&laquo;</span>
          </a>
        </li>
        <li
          v-for="i in pages.slice(currentFirstPage, currentLastPage)"
          :key="i"
          :class="['page-item', { active: currentPage === i }]"
        >
          <a class="page-link" href="#" @click.prevent="fetchPage(i)">
            {{ i }}
          </a>
        </li>
        <li class="page-item" @click="nextPage">
          <a class="page-link" href="#" aria-label="Next">
            <span aria-hidden="true">&raquo;</span>
          </a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import JwtDecode from "jwt-decode";

export default {
  setup: function () {
    const lastPage = ref(0);
    const perPage = ref(6);
    const router = useRoute();
    let currentFirstPage = ref(1);
    let currentLastPage = ref(3);
    let currentPage = ref();
    let items = ref([]);
    let Search = ref();

    onMounted(function () {
      fetchPage(1);
      currentFirstPage.value = 0;
      currentLastPage.value = 3;
    });

    const resultItems = computed(() => {
      if (Search.value) {
        return items.value.filter((item) => {
          console.log(item);
          return (
            item.title.toLowerCase().indexOf(Search.value.toLowerCase()) !==
              -1 
          );
          // || item.email.toLowerCase().indexOf(Search.value.toLowerCase()) !== -1
        });
      }
      return items.value;
    });

    const pages = computed(() => {
      let pages = [];
      for (let i = 1; i <= lastPage.value; i++) {
        pages.push(i);
      }
      return pages;
    });

    const fetchPage = async function (page) {
      const response = await fetch(
        `/api/readings/getall/perPage=${perPage.value}/page=${page}`,
        {
          method: 'GET',
          headers: {
            "x-access-token": localStorage.getItem("token"),
          },
        }
      );
      currentPage.value = page;
      if (response.ok) {
        let data = await response.json();
        let userId = JwtDecode(localStorage.getItem("token"))._id; 

        let passagesWithScores = await Promise.all(data.passages.map(async (passage) => {
          const scoreResponse = await fetch(`/api/scores/getByUserAndPassage/${userId}/${passage._id}`, {
            method: 'GET',
            headers: {
              "x-access-token": localStorage.getItem("token"),
            },
          });
          if (scoreResponse.ok) {
            const scoreData = await scoreResponse.json();
            return { ...passage, score: scoreData.score.score }; // Assume scoreData contains score information
          } else {
            return { ...passage, score: null }; // Default to null if score can't be fetched
          }
        }));

        items.value = passagesWithScores;
        lastPage.value = data.pages;
      } else {
        // Handle other HTTP errors
      }
    };

  


    // eslint-disable-next-line no-unused-vars
    const pagination = async function (page) {};

    const nextPage = (currentPage) => {
      fetchPage(currentPage);
      currentFirstPage.value += 3;
      currentLastPage.value += 3;
    };

    

    const test = function (page) {
      fetchPage(page);
      console.log(page);
    };

    return {
      items,
      Search,
      pages,
      currentFirstPage,
      currentLastPage,
      fetchPage,
      nextPage,
      pagination,
      test,
      currentPage,
      resultItems,
    };
  },
};
</script>

<style scoped>
.pagination-group {
  margin-top: 20px;
}

.card {
  /* <<<<<<< HEAD */
  margin: 10px;
}

body {
  background-color: #f5f7fa;
}

.testimonial-card .card-up {
  height: 120px;
  overflow: hidden;
  border-top-left-radius: 0.25rem;
  border-top-right-radius: 0.25rem;
}

.aqua-gradient {
  background: linear-gradient(40deg, #2096ff, #05ffa3) !important;
}

.card-footer {
  margin-top: 0;
}


.testimonial-card .avatar {
  width: 120px;
  margin-top: -60px;
  overflow: hidden;
  border: 5px solid #fff;
  border-radius: 50%;
  /* ======= */
  margin-bottom: 10px;
  /* >>>>>>> fa756739e5a8d40c680b0bed8f025463ddd8a7db */
}
</style>
