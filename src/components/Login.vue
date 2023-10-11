<template>
  <div class="Login">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-sm-6">
          <img src="./../assets/icon.png" class="img-fluid" style="margin-bottom: 20px;">
          <form @submit.prevent="submit">
            <legend>登入</legend>
            <div class="mb-3">
              <label for="exampleFormControlInput1" class="form-label">用戶： </label>
              <input id="username" v-model="credential.username" type="text" class="form-control" placeholder="Username">
            </div>
            <div class="mb-3">
              <label for="exampleFormControlTextarea1" class="form-label">密碼： </label>
              <input id="password" v-model="credential.password" type="password" class="form-control"
                placeholder="Password">
            </div>
            <button type="submit" class="btn btn-primary" @click="login">
              登入
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import JwtDecode from "jwt-decode";

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Login',
  setup() {
    const credential = ref({});

    const login = async function () {
      const response = await fetch("/api/users/login", {
        method: "post",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify(credential.value)
      });

      if (response.ok) {
        const data = await response.json();
        let user = data;
        try {
          localStorage.setItem("token", data.token);
        } catch (error) {
          console.log(error)
        }

        alert("Login Successfully.")
        //  Decode token
        user = JwtDecode(localStorage.getItem("token"));

        if (user.role === 'admin') {
          window.location.assign('/events')
        } else if (user.role === 'stationManager') {
          const data = await fetchStation();
          let eid = "";
          for (let i = 0; i < data.itemsWithoutPages.length; i++) {
            eid = data.itemsWithoutPages[i].eid;
          }
          console.log(eid);
          window.location.assign(`/events/${eid}/stations/`)
        }
      }
      else {
        alert(response.statusText)
        window.location.assign('/login')
      }
    }

    const fetchStation = async function () {
      const response = await fetch(`/api/stations/get`, {
        method: "get",
        headers: {
          "x-access-token": localStorage.getItem("token"),
          "content-type": "application/json"
        }
      });
      let data = {};
      if (response.ok) {
        data = await response.json();
        console.log(data);
        return data;
      } else {
        alert(response.statusText)
      }
      return data;
    }


    return {
      credential,
      login
    }
  }
}
</script>
