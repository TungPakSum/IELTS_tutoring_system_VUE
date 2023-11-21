<template>
  <div id="vue">
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary py-3">
      <div class="container-sm">
        <a
          v-if="!login"
          class="navbar-brand"
        >
          <router-link
            v-slot="{ navigate }"
            :to="`/login`"
            custom
          >
            <img
              src=""
              width="148"
              height="60"
              @click="navigate"
            >
          </router-link>
        </a>
        <a
          v-else
          class="navbar-brand"
        >
          
        </a>
        <button
          v-if="login"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
          class="navbar-toggler"
          data-bs-target="#navbarSupportedContent"
          data-bs-toggle="collapse"
          type="button"
          @click="visible = !visible"
        >
          <span class="navbar-toggler-icon" />
        </button>
        <div
          id="navbarSupportedContent"
          :class="!visible ? 'collapse' : ''"
          class="navbar-collapse"
        >
          <ul
            v-if="login"
            class="navbar-nav me-auto mb-2 mb-lg-0"
          >
            
            <li class="navbar-brand">
              <a
                class="nav-link"
                href="/admin"
              >Admin</a>
            </li>
            <li class="navbar-brand">
              <a
                class="nav-link"
                href="/student"
              >Student</a>
            </li>
            
          </ul>

          <!-- <ul
            v-else
            class="navbar-nav me-auto mb-2 mb-lg-0"
          >
            <li class="nav-item">
              <a
                class="nav-link"
                href="/login"
              >登入</a>
            </li>
          </ul> -->
          <form class="d-flex align-items-center">
            <div>
              <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                <li class="navbar-brand">
                  <a  v-if="login"
                    class="nav-link"
                  >Sign in as {{ user.username }}</a>
                </li>
              </ul>
            </div>
            <div class="align-items-center">
              <i
                v-if="login"
                type="submit"
                class="bi bi-box-arrow-in-left"
                style="font-size: 33px;"
                @click="logout"
              />
            </div>
            <!-- <router-link
                          v-slot="{ navigate }"
                          :to="{ path: '/login' }"
                          custom
                        > -->
            <!-- <button
                            v-if="!login"
                            class="btn btn-outline-success"
                            type="submit"
                            @click="navigate"
                          >
                            登入
                          </button> -->
            <!-- <button
                          v-if="login"
                          class="btn btn-outline-success"
                          type="submit"
                          @click="logout"
                        > -->
            <!-- </button> -->
          </form>
        </div>
      </div>
    </nav>
    <div class="container-sm">
      <router-view />
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import JwtDecode from "jwt-decode";


export default{
    name: "App",
    setup: function () {
        const user = ref({});
        const login = ref(false);
        let visible = ref(false);
        const router = useRoute();

        onMounted(function () {
            fetchPage();
        });

      const fetchPage = async function () {
        if (localStorage.getItem("token") !== null) {
          const decodedToken = JwtDecode(localStorage.getItem("token"))
          user.value = decodedToken ;
          console.log(user.value);
          login.value = true;
        };
      }

        const logout = function () {
            localStorage.removeItem("token");
            location.assign("/login");
        }
        return {
            user,
            visible,
            login,
            logout
        };
    }
};
</script>
<style scoped>
.bi-box-arrow-in-left {
    padding-left: 5px;
}

/**/
</style>
