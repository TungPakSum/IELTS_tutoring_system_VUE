<template>
  <div class="row">
    <div class="col-12 p-3 searchBox">
      <input
        id="form1"
        v-model="Search"
        type="search"
        class="form-control"
        placeholder="Search"
      >
    </div>
  </div>
  <div class="card-group row">
    <div
      v-for="item in items"
      :key="item"
      class="col-sm-4 card-item"
    >
      <div class="card">
        <div class="card-body">
          <QrCode :data="item" />
          <h5 class="card-title">
            {{ item.name }}
          </h5>
        </div>

        <div class="card-body">
          <router-link
            v-slot="{ navigate }"
            :to="`/events/${eid}/stations/${sid}/volunteers/${vid}/flagbags/${item._id}`"
            custom
          >
            <a
              href="#"
              class="btn btn-success"
              @click="navigate"
            >編緝</a>
          </router-link>
          <a
            href="#"
            class="btn btn-danger"
            @click="deleteFlagbags(item._id)"
          >刪除</a>
        </div>
      </div>
    </div>
  </div>

  <div
    v-if="pages.length > 1"
    class="pagination-group row"
  >
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
import { computed, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import QrCode from "@/components/QrCode.vue";

export default {
  name: "EventsCard",
  components:
  {
    QrCode
  },
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
    let vid = ref();
    let sid = ref();

    onMounted(function () {
      fetchPage(1);
      getEid();
      getVid();
      getSid();
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

    const getVid = function () {
      vid.value = router.params.vid;
    };

    const getSid = function () {
      sid.value = router.params.sid;
    };



    const fetchPage = async function (page) {
      //const response = await fetch(
      //  `/api/${props.route}/get?perPage=${perPage.value}&page=${page}`
      //);
      currentPage.value = page;
      const response = await fetch(
        `/api/flagbags/get?perPage=${perPage.value}&page=${page}&vid=${router.params.vid}`, {
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

    const deleteFlagbags = async function (id) {
      if (confirm("確定刪除?")) {
        const response1 = await fetch(`/api/flagbags/delete/${id}`, {
          method: "delete",
          body: JSON.stringify(items.value),
        });

        const response2 = await fetch(`/api/volunteers/decrease/${vid.value}`, {
          method: "put",
          headers: {
            "Content-Type": "application/json",
          }
        });

        if (response1.ok && response2.ok) {
          alert("Flagbag deleted");
          getEid();
          location.assign("/events/" + eid.value + "/stations/" + sid.value + "/volunteers/" + vid.value + "/flagbags");
          //location.assign("/users");
        } else {
          alert("delete action fail");
        }
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
        const searchTextLower = searchText.replaceAll(' ', '').toLowerCase();
        //console.log(searchTextLower);
        //console.log('Before: ', items.value)
        const filteredItems = itemsWithoutPages.value.filter(item => {
          return item['name'].replaceAll(' ', '').toLowerCase().includes(searchTextLower) ||
            item.flagStatus.status.replaceAll(' ', '').toLowerCase().includes(searchTextLower);
        });
        items.value = filteredItems;
        lastPage.value = items.value.length / perPage.value;
        //console.log('After: ',items.value)
      } else if (searchText === '') {
        console.log(currentPage);
        await fetchPage(currentPage.value);
      }
    }

    return {
      eid,
      vid,
      sid,
      items,
      Search,
      pages,
      currentFirstPage,
      currentLastPage,
      fetchPage,
      nextPage,
      deleteFlagbags,
      filterItems,
      currentPage
    };
  },
}
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
</style>
