<template>
  <div class="row">
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
  <!-- <div class="card-group row"> -->
  <!-- <div
      v-for="item in items"
      :key="item"
      class="col-sm-4"
    > -->
  <!-- <div class="card"> -->
  <!-- <div class="card-body"> -->
  <!-- <h5 class="card-title">
            {{ item.username }}
          </h5>
          <p class="card-text">
            {{ item.role }}
          </p> -->
  <!-- <p
            v-if="item.role==='admin'"
            class="card-text"
          >
            {{ item.role }}
          </p> -->
  <!-- <router-link
            v-slot="{ navigate }"
            :to="`/${item.role}/${item._id}`"
            custom
          > -->
  <!-- <a
              href="#"
              class="btn btn-primary"
              @click="navigate"
            >編緝</a>
          </router-link> -->
  <!--           <a href="#" class="btn btn-danger" @click="deleteUsers(item._id)"
            >刪除</a
          > -->
  <!-- </div> -->
  <!-- </div> -->
  <!-- </div> -->
  <!-- </div> -->
  <div class="row">
    <div
      v-for="item in resultItems"
      :key="item"
      class="card testimonial-card col-sm-2 flex"
      style="padding: 0px"
    >
      <div class="card-up aqua-gradient" />
      <div class="avatar mx-auto white">
        <router-link
          v-slot="{ navigate }"
          :to="`/${item.role}/${item._id}`"
          custom
        >
          <img
            src="../assets/userIcon.png"
            class="rounded-circle img-fluid"
            alt="woman avatar"
            @click="navigate"
          />
        </router-link>
      </div>
      <div class="card-body text-center">
        <h4 class="card-title font-weight-bold">
          {{ item.username }}
        </h4>
        <hr />
        <p v-if="item.role === 'admin'">Admin Account</p>
        <p v-if="item.role === 'student'">Student Account</p>
      </div>
    </div>
  </div>

  <div class="pagination-group row">
    <nav aria-label="Page navigation example">
      <ul class="pagination">
        <li class="page-item">
          <a class="page-link" href="#" aria-label="Previous">
            <span aria-hidden="true">&laquo;</span>
          </a>
        </li>
        <li
          v-for="i in pages.slice(currentFirstPage, currentLastPage)"
          :key="i"
          class="page-item"
        >
          <a class="page-link" @click="fetchPage(i)">{{ i }}</a>
        </li>
        <li class="page-item" @click="nextPage(i)">
          <a class="page-link" aria-label="Next">
            <span aria-hidden="false">&raquo;</span>
          </a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";

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
            item.username.toLowerCase().indexOf(Search.value.toLowerCase()) !==
              -1 ||
            item.role.toLowerCase().indexOf(Search.value.toLowerCase()) !== -1
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
      let userType = router.path.split("/")[1];
      const response = await fetch(
        `/api/users/get/role/${userType}?perPage=${perPage.value}&page=${page}`,
        {
          headers: {
            "x-access-token": localStorage.getItem("token"),
          },
        }
      );
      currentPage.value = page;
      if (response.ok) {
        let data = await response.json();
        items.value = data.items;
        lastPage.value = data.pages;
      } else {
        if (response.status === 401) {
          alert("session time out");
          location.assign("/login");
        } else if (response.status === 403) {
          alert("You do not have the premisson to access this page");
          history.back();
        } else alert(response.send);
      }
    };

    const createUsers = async function (id) {
      const response = await fetch(`/api/users/create/${id}`, {
        method: "post",
        body: JSON.stringify(items.value),
      });
      if (response.ok) {
        alert("Users created!");
        location.assign("/users");
      } else {
        alert(response.statusText);
      }
    };

    const deleteUsers = async function (id) {
      const response = await fetch(`/api/users/delete/${id}`, {
        method: "delete",
        body: JSON.stringify(items.value),
      });
      if (response.ok) {
        alert("Users deleted");
        location.assign("/users");
      } else {
        alert(response.statusText);
      }
    };

    // eslint-disable-next-line no-unused-vars
    const pagination = async function (page) {};

    const nextPage = (currentPage) => {
      fetchPage(currentPage);
      currentFirstPage.value += 3;
      currentLastPage.value += 3;
    };

    //     const filterItems = async function (searchText) {
    //       if (searchText) {

    //         const searchTokens = searchText.toLowerCase().split(" ");

    //         // const searchTextLower = searchText.replaceAll(" ", "").toLowerCase();
    //         // alert(searchTextLower)
    //         const filteredItems = itemsWithoutPages.value.filter((item) => {
    //           for(let t in searchTokens) {
    //             if(item.username.toLowerCase().indexOf(searchTokens[t]) !== -1
    //               || item.email.toLowerCase().indexOf(searchTokens[t]) !== -1
    //               || item.role.toLowerCase().indexOf(searchTokens[t]) !== -1) {
    //               return true
    //             }
    //           }
    //           return false

    //         // return true
    // //           return (
    // // /*             item["name"]
    // //               .replaceAll(" ", "")
    // //               .toLowerCase()
    // //               .includes(searchTextLower) || */
    // //             item.username
    // //               .replaceAll(" ", "")
    // //               .toLowerCase()
    // //               .includes(searchTextLower)
    // //           );
    //         });
    //         // alert(JSON.stringify(items.value))
    //         items.value = filteredItems;
    //         lastPage.value = items.value.length / perPage.value;
    //       } else if (searchText === "") {
    //         console.log(currentPage);
    //         await fetchPage(currentPage.value);
    //       }
    //     };

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
      deleteUsers,
      createUsers,
      //filterItems,
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
