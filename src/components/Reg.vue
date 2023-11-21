<template>
  <div class="Sign up">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-sm-6">
          <img src="" class="img-fluid" style="margin-bottom: 20px;">
          <form @submit.prevent="submit">
            <legend>Create an account</legend>
            <div class="mb-3">
              <label for="exampleFormControlInput1" class="form-label">Username： </label>
              <input id="username" v-model="credential.username" type="text" class="form-control" placeholder="Username" required="required">
            </div>
            <div class="mb-3">
              <label for="exampleFormControlInput1" class="form-label">Email Address： </label>
              <input id="username" v-model="credential.email" type="text" class="form-control" placeholder="Email" required="required">
            </div>
            <div class="mb-3">
              <label for="exampleFormControlTextarea1" class="form-label">Password： </label>
              <input id="password" v-model="credential.password" type="password" class="form-control" placeholder="Password" required="required">
            </div>
            <button type="submit" class="btn btn-primary">
              Sign up
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
  name: 'Reg',
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
        } else if (user.role === 'student') {
          const data = await fetchStation();
          let eid = "";
          for (let i = 0; i < data.itemsWithoutPages.length; i++) {
            eid = data.itemsWithoutPages[i].eid;
          }
          console.log(eid);
          window.location.assign(`/events`)
        }
      }
      else {
        alert("Incorrect Username or Password")
        window.location.assign('/login')
      }
    }


    const submit = async function (event) {
      event.preventDefault();

      credential.value.role = "student";
      console.log(credential);
      const response = await fetch(`/api/users/reg`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credential.value),
      });
      if (response.ok) {
         alert("Regististion successful");
         window.location.assign(`/login`);
      } else {
          alert(response.statusText);
      }
      
    };





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
      login,
      submit
    }
  }
}
</script>
