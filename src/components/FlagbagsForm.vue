<template>
  <form>
    <div class="mb-3">
      <legend>旗袋資料</legend>
    </div>
    <div id="name" class="mb-3">
      <label for="name" class="form-label">旗袋持有人名稱</label>
      <input v-model="item.name" type="text" class="form-control" required="required">
    </div>
    <div class="mb-3">
      <label for="district" class="form-label">旗袋狀態</label>
      <select v-model="item.flagStatus" class="form-select" aria-label="Default select example">
        <option disabled value="">
          請選擇
        </option>
        <option v-for="status in flagStatus" :key="status" :value="status">
          {{ status.name }}
        </option>
      </select>
    </div>

    <div class="mb-3 =d-flex">
      <button type="submit" class="btn btn-primary" @click="submit">
        儲存
      </button>
      <button id="Dbutton" class="btn btn-danger" @click="deleteItem">
        刪除
      </button>
    </div>
  </form>
</template>

<script>
import { onMounted, computed, ref } from "vue";
import { useRoute } from "vue-router";

export default {
  name: "StationsForm",
  setup() {
    let updateForm = ref(false)
    let selected = ref('')
    let path = ref();
    const fid = ref();
    const vid = ref();
    const sid = ref();
    const eid = ref();
    const item = ref({});
    const router = useRoute();
    const flagStatus = computed(() => {
      return [{
        status: 'issued',
        name: '已發放'
      }, {
        status: 'received',
        name: '已收取'
      }, {
        status: 'not-issued',
        name: '未發放'
      }];
    });


    onMounted(() => {
      if (!(router.params.fid == null)) {
        updateForm.value = true
        fetchPage();
      } else {
        document.getElementById("Dbutton").style.display = "none";
        checkUserToken();
      }
      getFid();
      getVid();
      getEid();
      getSid();
      getPath();
    })

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
      const response = await fetch(`/api/flagbags/get/${router.params.fid}`);
      if (response.ok) {
        let data = await response.json();
        item.value = data.items;
        selected.value = item.value.district
      }
    };

    const getFid = function () {
      fid.value = router.params.fid
    }

    const getVid = function () {
      vid.value = router.params.vid;
    };

    const getEid = function () {
      eid.value = router.params.eid;
    };

    const getSid = function () {
      sid.value = router.params.sid;
    };

    const verifyNull = function () {
      if (this.item.name == null) {
        return false;
      }
      return true
    }

    const getPath = function () {
      let elements = router.path.split('/')
      path.value = '/' + elements[1];
      for (let i = 2; i < elements.length - 1; i++) {
        path.value += '/' + elements[i];
      }
    }

    const submit = async function (event) {
      event.preventDefault();


      if (!updateForm.value) {
        item.value.fid = fid.value;
        item.value.eid = eid.value;
        item.value.sid = sid.value;
        item.value.vid = vid.value;

        if (!(verifyNull)) {
          alert("please fill in all information")
        }
        else {
          console.log(eid)
          const response1 = await fetch(`/api/flagbags/create`, {
            method: "post",
            headers: {
              "Content-Type": "application/json",
              "x-access-token": `${localStorage.getItem("token")}`,
            },
            body: JSON.stringify(
              item.value,
            ),
          });

          const response2 = await fetch(`/api/volunteers/increase/${vid.value}`, {
            method: "put",
            headers: {
              "Content-Type": "application/json",
              "x-access-token": `${localStorage.getItem("token")}`,
            }
          });

          if (response1.ok && response2.ok) {
            alert("建立成功");
            //getEid();
            window.location.replace(path.value);
          } else {
            alert("create action fail");
          }
        }
      } else {
        if (!(verifyNull)) {
          alert("please fill in all information")
        }
        else {
          const id = item.value._id
          delete item.value._id;
          const response = await fetch(`/api/flagbags/update/${id}`, {
            method: "put",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(item.value),
          });

          if (response.ok) {
            alert("編輯成功");
            //getEid();
            window.location.replace(path.value)
          } else {
            alert(response.statusText);
          }
        }
      }
    };

    const deleteItem = async function (event) {
      event.preventDefault()
      let id = item.value._id;
      if (confirm("確定刪除?")) {

        const response1 = await fetch(`/api/flagbags/delete/${id}`, {
          method: "delete",
          body: JSON.stringify(item.value),
          headers: {
            "x-access-token": `${localStorage.getItem("token")}`,
          },
        });

        const response2 = await fetch(`/api/volunteers/decrease/${vid.value}`, {
          method: "put",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": `${localStorage.getItem("token")}`,
          }
        });
        console.log('line 158')
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
      flagStatus,
      updateForm,
      selected,
      submit,
      deleteItem,
      verifyNull

    };
  },
};
</script>
<style scoped>
.btn {
  margin-right: 10px;
}
</style>
