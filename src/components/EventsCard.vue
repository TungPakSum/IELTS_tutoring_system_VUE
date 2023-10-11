<template>
  <div class="row">
    <div
      v-for="item in items"
      :key="item"
      class="col-lg-3 col-md-4 col-sm-6 col-xs-12"
    >
      <div class="tile">
        <div class="wrapper">
          <div class="header">
            {{ item.name }}
          </div>
          <div class="banner-img">
            <img
              src="http://via.placeholder.com/640x360"
              alt="Image 1"
            >
          </div>
          <!-- <h6 class="card-subtitle mb-2 text-muted"> -->
          <div class="dates">
            <strong>DATE: </strong> {{ item.date }}
          </div>
          <p class="card-text">
            {{ item.description }}
          </p>
        </div>
        <br>
        <!-- <ul class="list-group list-group-flush"> -->
        <div class="stats">
          <!-- <li class="list-group-item">賣旗地點: {{ item.location.name }}</li> -->
          <div><STRONG>賣旗地點: </STRONG> {{ item.location.name }}</div>

          <!-- <li class="list-group-item">旗袋總數: {{ item.numOfBags }}</li> -->
          <!-- <div><STRONG>旗袋總數: </STRONG> {{ item.numOfBags }}</div> -->
        </div>
        <!-- </ul> -->
        <div class="footer">
          <router-link
            v-slot="{ navigate }"
            :to="`/events/${item._id}/stations`"
            custom
          >
            <a
              class="btn btn-success"
              @click="navigate"
            >旗站</a>
          </router-link>
          <router-link
            v-slot="{ navigate }"
            :to="`/events/${item._id}`"
            custom
          >
            <a
              class="btn btn-success"
              @click="navigate"
            >編緝</a>
          </router-link>
        </div>
      </div>
    </div>
  </div>

  <div class="pagination-group row">
    <nav aria-label="Page navigation example">
      <ul class="pagination">
        <li class="page-item">
          <a
            class="page-link"
            href="#"
            aria-label="Previous"
          >
            <span aria-hidden="true">&laquo;</span>
          </a>
        </li>
        <li
          v-for="i in pages.slice(currentFirstPage, currentLastPage)"
          :key="i"
          class="page-item"
        >
          <a
            class="page-link"
            @click="fetchPage(i)"
          >{{ i }}</a>
        </li>
        <li
          class="page-item"
          @click="nextPage(i)"
        >
          <a
            class="page-link"
            aria-label="Next"
          >
            <span aria-hidden="false">&raquo;</span>
          </a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
import { computed, onMounted, ref } from "vue";

export default {
  name: "EventsCard",
  setup: function () {
    const lastPage = ref(0);
    const perPage = ref(6);
    const items = ref([]);
    const user = ref({});
    let currentFirstPage = ref(1);
    let currentLastPage = ref(3);

    onMounted(function () {
      fetchPage(1);
      currentFirstPage.value = 0;
      currentLastPage.value = 3;
    });

    const pages = computed(() => {
      let pages = [];
      for (let i = 1; i <= lastPage.value; i++) {
        pages.push(i);
      }
      return pages;
    });

    const fetchPage = async function (page) {
      let token = localStorage.getItem("token");
      const response = await fetch(
        `/api/events/get?perPage=${perPage.value}&page=${page}`,
        {
          headers: {
            "x-access-token": token,
          },
        }
      );
      if (response.ok) {
        console.log(response.status);
        let data = await response.json();
        user.value = data.user;
        items.value = data.items;
        lastPage.value = data.pages;
      } else {
        if (response.status === 401) {
          alert(response.statusText);
          location.assign("/login");
        } else if (response.status === 403) {
          alert(response.statusText);
          history.back()
        } else
          alert(response.statusText);
      }
    };

    const nextPage = (currentPage) => {
      fetchPage(currentPage);
      currentFirstPage.value += 3;
      currentLastPage.value += 3;
    };

    return {
      items,
      pages,
      currentFirstPage,
      currentLastPage,
      fetchPage,
      nextPage,
    };
  },
};
</script>

<style scoped>
.pagination-group {
  margin-top: 20px;
}

.card {
  margin-bottom: 10px;
}

.btn {
  margin-right: 10px;
  margin-bottom: 10px;
}

.card-body {
  background-color: white;
}

.banner-img {
  padding: 5px 5px 0;
}

.header {
  border-bottom: 1px solid #ebeff2;
  padding: 19px 0;
  text-align: center;
  color: #59687f;
  font-size: 600;
  font-size: 19px;
  position: relative;
  font-weight: 700;
}

.banner-img img {
  width: 100%;
  border-radius: 5px;
}

.dates {
  border: 1px solid #ebeff2;
  border-radius: 5px;
  padding: 20px 0px;
  margin: 10px 20px;
  font-size: 16px;
  color: #5aadef;
  font-weight: 600;
  overflow: auto;
}

.dates div {
  float: left;
  width: 100%;
  text-align: center;
  position: relative;
}

.dates span {
  width: 1px;
  height: 40px;
  position: absolute;
  right: 0;
  top: 0;
  background: #ebeff2;
}

.dates strong,
.stats strong {
  display: block;
  color: #adb8c2;
  font-size: 11px;
  font-weight: 700;
}

.stats {
  border-top: 1px solid #ebeff2;
  background: #f7f8fa;
  overflow: auto;
  padding: 15px 0;
  font-size: 16px;
  color: #59687f;
  font-weight: 600;
  border-radius: 0 0 5px 5px;
}

p.card-text {
  text-align: center;
  font-weight: 600;
}

.stats div {
  border-right: 1px solid #ebeff2;
  width: 50%;
  float: left;
  text-align: center;
}

.stats div:nth-of-type(2) {
  border: none;
}

div.footer {
  text-align: right;
  position: relative;
  margin: 20px 5px;
}

div.footer a.btn {
  padding: 10px 25px;
  margin: 10px 2px;
  font-weight: bold;
  text-decoration: none;
  border-radius: 3px;
}
</style>
