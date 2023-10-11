<template>
  <div class="container-fluid px-1 py-5 mx-auto">
    <div class="row d-flex justify-content-center">
      <div class="col-xl-7 col-lg-8 col-md-9 col-11 text-center">
        <h3>活動資料</h3>
        <div class="card">
          <form class="form-card" @submit.prevent="submit">
            <div class="row justify-content-between text-left">
              <div class="form-group col-sm-6 flex-column d-flex">
                <label class="form-label px-3">活動名稱
                  <span class="text-danger"> *</span>
                </label>
                <input v-model="items.name" type="text" class="form-control" required="required">
              </div>
              <div class="form-group col-sm-6 flex-column d-flex">
                <label class="form-label px-3">日期
                  <span class="text-danger"> *</span>
                </label>
                <input v-model="items.date" type="date" class="form-control" required="required">
              </div>
            </div>

            <div class="row justify-content-between text-left">
              <div class="form-group col-sm-6 flex-column d-flex">
                <label class="form-label px-3">賣旗地點
                  <span class="text-danger"> *</span>
                </label>
                <select v-model="items.location" class="form-select" aria-label="Default select example">
                  <option disabled value="">
                    請選擇
                  </option>
                  <option v-for="location in locations" :key="location" :value="location"
                    :selected="location.name === selected">
                    {{ location.name }}
                  </option>
                </select>
              </div>

              <div class="form-group col-sm-6 flex-column d-flex">
                <label class="form-label px-3">旗袋總數
                  <span class="text-danger"> *</span>
                </label>
                <input v-model="items.numOfBags" type="number" class="form-control" required="required">
              </div>
            </div>
            <div class="row justify-content-between text-left">
              <div class="form-group col-sm-12 flex-column d-flex">
                <label class="form-label px-3">活動簡介
                  <span class="text-danger"> *</span>
                </label>
                <textarea v-model="items.description" class="form-control" rows="3" required="required" />
              </div>
            </div>
            <div class="row justify-content-end">
              <div class="form-group col-sm-6">
                <button type="submit" class="btn btn-success">
                  儲存
                </button>
                <button id="Dbutton" type="button" class="btn btn-danger" @click="deleteItem">
                  刪除
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import decode from "jwt-decode";

export default {
  name: "EventsForm",
  setup() {
    const items = ref({});
    const router = useRoute();
    let updateForm = ref(false);
    let selected = ref("");
    let path = ref();
    const locations = computed(() => {
      return [
        {
          code: "All",
          name: "全港",
        },
        {
          code: "HK",
          name: "香港",
        },
        {
          code: "Kowloon",
          name: "九龍",
        },
        {
          code: "NT",
          name: "新界",
        },
      ];
    });

    onMounted(() => {
      if (!(router.params.eid == null)) {
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
        alert(response.statusText);
        location.assign("/login");
      } else if (response.status === 403) {
        alert(response.statusText);
        history.back()
      }
    }

    const checkUserType = function () {
      const token = decode(localStorage.getItem("token"))
      if (token.role !== "admin") {
        alert("權限不足");
        history.back()
      }
    }


    const fetchPage = async function () {
      const response = await fetch(`
        /api/events/get/${router.params.eid}`, {
        headers: {
          "x-access-token": `${localStorage.getItem("token")}`,
        },
      }
      );
      if (response.ok) {
        let data = await response.json();
        items.value = data.items;
        selected.value = items.value.locationName;
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

    const getPath = function () {
      let elements = router.path.split("/");
      path.value = "/" + elements[1];
      for (let i = 2; i < elements.length - 1; i++) {
        path.value += "/" + elements[i];
      }
    };

    const submit = async function (event) {
      if (!updateForm.value) {
        event.preventDefault();
        const response = await fetch(`/api/events/create`, {
          method: "post",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": `${localStorage.getItem("token")}`
          },
          body: JSON.stringify(items.value),
        });
        if (response.ok) {
          alert("建立成功");
          window.location.assign(path.value);
        } else {
          alert(response.statusText);
        }
      } else {
        event.preventDefault();
        const id = items.value._id;
        delete items.value._id;
        const response = await fetch(`/api/events/update/${id}`, {
          method: "put",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": `${localStorage.getItem("token")}`
          },
          body: JSON.stringify(items.value),
        });

        if (response.ok) {
          alert("編輯成功");
          window.location.replace(path.value);
        } else {
          alert(response.statusText);
        }
      }
    };

    const deleteItem = async function (event) {
      event.preventDefault();
      console.log(items.value._id);
      if (confirm("確定刪除?")) {
        const response = await fetch(`/api/events/delete/${items.value._id}`, {
          method: "delete",
          body: JSON.stringify(items.value),
          headers: {
            "x-access-token": `${localStorage.getItem("token")}`
          }
        });
        console.log("line 158");
        if (response.ok) {
          alert("項目已刪除");
          location.assign(path.value);
        } else {
          alert(response.statusText);
        }
      }
    };
    return {
      items,
      locations,
      updateForm,
      selected,
      submit,
      deleteItem,

    };
  },
};
</script>

<style scoped>
.btn {
  margin-right: 10px;
}

/* Test */
body {
  color: #000;
  overflow-x: hidden;
  height: 100%;
  /* background-image: url("https://i.imgur.com/GMmCQHC.png"); */
  background-repeat: no-repeat;
  background-size: 100% 100%
}

.card {
  padding: 30px 40px;
  margin-top: 60px;
  margin-bottom: 60px;
  border: none !important;
  box-shadow: 0 6px 12px 0 rgba(0, 0, 0, 0.2);
}

.blue-text {
  color: #00BCD4
}

.form-control-label {
  margin-bottom: 0
}

input,
select,
textarea,
button {
  padding: 8px 15px;
  border-radius: 5px !important;
  margin: 5px 0px;
  box-sizing: border-box;
  border: 1px solid #ccc;
  font-size: 18px !important;
  font-weight: 300
}

input:focus,
textarea:focus {
  -moz-box-shadow: none !important;
  -webkit-box-shadow: none !important;
  box-shadow: none !important;
  border: 1px solid #00BCD4;
  outline-width: 0;
  font-weight: 400
}

.btn-block {
  text-transform: uppercase;
  font-size: 15px !important;
  font-weight: 400;
  height: 43px;
  cursor: pointer
}

.btn-block:hover {
  color: #fff !important
}

button:focus {
  -moz-box-shadow: none !important;
  -webkit-box-shadow: none !important;
  box-shadow: none !important;
  outline-width: 0
}
</style>
