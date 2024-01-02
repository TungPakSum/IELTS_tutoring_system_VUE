<template>
  <div class="Login">
    <div
      class="container d-flex align-items-center justify-content-center vh-100"
    >
      <div class="row w-100 justify-content-center">
        <div class="col-sm-6">
          <img src="" class="img-fluid" />
          <form @submit.prevent="submit" class="form-group">
            <legend>Login</legend>
            <div class="">
              <label for="exampleFormControlInput1" class="form-label"
                >Username：
              </label>
              <input
                id="username"
                v-model="credential.username"
                type="text"
                class="form-control"
                placeholder="Username"
              />
            </div>
            <div class="">
              <label for="exampleFormControlTextarea1" class="form-label"
                >Password：
              </label>
              <input
                id="password"
                v-model="credential.password"
                type="password"
                class="form-control"
                placeholder="Password"
              />
            </div>
            <button type="submit" class="btn btn-primary" @click="login">
              Login
            </button>

            <router-link to="/reg">
              <button type="button" class="btn btn-info m-3">Sign up</button>
            </router-link>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
document.title = "Login";
import { ref, onMounted } from "vue";
import JwtDecode from "jwt-decode";

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Login",
  setup() {
    const credential = ref({});

    const login = async function () {
      const response = await fetch("/api/users/login", {
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(credential.value),
      });

      if (response.ok) {
        const data = await response.json();
        let user = data;
        try {
          localStorage.setItem("token", data.token);
        } catch (error) {
          console.log(error);
        }

        alert("Login Successfully.");
        //  Decode token
        user = JwtDecode(localStorage.getItem("token"));

        if (user.role === "admin") {
          window.location.assign("/chat");
        } else if (user.role === "student") {
          const data = await fetchStation();
          let eid = "";
          for (let i = 0; i < data.itemsWithoutPages.length; i++) {
            eid = data.itemsWithoutPages[i].eid;
          }
          console.log(eid);
          window.location.assign(`/chat`);
        }
      } else {
        alert("Incorrect Username or Password");
        window.location.assign("/login");
      }
    };

    const fetchStation = async function () {
      const response = await fetch(`/api/stations/get`, {
        method: "get",
        headers: {
          "x-access-token": localStorage.getItem("token"),
          "content-type": "application/json",
        },
      });
      let data = {};
      if (response.ok) {
        data = await response.json();
        console.log(data);
        return data;
      } else {
        alert(response.statusText);
      }
      return data;
    };

    return {
      credential,
      login,
    };
  },
};
</script>

<style>
.form-group {
  width: 100%; /* Adjust the width as needed */
}
</style>
