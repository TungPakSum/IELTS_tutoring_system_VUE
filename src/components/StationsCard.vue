<template>
  <div class="row">
    <div class="col-12 p-3 searchBox">
      <input id="form1" v-model="Search" type="search" class="form-control" placeholder="Search">
    </div>
  </div>

  <div class="row">
    <div v-for="item in items" :key="item" class="col-lg-3 col-md-4 col-sm-6 col-xs-12">
      <div class="tile">
        <div class="wrapper">
          <!-- <h5 class="card-title"> -->
          <div class="header">
            {{ item.name }}
          </div>
          <div class="banner-img">
            <img src="http://via.placeholder.com/640x360" alt="Image 1">
          </div>
          <!-- </h5> -->
          <div class="stats_address">
            <div><strong>地址:</strong>{{ item.address }}</div>
          </div>
          <div class="stats">
            <div><strong>地區: </strong>{{ item.district.name }}</div>
            <div><strong>已發送旗袋: </strong>{{ item.flagbag }}</div>
            <div><strong>所屬旗站: </strong>{{ item.subdistrict }}</div>
          </div>
        </div>

        <div class="footer">
          <router-link v-slot="{ navigate }" :to="`/events/${eid}/stations/${item._id}/volunteers`" custom>
            <a href="#" class="Cbtn Cbtn-success" @click="navigate">義工</a>
          </router-link>
          <router-link v-slot="{ navigate }" :to="`/events/${eid}/stations/${item._id}`" custom>
            <a href="#" class="Cbtn Cbtn-success" @click="navigate">編緝</a>
          </router-link>
          <a href="#" class="Cbtn Cbtn-danger" @click="deleteStations(item._id)">刪除</a>
        </div>
      </div>
    </div>
  </div>

  <div v-if="pages.length > 1" class="pagination-group row">
    <nav aria-label="Page navigation example">
      <ul class="pagination">
        <li class="page-item">
          <a class="page-link" href="#" aria-label="Previous">
            <span aria-hidden="true">&laquo;</span>
          </a>
        </li>
        <li v-for="i in pages.slice(currentFirstPage, currentLastPage)" :key="i" class="page-item">
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
import { computed, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";

export default {
  name: "EventsCard",
  setup: function () {
    const lastPage = ref(0);
    const perPage = ref(6);
    const router = useRoute();
    let currentFirstPage = ref(1);
    let currentLastPage = ref(3);
    let currentPage = ref();
    let items = ref([]);
    let itemsWithoutPages = ref([]);
    let Search = ref();
    let eid = ref();

    onMounted(function () {
      fetchPage(1);
      getEid();
      currentFirstPage.value = 0;
      currentLastPage.value = 3;
    });

    watch(Search, () => {
      //make the searchbox response immedidately whenever the input detect changes
      filterItems(Search.value);
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

    const getEid = function () {
      eid.value = router.params.eid;
    };

    const fetchPage = async function (page) {
      currentPage.value = page;
      const response = await fetch(
        `/api/stations/get?perPage=${perPage.value}&page=${page}&eid=${router.params.eid}`, {
          headers: {
            "x-access-token": localStorage.getItem("token"),
          }
        }
      );
      if (response.ok) {
        let data = await response.json();
        items.value = data.items;
        itemsWithoutPages.value = data.itemsWithoutPages;
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

    const deleteStations = async function (id) {
      const response = await fetch(`/api/stations/delete/${id}`, {
        method: "delete",
        body: JSON.stringify(items.value),
      });
      if (response.ok) {
        alert("Stations deleted");
        getEid();
        location.assign("/events/" + eid.value + "/stations");
      } else {
        alert(response.statusText);
      }
    };

    const nextPage = (currentPage) => {
      fetchPage(currentPage);
      currentFirstPage.value += 3;
      currentLastPage.value += 3;
    };

    // filter the item according to the searchbox input,
    // this only activate when the input of the searchbox detect changes
    const filterItems = async function (searchText) {
      //if searchText is not empty, do the filtering, else nothing change
      if (searchText) {
        const searchTextLower = searchText.replaceAll(" ", "").toLowerCase();
        const filteredItems = itemsWithoutPages.value.filter((item) => {
          return (
            item["name"]
              .replaceAll(" ", "")
              .toLowerCase()
              .includes(searchTextLower) ||
            item.district.district
              .replaceAll(" ", "")
              .toLowerCase()
              .includes(searchTextLower)
          );
        });
        items.value = filteredItems;
        lastPage.value = items.value.length / perPage.value;
        //console.log('After: ',items.value)
      } else if (searchText === "") {
        console.log(currentPage);
        await fetchPage(currentPage.value);
      }
    };

    return {
      eid,
      items,
      Search,
      pages,
      currentFirstPage,
      currentLastPage,
      fetchPage,
      nextPage,
      deleteStations,
      filterItems,
      currentPage,
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

.tile {
  width: 100%;
  background: #fff;
  border-radius: 5px;
  box-shadow: 0px 2px 3px -1px rgba(151, 171, 187, 0.7);
  float: left;
  transform-style: preserve-3d;
  margin: 10px 5px;
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

.banner-img {
  padding: 5px 5px 0;
}

.banner-img img {
  width: 100%;
  border-radius: 5px;
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

.stats div {
  border-right: 1px solid #ebeff2;
  width: 33.33333%;
  float: left;
  text-align: center;
}

.stats div:nth-of-type(3) {
  border: none;
}

.stats strong {
  display: block;
  color: #adb8c2;
  font-size: 11px;
  font-weight: 700;
}

.stats_address {
  border-top: 1px solid #ebeff2;
  background: #f7f8fa;
  overflow: auto;
  padding: 15px 0;
  font-size: 16px;
  color: #59687f;
  font-weight: 600;
  border-radius: 0 0 5px 5px;
}

.stats_address div {
  border-right: 1px solid #ebeff2;
  width: 100%;
  float: left;
  text-align: center;
}

.stats_address div:nth-of-type(1) {
  border: none;
}

.stats_address strong {
  display: block;
  color: #adb8c2;
  font-size: 11px;
  font-weight: 700;
}

div.footer {
  text-align: right;
  position: relative;
  margin: 20px 5px;
}

div.footer a.Cbtn {
  padding: 10px 25px;
  background-color: #DADADA;
  color: #666;
  margin: 10px 2px;
  text-transform: uppercase;
  font-weight: bold;
  text-decoration: none;
  border-radius: 3px;
}

div.footer a.Cbtn-success {
  background-color: #198754;
  color: #FFF;
}

div.footer a.Cbtn-success:hover {
  background-color: #8BEFA7;
}

div.footer a.Cbtn-danger {
  background-color: #fc5a5a;
  color: #FFF;
}

div.footer a.Cbtn-danger:hover {
  background-color: #fd7676;
}
</style>
