<template>
  <div id="vue">
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary py-3">
      <div class="container-sm">
        <a v-if="!login" class="navbar-brand"> </a>
        <a v-else class="navbar-brand"> </a>
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
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="navbar-brand" v-if="login && isAdmin">
              <a class="nav-link" href="/admin">Admin Manager</a>
            </li>
            <li class="navbar-brand" v-if="login && isAdmin">
              <a class="nav-link" href="/student">Student Manager</a>
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
                  <a v-if="login" class="nav-link"
                    >Sign in as {{ user.username }}</a
                  >
                </li>
              </ul>
            </div>
            <div class="align-items-center">
              <i
                v-if="login"
                type="submit"
                class="bi bi-box-arrow-in-left"
                style="font-size: 33px"
                @click="logout"
              />
              <i
                v-if="login"
                type="submit"
                class="bi bi-person-circle"
                style="font-size: 33px"
                @click="profile"
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

export default {
  name: "App",
  setup: function () {
    const user = ref({});
    const login = ref(false);
    const isAdmin = ref(false);
    let visible = ref(false);
    const router = useRoute();

    onMounted(function () {
      checkUserToken();
      fetchPage();
    });

    const fetchPage = async function () {
      if (localStorage.getItem("token") !== null) {
        const decodedToken = JwtDecode(localStorage.getItem("token"));
        user.value = decodedToken;

        if (user.value.role == "admin") {
          isAdmin.value = true;
          console.log(isAdmin.value);
        }

        console.log(user.value.role);
        login.value = true;
      }
    };

    const logout = function () {
      localStorage.removeItem("token");
      location.assign("/login");
      login.value = false;
    };

    const profile = function () {
      location.assign("/profile");
    };

    const checkUserToken = async function () {
      const response = await fetch(`/api/users/check`, {
        headers: {
          "x-access-token": `${localStorage.getItem("token")}`,
        },
      });
      if (response.status === 401) {
        login.value = false;
      }
    };

    return {
      user,
      visible,
      login,
      logout,
      profile,
      checkUserToken,
      isAdmin,
    };
  },
};
</script>
<style scoped>
.bi {
  padding-left: 10px;
}

.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 999;
}

/**/
</style>
