<template>
  <div class="container-fluid px-1 py-5 mx-auto background">
    <div class="row d-flex justify-content-center">
      <div class="col-xl-7 col-lg-8 col-md-9 col-11 text-center">
        <h3>用戶資料</h3>
        <!-- </div> -->
        <div class="card">
          <form class="form-card" @submit.prevent="submit">
            <div class="row justify-content-between text-left">
              <div class="form-group col-sm-6 flex-column d-flex">
                <label for="username" class="form-label">用戶名稱</label>
                <input v-model="item.username" type="text" class="form-control" required="required">
              </div>
              <div class="form-group col-sm-6 flex-column d-flex">
                <label for="email" class="form-label">電郵</label>
                <input v-model="item.email" type="email" class="form-control" required="required">
              </div>
            </div>
            <div class="row justify-content-between text-left">
              <div class="form-group col-sm-6 flex-column d-flex">
                <label for="password" class="form-label">密碼</label>
                <input v-model="item.password" type="password" class="form-control" required="required">
              </div>
              <div class="form-group col-sm-6 flex-column d-flex">
                <label for="form-select" class="form-label">身分</label>
                <select v-model="item.role" class="form-select" aria-label="Default select example">
                  <option disabled value="">
                    請選擇身份
                  </option>
                  <option v-for="role in roles" :key="role" :value="role.roles" :selected="role.name === selected">
                    {{ role.name }}
                  </option>
                </select>
              </div>
            </div>
            <!-- <<<<<<< HEAD -->

            <div class="row justify-content-end">
              <div class="form-group col-sm-6">
                <button type="submit" class="btn btn-primary">
                  儲存
                </button>
                <button type="button" class="btn btn-danger" @click="deleteUsers(item._id)">
                  刪除
                </button>
              </div>
            </div>

              <div class="row justify-content-between text-left">
                <div class="form-group col-sm-6 flex-column d-flex">
                  <label for="existingPassword" class="form-label">現有密碼</label>
                  <input v-model="existingPassword" type="password" class="form-control" required="required" v-if="showExistingPassword">
                </div>
                <div class="form-group col-sm-6 flex-column d-flex">
                  <label for="newPassword" class="form-label">新密碼</label>
                  <input v-model="newPassword" type="password" class="form-control" required="required" v-if="showNewPassword">
                </div>
              </div>
              <div class="row justify-content-end">
                <div class="form-group col-sm-6">
                  <button type="button" class="btn btn-primary" @click="showPasswordFields">更改密碼</button>
                  <button type="submit" class="btn btn-primary" :disabled="!validatePassword">儲存</button>
                  <button type="button" class="btn btn-danger" @click="deleteUsers(item._id)">刪除</button>
                  <button type="button" class="btn btn-warning" @click="resetPassword">重設密碼</button>
                </div>                
              </div>

          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, ref, toRefs } from "vue";
import { useRoute } from "vue-router";
import decode from "jwt-decode";
import bcrypt from "bcryptjs";

export default {
  name: "UsersForm",
  setup() {
    let updateForm = ref(false);
    let selected = ref("");
    const path = ref("");
    const item = ref({});
    const router = useRoute();
    const showExistingPassword = ref(false);
    const showNewPassword = ref(false);
    const passwords = ref({
      existing: "",
      new: "",
    });

    


    const roles = computed(() => {
      return [
        {
          roles: "admin",
          name: "管理員",
        },
        {
          roles: "student",
          name: "學生",
        },
      ];
    });

    onMounted(() => {
      if (!(router.params.uid === "create")) {
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

    const checkUserType = function() {
      const token = decode(localStorage.getItem("token"))
      if (token.role !== "admin") {
        alert("權限不足");
        history.back()
      }
    }

    const fetchPage = async function () {
      const response = await fetch(`/api/users/get/${router.params.uid}`, {
        headers: {
          "x-access-token": `${localStorage.getItem("token")}`,
        }
      });
      if (response.ok) {
        let data = await response.json();
        
        item.value = data.items;
        selected.value = item.value.role;
        showExistingPassword = item.value.password;
        console.log(data.items);
        console.log(item.value);
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

    const validatePassword = computed(() => {
      // Use bcrypt to compare the hashed existing password with the stored hashed password
      return bcrypt.compareSync(passwords.existing, item.value.password);
    });

    const getPath = function () {
      let elements = router.path.split("/");
      path.value = "/" + elements[1];
      for (let i = 2; i < elements.length - 1; i++) {
        path.value += "/" + elements[i];
      }
    };

    // Delete function
    const deleteUsers = async function (id) {
      const response = await fetch(`/api/users/get/${id}/confirm/delete`, {
        method: "delete",
        body: JSON.stringify(item.value),
        headers: {
          "x-access-token": `${localStorage.getItem("token")}`
        }
      });
      if (response.ok) {
        alert("Users deleted");
        location.assign("/users");
      } else {
        alert(response.statusText);
      }
    };

    // Update function
    const submit = async function (event) {
      event.preventDefault();
      console.log(updateForm.value);
      if (!updateForm.value) {
        const response = await fetch(`/api/users/create`, {
          method: "post",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": `${localStorage.getItem("token")}`
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
        console.log(item.value);
        let id = item.value._id;
        delete item.value._id;
        const response = await fetch(`/api/users/update/${id}`, {
          method: "put",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(item.value),
        });
        console.log(response);
        if (response.ok) {
          alert("更新成功");
          window.location.replace(path.value);
        } else {
          alert(response.statusText);
        }
      }
    };

    const showPasswordFields = () => {
      showExistingPassword.value = true;
      showNewPassword.value = true;
    };

    const resetPassword = () => {
      // Reset password logic, for example, change the password to '1234'
      const hashedPassword = bcrypt.hashSync("1234", bcrypt.genSaltSync(10));
      item.value.password = hashedPassword;
      // ... your existing logic to save the password ...
    };

    return {
      item,
      roles,
      updateForm,
      deleteUsers,
      submit,
      validatePassword,
      showPasswordFields,
      
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