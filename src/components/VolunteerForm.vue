<template>
  <div class="container-fluid px-1 py-5 mx-auto background">
    <div class="row d-flex justify-content-center">
      <div class="col-xl-7 col-lg-8 col-md-9 col-11 text-center">
        <h3>參加義工</h3>
        <div class="card">
          <form class="form-card">
            <div class="row justify-content-between text-left">
              <div class="form-group col-sm-6 flex-column d-flex">
                <label
                  for="username"
                  class="form-label"
                >用戶名稱</label>
                <input
                  v-model="item.name"
                  type="text"
                  class="form-control"
                  required="required"
                >
              </div>

              <div class="form-group col-sm-6 flex-column d-flex">
                <label
                  for="typephone"
                  class="form-label"
                >聯絡電話</label>
                <input
                  v-model="item.phoneNumber"
                  type="number"
                  class="form-control"
                  required="required"
                >
              </div>
            </div>
            <div class="row justify-content-between text-left">
              <div class="form-group col-sm-6 flex-column d-flex">
                <label for="email">聯絡電郵</label>
                <input
                  v-model="item.email"
                  type="email"
                  class="form-control"
                  required="required"
                >
              </div>
              <div class="form-group col-sm-6 flex-column d-flex">
                <label
                  for="flagLocation"
                  class="form-label"
                >賣旗地點</label>
                <input
                  v-model="item.serviceLocation"
                  type="text"
                  class="form-control"
                  required="required"
                >
              </div>
            </div>
            <div class="row justify-content-between text-left">
              <div class="form-group col-sm-6 flex-column d-flex">
                <label
                  for="form-select"
                  class="form-label"
                >義工類別</label>
                <select
                  v-model="item.type"
                  class="form-select"
                  aria-label="Default select example"
                  :disabled="updateForm"
                >
                  <option
                    disabled
                    value=""
                  >
                    請選擇
                  </option>
                  <option
                    v-for="type in types"
                    :key="type"
                    :value="type"
                  >
                    {{ type.name }}
                  </option>
                </select>
              </div>

              <div
                v-if="item.type && item.type.type === 'group'"
                class="form-group col-sm-6 flex-column d-flex"
              >
                <label
                  for="count"
                  class="form-label"
                >群組人數</label>
                <input
                  v-model="item.count"
                  type="number"
                  class="form-control"
                  required="required"
                  :disabled="
                    item.type && item.type.type === 'group' && updateForm
                  "
                >
              </div>
            </div>
            <div class="row justify-content-between text-left">
              <div
                v-if="
                  item.type && item.type.type === 'individual' && updateForm
                "
                class="form-group col-sm-6 flex-column d-flex"
              >
                <label
                  for="count"
                  class="form-label"
                >旗袋狀態</label>
                <select
                  v-model="flagStatus.flagStatus"
                  class="form-select"
                  aria-label="Default select example"
                >
                  <option
                    disabled
                    value=""
                  >
                    請選擇
                  </option>
                  <option
                    v-for="status in status"
                    :key="status"
                    :value="status"
                  >
                    {{ status.name }}
                  </option>
                </select>
              </div>
            </div>

            <div class="row justify-content-end">
              <div class="form-group col-sm-6">
                <button
                  type="submit"
                  class="btn btn-primary"
                  @click="submit"
                >
                  儲存
                </button>
                <button
                  id="Dbutton"
                  type="reset"
                  class="btn btn-danger"
                  @click="deleteItem"
                >
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
import { onMounted, computed, ref } from "vue";
import { useRoute } from "vue-router";

export default {
  name: "VolunteerForm",
  setup() {
    let updateForm = ref(false);
    let selected = ref("");
    let eid = ref();
    let sid = ref();
    let path = ref();
    const item = ref({
      count: ref(1),
    });
    const flagStatus = ref({});

    const router = useRoute();
    const types = computed(() => {
      return [
        {
          type: "individual",
          name: "個人",
        },
        {
          type: "group",
          name: "團體",
        },
      ];
    });

    const status = computed(() => {
      return [
        {
          status: "issued",
          name: "已發放",
        },
        {
          status: "received",
          name: "已收取",
        },
        {
          status: "not-issued",
          name: "未發放",
        },
      ];
    });

    onMounted(() => {
      if (!(router.params.vid == null)) {
        updateForm.value = true;
        fetchPage();
      } else {
        document.getElementById("Dbutton").style.display = "none";
      }
      checkUserToken();
      getEid();
      getSid();
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

    const fetchPage = async function () {
      const response1 = await fetch(`/api/volunteers/get/${router.params.vid}`, {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        }
      });

      let data1 = await response1.json();
      item.value = data1.items;
      selected.value = item.value.role;
      console.log(selected.value);

      const response2 = await fetch(
        `/api/flagbags/getFromVid/${item.value._id}`
      );
      let data2 = await response2.json();
      flagStatus.value = data2.item;
      console.log(data2.item);

      if (!response1.ok || !response2.ok) {
        alert("fail loading page");
      }
    };

    const getEid = function () {
      eid.value = router.params.eid;
    };

    const getSid = function () {
      sid.value = router.params.sid;
    };

    const getPath = function () {
      let elements = router.path.split("/");
      path.value = "/" + elements[1];
      for (let i = 2; i < elements.length - 1; i++) {
        path.value += "/" + elements[i];
      }
    };

    const submit = async function (event) {
      event.preventDefault();
      if (!updateForm.value) {
        item.value.eid = eid.value;
        item.value.sid = sid.value;

        const response1 = await fetch("/api/volunteers/create", {
          method: "post",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": localStorage.getItem("token"),
          },
          body: JSON.stringify(item.value),
        });

        const vid = await response1.json(); // extract Object ID from response 1

        const response2 = await fetch("/api/flagbags/create", {
          method: "post",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": localStorage.getItem("token"),
          },
          body: JSON.stringify({
            name: item.value.name,
            count: item.value.count,
            eid: item.value.eid,
            sid: item.value.sid,
            vid: vid, // add Object ID to response 2
          }),
        });

        if (response1.ok && response2.ok) {
          alert("建立成功");

          getEid();
          window.location.assign(path.value);
        } else {
          alert("create action fail");
        }
      } else {
        let id = item.value._id;
        delete item.value._id;
        const response1 = await fetch(`/api/volunteers/update/${id}`, {
          method: "put",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": localStorage.getItem("token"),
          },
          body: JSON.stringify(item.value),
        });

        const response2 = await fetch(`/api/flagbags/update/${id}`, {
          method: "put",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": localStorage.getItem("token"),
          },
          body: JSON.stringify({
            name: flagStatus.value.name,
            flagStatus: flagStatus.value.flagStatus,
            eid: flagStatus.value.eid,
            sid: flagStatus.value.sid,
            vid: flagStatus.value.vid,
          }),
        });
        console.log(flagStatus.value.flagStatus);
        if (response1.ok && response2.ok) {
          alert("更新成功");
          window.location.assign(path.value);
        } else {
          alert("update fail");
        }
      }
    };

    const deleteItem = async function (event) {
      event.preventDefault();
      let id = item.value._id;
      delete item.value._id;
      if (confirm("確定刪除? 這會一併刪除義工的旗袋")) {
        const response1 = await fetch(`/api/volunteers/delete/${id}`, {
          method: "delete",
          body: JSON.stringify(item.value),
          headers: {
            "x-access-token": localStorage.getItem("token")
          }
        });

        const response2 = await fetch(`/api/flagbags/deleteFromVid/${id}`, {
          method: "delete",
          headers: {
            "x-access-token": localStorage.getItem("token")
          }
        });

        if (response1.ok && response2.ok) {
          alert("項目已刪除");
          location.assign(path.value);
        } else {
          alert("delete action fail");
        }
      }
    };
    return {
      item,
      types,
      updateForm,
      selected,
      submit,
      deleteItem,
      status,
      flagStatus,
    };
  },
};
</script>

<style scoped>
.btn {
  margin-right: 10px;
}

/* .background {
  background-image: url("https://i.imgur.com/GMmCQHC.png");
} */

/* Test */
body {
  color: #000;
  overflow-x: hidden;
  height: 100%;
  /* background-image: url("https://i.imgur.com/GMmCQHC.png"); */
  background-repeat: no-repeat;
  background-size: 100% 100%;
}

.card {
  padding: 30px 40px;
  margin-top: 60px;
  margin-bottom: 60px;
  border: none !important;
  box-shadow: 0 6px 12px 0 rgba(0, 0, 0, 0.2);
}

.blue-text {
  color: #00bcd4;
}

.form-control-label {
  margin-bottom: 0;
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
  font-weight: 300;
}

input:focus,
textarea:focus {
  -moz-box-shadow: none !important;
  -webkit-box-shadow: none !important;
  box-shadow: none !important;
  border: 1px solid #00bcd4;
  outline-width: 0;
  font-weight: 400;
}

.btn-block {
  text-transform: uppercase;
  font-size: 15px !important;
  font-weight: 400;
  height: 43px;
  cursor: pointer;
}

.btn-block:hover {
  color: #fff !important;
}

button:focus {
  -moz-box-shadow: none !important;
  -webkit-box-shadow: none !important;
  box-shadow: none !important;
  outline-width: 0;
}
</style>
