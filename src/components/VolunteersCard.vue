<template>
  <div class="card-group row">
    <div v-for="item in items" :key="item" class="col-sm-4">
      <div class="tile">
        <div class="wrapper">
          <div class="header">
            {{ item.name }}
          </div>

          <li class="list-group-item h5 fw-bold" :class="{
            'text-success': item.type.type === 'individual',
            'text-primary': item.type.type === 'group',
          }">
            {{ item.type.name }}
          </li>

          <QrCode :data="getBag(item._id)" v-if="item.type.type === 'individual'"></QrCode>

          <!--           <ul class="list-group list-group-flush">
            <li class="list-group-item h5" v-if="item.type.type === 'group'">
              旗袋總數: {{ item.count }}
            </li>

            <li class="list-group-item">聯絡電話: {{ item.phoneNumber }}</li>
            <li class="list-group-item">聯絡電郵: {{ item.email }}</li>

            <li class="list-group-item">
              賣旗地點: {{ item.serviceLocation }}
            </li>
          </ul> -->

          <div class="stats_2">
            <div><strong>
                旗袋總數: </strong>{{ item.count }}
            </div>
          </div>
          <div class="stats">
            <div><strong>聯絡電話: </strong>{{ item.phoneNumber }}</div>
            <div><strong>聯絡電郵: </strong>{{ item.email }}</div>
            <div><strong>賣旗地點: </strong>{{ item.serviceLocation }}</div>
          </div>

          <div class="footer">
            <router-link v-if="item.type.type !== 'individual'" v-slot="{ navigate }"
              :to="`/events/${eid}/stations/${sid}/volunteers/${item._id}/flagbags`" custom>
              <a href="#" class="btn btn-primary" @click="navigate">旗袋</a>
            </router-link>
            <router-link v-slot="{ navigate }" :to="`/events/${eid}/stations/${sid}/volunteers/${item._id}`" custom>
              <a href="#" class="btn btn-success" @click="navigate">編緝</a>
            </router-link>
            <a href="#" class="btn btn-danger" @click="deleteVolunteers(item._id)">刪除</a>
          </div>
        </div>
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
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import QrCode from "@/components/QrCode.vue";

export default {
  name: "VolunteersCard",
  components: {
    QrCode,
  },
  setup: function () {
    const lastPage = ref(0);
    const perPage = ref(6);
    const router = useRoute();
    const eid = ref();
    const sid = ref();
    let currentFirstPage = ref(1);
    let currentLastPage = ref(3);
    let items = ref([]);

    onMounted(function () {
      fetchPage(1);
      getIds();
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

    const deleteVolunteers = async function (id) {
      if (confirm("確定刪除? 這會一併刪除義工的旗袋")) {
        const response1 = await fetch(`/api/volunteers/delete/${id}`, {
          method: "delete",
          body: JSON.stringify(items.value),
        });

        const response2 = await fetch(`/api/flagbags/deleteFromVid/${id}`, {
          method: "delete",
        });

        if (response1 && response2.ok) {
          alert("Flagbag deleted");
          location.assign(
            "/events/" + eid.value + "/stations/" + sid.value + "/volunteers"
          );
        } else {
          alert("delete action fail");
        }
      }
    };

    const fetchPage = async function (page) {
      const response = await fetch(
        `/api/volunteers/get?perPage=${perPage.value}&page=${page}&sid=${router.params.sid}`, {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        }
      });
      if (response.ok) {
        let data = await response.json();
        items.value = data.items;
        lastPage.value = data.pages;
        console.log(data.items);
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

    const getBag = async function (vid) {
      try {
        const response = await fetch(`/api/flagbags/getFromVid/${vid}`);
        if (response.ok) {
          const data = await response.json();
          console.log(data);
          const bag = data.item;
          console.log(bag);
          return bag;
        } else {
          throw new Error(`Error: ${response.status}`);
        }
      } catch (error) {
        console.error(error);
        return null; // or handle the error in another way
      }
    };

    const getIds = function () {
      eid.value = router.params.eid;
      sid.value = router.params.sid;
    };

    const nextPage = (currentPage) => {
      fetchPage(currentPage);
      currentFirstPage.value += 3;
      currentLastPage.value += 3;
    };

    return {
      eid,
      sid,
      items,
      pages,
      currentFirstPage,
      currentLastPage,
      fetchPage,
      nextPage,
      deleteVolunteers,
      getBag,
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
  height: 450px;
}

.btn {
  margin-right: 10px;
  margin-bottom: 10px;
}

body {
  background: #ecf1f5;
  font: 14px "Open Sans", sans-serif;
  text-align: center;
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
  text-align: center
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

.stats_2 {
  border-top: 1px solid #ebeff2;
  background: #f7f8fa;
  overflow: auto;
  padding: 15px 0;
  font-size: 16px;
  color: #59687f;
  font-weight: 600;
  border-radius: 0 0 5px 5px;
}

.stats_2 div {
  border-right: 1px solid #ebeff2;
  width: 100%;
  float: left;
  text-align: center
}

.stats_2 div:nth-of-type(1) {
  border: none;
}

.stats_2 strong {
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

div.footer a.btn {
  padding: 10px 25px;
  margin: 10px 2px;
  text-transform: uppercase;
  font-weight: bold;
  text-decoration: none;
  border-radius: 3px;
}
</style>
