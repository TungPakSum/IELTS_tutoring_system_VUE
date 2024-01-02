<template>
  <div class="container-fluid px-1 py-5 mx-auto background">
    <div class="row d-flex justify-content-center">
      <div class="col-xl-7 col-lg-8 col-md-9 col-11 text-center">
        <h3>User Profile</h3>
        <div class="card">
          <form class="form-card" @submit.prevent="submit">
            <div class="row justify-content-between text-left">
              <div class="form-group col-sm-6 flex-column d-flex">
                <label for="username" class="form-label">User Name</label>
                <input
                  v-model="item.username"
                  type="text"
                  class="form-control"
                  required="required"
                />
              </div>
              <div class="form-group col-sm-6 flex-column d-flex">
                <label for="email" class="form-label">Email Address</label>
                <input
                  v-model="item.email"
                  type="email"
                  class="form-control"
                  required="required"
                />
              </div>
            </div>
            <div class="row justify-content-between text-center">
              <div class="form-group col-sm-6">
                <button type="submit" class="btn btn-primary">Save</button>
                <button
                  type="button"
                  class="btn btn-danger"
                  @click="deleteUsers(item._id)"
                >
                  Delete User
                </button>
                <button
                  type="button"
                  class="btn btn-secondary"
                  @click="changePasswordForm = true"
                >
                  Change Password
                </button>
              </div>
            </div>

            <div v-if="changePasswordForm">
              <div class="row justify-content-between text-left">
                <div class="form-group col-sm-6 flex-column d-flex">
                  <label for="existingPassword" class="form-label"
                    >Current Password</label
                  >
                  <input
                    v-model="existingPassword"
                    type="password"
                    class="form-control"
                    required="required"
                  />
                </div>
                <div class="form-group col-sm-6 flex-column d-flex">
                  <label for="newPassword" class="form-label"
                    >New Password</label
                  >
                  <input
                    v-model="newPassword"
                    type="password"
                    class="form-control"
                    required="required"
                  />
                </div>
              </div>
              <div class="row justify-content-end">
                <div class="form-group col-sm-6">
                  <button
                    type="button"
                    class="btn btn-primary"
                    @click="changePassword"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    class="btn btn-secondary"
                    @click="changePasswordForm = false"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    class="btn btn-primary"
                    @click="resetPassword"
                  >
                    Reset Password
                  </button>
                </div>
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
  name: "ProfileForm",
  setup() {
    let updateForm = ref(false);
    let selected = ref("");
    const path = ref("");
    const item = ref({});
    const router = useRoute();

    const resetPasswordForm = ref(false);
    const changePasswordForm = ref(false);
    const existingPassword = ref();
    const newPassword = ref();
    const confirmPassword = ref();
    const resetPasswordError = ref("");
    const changePasswordError = ref("");

    const roles = computed(() => {
      return [
        {
          roles: "admin",
          name: "administrator",
        },
        {
          roles: "student",
          name: "Student",
        },
      ];
    });

    onMounted(() => {
      fetchPage();
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
        history.back();
      }
    };

    const checkUserType = function () {
      const token = decode(localStorage.getItem("token"));
      if (token.role !== "admin") {
        alert("權限不足");
        history.back();
      }
    };

    const fetchPage = async function () {
      const decodedToken = decode(localStorage.getItem("token"));
      let id = decodedToken._id;

      const response = await fetch(`/api/users/get/${id}`, {
        headers: {
          "x-access-token": `${localStorage.getItem("token")}`,
        },
      });
      if (response.ok) {
        let data = await response.json();

        item.value = data.items;
        selected.value = item.value.role;
        console.log(data.items);
        console.log(item.value);
      } else {
        if (response.status === 401) {
          alert(response.statusText);
          location.assign("/login");
        } else if (response.status === 403) {
          alert(response.statusText);
          history.back();
        } else alert(response.statusText);
      }
    };

    const getPath = function () {
      let elements = router.path.split("/");
      path.value = "/" + elements[1];
      for (let i = 2; i < elements.length - 1; i++) {
        path.value += "/" + elements[i];
      }
    };

    // Delete function
    const deleteUsers = async function (id) {
      if (confirm("Are you sure to delete this user?")) {
        const response = await fetch(`/api/users/get/${id}/confirm/delete`, {
          method: "delete",
          body: JSON.stringify(item.value),
          headers: {
            "x-access-token": `${localStorage.getItem("token")}`,
          },
        });
        if (response.ok) {
          alert("Users Deleted");
          window.location.replace(path.value);
        } else {
          alert(response.statusText);
        }
      } else {
        return;
      }
    };

    // Update function
    const submit = async function (event) {
      event.preventDefault();

      console.log(item.value);
      let id = item.value._id;
      delete item.value._id;
      const response = await fetch(`/api/users/update/${id}`, {
        method: "put",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": `${localStorage.getItem("token")}`,
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
    };

    //new function
    const resetPassword = async function () {
      if (confirm("Are you sure you want to reset the password?")) {
        item.value.password = await bcrypt.hash("default", 10);
        let id = item.value._id;
        delete item.value._id;
        console.log(item.value);
        const response = await fetch(`/api/users/update/${id}`, {
          method: "put",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": `${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(item.value),
        });

        item.value._id = id;

        if (response.ok) {
          alert("Password reset to default");
          resetPasswordForm.value = false;
        } else {
          alert(response.statusText);
        }
      } else {
        return;
      }
    };

    const changePassword = async function () {
      console.log(existingPassword);
      if (!existingPassword.value || !newPassword.value) {
        alert("Please fill in the password");
        return;
      }
      // Verify existing password
      const isMatch = comparePasswords(existingPassword.value);
      if (!isMatch) {
        alert("現有密碼不正確");
        return;
      } else {
        item.value.password = await bcrypt.hash(newPassword.value, 10);
      }

      let id = item.value._id;
      delete item.value._id;
      const response = await fetch(`/api/users/update/${id}`, {
        method: "put",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": `${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(item.value),
      });

      item.value._id = id;

      if (response.ok) {
        alert("密碼已更改");
        changePasswordForm.value = false;
        existingPassword.value = "";
        newPassword.value = "";
      } else {
        alert(response.statusText);
      }
    };

    const comparePasswords = function (password) {
      return bcrypt.compareSync(password, item.value.password);
    };

    return {
      item,
      roles,
      updateForm,
      deleteUsers,
      submit,

      resetPasswordForm,
      changePasswordForm,
      existingPassword,
      newPassword,
      confirmPassword,
      resetPasswordError,
      changePasswordError,
      resetPassword,
      changePassword,
      comparePasswords,
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
