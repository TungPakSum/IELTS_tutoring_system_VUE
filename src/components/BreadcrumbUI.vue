<template>
  <div class="d-flex justify-content-between">
    <div class="d-flex align-items-center">
      <nav
        aria-label="breadcrumb"
        class="d-flex align-items-center"
      >
        <ol class="breadcrumb">
          <li
            v-for="(item, index) in items"
            :key="index"
            class="breadcrumb-item"
          >
            <a
              v-if="items.length - 1 !== index"
              :href="item.path"
            >
              {{ item.name }}
            </a>
            <a v-else>{{ item.name }}</a>
          </li>
        </ol>
      </nav>
    </div>

    <div class="d-flex justify-content-end">
      <div
        v-for="(item, index) in items[items.length - 1].buttons"
        :key="index"
      >
        <router-link
          v-slot="{ navigate }"
          :to="`${item.path}`"
          custom
        >
          <button
            v-if="typeof item != 'undefined'"
            class="btn btn-sm btn-success"
            @click="navigate"
          >
            {{ item.name }}
          </button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { useRoute } from 'vue-router'
// eslint-disable-next-line no-unused-vars
import { computed, ref, onMounted } from 'vue'
// import JwtDecode from "jwt-decode";

export default {
  name: 'BreadcrumbUI',
  setup() {
    const router = useRoute()
    // let eventName = ref("")
    // let stationName = ref("")
    // let volunteerName = ref("")
    // let flagbagName = ref("")



    // const fetchName = async function(id, object) {
    //   const response = await fetch(`/api/${object}/get/${id}`);
    //   if (response.ok) {
    //     let data = await response.json();
    //     console.log(data.items)
    //     return data.items.name;
    //   }
    //   return ''
    // };

    // populateDict();

    // async function populateDict() {
    //   if (router.params.eid) {
    //     eventName.value = await fetchName(router.params.eid, "events");
    //   }
    //   if (router.params.sid) {
    //     stationName.value = await fetchName(router.params.sid, "stations");
    //   }
    //   if (router.params.vid) {
    //     volunteerName.value = await fetchName(router.params.vid, "volunteers");
    //   }
    //   if (router.params.fid) {
    //     flagbagName.value = await fetchName(router.params.fid, "flagbags");
    //   }
    // }

    const items = computed(() => {
      let items = [];

      let dict = [{
        name: '賣旗日',
        buttons: [
          {
            name: '建立',
            next: 'create'
          }
        ]
      },
      {
        name: '活動詳情'
        // name: eventName.value + '活動詳情'
      },
      {
        name: '旗站',
        // name: eventName.value + '的旗站',
        buttons: [{
          name: '建立',
          next: 'create'
        }]
      },
      {
        name: '旗站詳情',
        // name: stationName.value + '旗站詳情'
      },
      {
        name: '義工',
        // name: stationName.value + '的義工',
        buttons: [{
          name: '建立',
          next: 'create'
        }]
      },
      {
        name: '義工詳情',
        // name: volunteerName.value + '義工詳情',
      },
      {
        // name: volunteerName.value + '的旗袋',
        name: '旗袋',
        buttons: [{
          name: '建立',
          next: 'create'
        }, {
          name: '印出',
          next: 'print'
        }]
      },
      {
        name: '旗袋詳情',
        // name: flagbagName.value + '旗袋詳情',
      }
      ];

      let userDict = [{
        name: '用戶',
        buttons: [
          {
            name: '建立',
            next: 'create'
          }
        ]
      }, {
        name: '用戶詳情'
      },]


      let elements = router.path.split('/')
      let length = elements.length - 1;
      if (elements[1] == 'admin' || elements[1] == 'stationManager') {
        dict = userDict;
      }

      let element = 1;
      let path = '';
      for (let i = 0; i < dict.length; i++) {
        path += '/' + elements[element];
        dict[i].path = path;
        if (typeof dict[i].buttons != "undefined") {
          for (let j = 0; j < dict[i].buttons.length; j++) {
            dict[i].buttons[j].path = dict[i].path + '/' + dict[i].buttons[j].next;
          }
        }
        element++
      }

      items = dict.slice(0, length);
      console.log(items)
      return items;
    })

    onMounted(() => {
      // const credentials = JwtDecode(localStorage.getItem("token"));
      // console.log(credentials)
    })

    return {
      items,
      // fetchName,
      // populateDict
    }
  }
}
</script>

<style scoped>
.btn {
  margin-right: 5px;
}
</style>


