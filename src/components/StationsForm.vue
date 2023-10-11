
<template>
  <div class="container-fluid px-1 py-5 mx-auto background">
    <div class="row d-flex justify-content-center">
      <div class="col-xl-7 col-lg-8 col-md-9 col-11 text-center">
        <h3>旗站資料</h3>
        <!-- <p class="blue-text">
          Just answer a few questions<br> so that we can personalize the right experience for you.
                    </p> -->
        <div class="card">
          <!-- <h5 class="text-center mb-4">
            Powering world-class companies
                      </h5> -->
          <form class="form-card" @submit.prevent="submit">
            <div class="row justify-content-between text-left">
              <div class="form-group col-sm-6 flex-column d-flex">
                <label class="form-label px-3">旗站名稱
                  <span class="text-danger"> *</span>
                </label>
                <input v-model="item.name" type="text" class="form-control" required="required">
              </div>
              <div class="form-group col-sm-6 flex-column d-flex">
                <label class="form-label px-3">地區<span class="text-danger"> *</span></label>
                <!-- <input
                  v-model="item.name"
                  type="text"
                  class="form-control"
                  required="required"
                        > -->
                <select v-model="item.district" class="form-select" required="required">
                  <option disabled value="">
                    請選擇
                  </option>
                  <option v-for="district in districts" :key="district" :value="district">
                    {{ district.name }}
                  </option>
                </select>
              </div>
            </div>
            <div class="row justify-content-between text-left">
              <div class="form-group col-sm-6 flex-column d-flex">
                <label class="form-label px-3">地址<span class="text-danger"> *</span></label>
                <input v-model="item.address" type="text" class="form-control" required="required">
              </div>
              <div class="form-group col-sm-6 flex-column d-flex">
                <label class="form-label px-3">所屬旗站<span class="text-danger"> *</span></label>
                <input v-model="item.subdistrict" type="text" class="form-control" required="required">
              </div>
            </div>
            <div class="row justify-content-between text-left">
              <div class="form-group col-sm-6 flex-column d-flex">
                <label class="form-label px-3">已發送旗袋<span class="text-danger"> *</span></label> <input
                  v-model="item.flagbag" type="number" class="form-control" required="required">
              </div>
              <div class="form-group col-sm-6 flex-column d-flex">
                <label class="form-label px-3">旗站負責人<span class="text-danger"> *</span></label>
                <select v-model="item.IC" class="form-select" aria-label="Default select example">
                  <option disabled value="">
                    請選擇
                  </option>
                  <option v-for="ic in ics" :key="ic" :value="ic">
                    {{ ic.username }}
                  </option>
                </select>
              </div>
            </div>

            <div class="row justify-content-end">
              <div class="form-group col-sm-6">
                <button type="submit" class="btn btn-primary">
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

  <!-- <form
    class="form-card"
    @submit.prevent="submit"
  >
    <div class="mb-3">
      <legend>旗站資料</legend>
    </div>
    <div class="mb-3">
      <label
        for="name"
        class="form-label"
      >旗站名稱</label>
      <input
        v-model="item.name"
        type="tezxt"
        class="form-control"
        required="required"
      >
    </div>
    <div class="mb-3">
      <label
        for="district"
        class="form-label"
      >地區</label>
      <select
        v-model="item.district"
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
          v-for="district in districts"
          :key="district"
          :value="district"
        >
          {{ district.name }}
        </option>
      </select>
    </div>
    <div class="mb-3">
      <label
        for="address"
        class="form-label"
      >地址</label>
      <input
        v-model="item.address"
        type="text"
        class="form-control"
        required="required"
      >
    </div>
    <div class="mb-3">
      <label
        for="subdistrict"
        class="form-label"
      >所屬旗站</label>
      <input
        v-model="item.subdistrict"
        type="text"
        class="form-control"
        required="required"
      >
    </div>
    <div class="mb-3">
      <label
        for="flagbag"
        class="form-label"
      >已發送旗袋</label>
      <input
        v-model="item.flagbag"
        type="number"
        class="form-control"
        required="required"
      >
    </div>

    <div class="mb-3">
      <legend>旗站負責人</legend>
    </div>
    <div class="mb-3">
      <label
        for="ic"
        class="form-label"
      >站長</label>
      <select
        v-model="item.IC"
        class="form-select"
        aria-label="Default select example"
      >
        <option
          disabled
          value=""
        >
          Please select one
        </option>
        <option
          v-for="ic in ics"
          :key="ic"
          :value="ic"
        >
          {{ ic.username }}
        </option>
      </select>
    </div>

    <div class="mb-3 =d-flex">
      <button
        type="submit"
        class="btn btn-primary"
      >
        儲存
      </button>
      <button
        id="Dbutton"
        type="button"
        class="btn btn-danger"
        @click="deleteItem"
      >
        刪除
      </button>
    </div>
        </form> -->
</template>

<script>
import { onMounted, computed, ref } from "vue";
import { useRoute } from "vue-router";

export default {
  name: "StationsForm",
  setup() {
    const item = ref({});
    let updateForm = ref(false);
    let selected = ref("");
    let path = ref();
    let oUid = ref("");
    const eid = ref();
    const router = useRoute();
    const ics = ref({});
    const districts = computed(() => {
      return [
        {
          district: "Islands",
          name: "離島區",
        },
        {
          district: "KwaiTsing",
          name: "葵青區",
        },
        {
          district: "North",
          name: "北區",
        },
        {
          district: "SaiKung",
          name: "西貢區",
        },
        {
          district: "ShaTin",
          name: "沙田區",
        },
        {
          district: "TaiPo",
          name: "大埔區",
        },
        {
          district: "TsuenWan",
          name: "荃灣區",
        },
        {
          district: "TuenMun",
          name: "屯門區",
        },
        {
          district: "YuenLong",
          name: "元朗區",
        },
        {
          district: "KowloonCity",
          name: "九龍城區",
        },
        {
          district: "KwunTong",
          name: "觀塘區",
        },
        {
          district: "ShamShuiPo",
          name: "深水埗區",
        },
        {
          district: "WongTaiSin",
          name: "黃大仙區",
        },
        {
          district: "CentralandWestern",
          name: "中西區",
        },
        {
          district: "Eastern",
          name: "東區",
        },
        {
          district: "Southern",
          name: "南區",
        },
        {
          district: "WanChai",
          name: "灣仔區",
        },
      ];
    });

    onMounted(() => {
      if (!(router.params.sid == null)) {
        updateForm.value = true;
        fetchPage();
      }
      checkUserToken();
      fetchICs();
      getEid();
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
      const response = await fetch(`/api/stations/get/${router.params.sid}?eid=${eid.value}`, {
        headers: {
          "x-access-token": `${localStorage.getItem("token")}`,
        }
      });
      if (response.ok) {
        let data = await response.json();
        item.value = data.items;
        oUid.value = item.value.IC._id;
        selected.value = item.value.district;
      } else if (response.status === 401) {
        alert(response.statusText);
        location.assign("/login");
      } else if (response.status === 403) {
        alert(response.statusText);
        history.back()
      }
    };

    const fetchICs = async function () {
      const response = await fetch(`/api/users/get/role/stationManager?printList=true`, {
        headers: {
          "x-access-token": `${localStorage.getItem("token")}`,
        }
      });
      if (response.ok) {
        let data = await response.json();
        ics.value = data.items;
        console.log(ics.value);
      } else if (response.status === 401) {
        alert(response.statusText);
        history.back()
      } else if (response.status === 403) {
        alert(response.statusText);
        history.back()
      }
    };

    const getEid = function () {
      eid.value = router.params.eid;
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

        await fetch(`/api/users/update/assigned/${item.value.IC._id}`, {
          method: "put",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": `${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ assigned: true }),
        });

        const response = await fetch(`/api/stations/create`, {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(item.value),

        });
        if (response.ok) {
          alert("建立成功");
          window.location.replace(path.value);
        } else {
          alert(response.statusText);
        }

      } else {
        const id = item.value._id;
        delete item.value._id;

        if (oUid.value !== item.value.IC._id) {
          await fetch(`/api/users/update/assigned/${oUid.value}`, {
            method: "put",
            headers: {
              "Content-Type": "application/json",
              "x-access-token": `${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({ assigned: false }),
          });

          await fetch(`/api/users/update/assigned/${item.value.IC._id}`, {
            method: "put",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ assigned: true }),
          });

        }

        const response = await fetch(`/api/stations/update/${id}`, {
          method: "put",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": `${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(item.value),
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
      let id = item.value._id;
      if (confirm("確定刪除?")) {
        const response = await fetch(`/api/stations/delete/${id}`, {
          method: "delete",
          body: JSON.stringify(item.value),
          headers: {
            "x-access-token": `${localStorage.getItem("token")}`,
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
      districts,
      updateForm,
      selected,
      submit,
      deleteItem,
      ics,
      item
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
