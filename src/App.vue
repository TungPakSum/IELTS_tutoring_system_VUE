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
          <ul class="navbar-nav me-auto mb-2 mb-lg-0" v-if="login && isAdmin">
            <li class="navbar-brand" >
              <router-link class="nav-link bi bi-people"
                :class="{'text-white': isActiveUser}"
                to="/student"
              >
                User Account Manager
            </router-link>
            </li>
            <li class="navbar-brand" >
              <router-link class="nav-link bi bi-pen"
                :class="{'text-white': isActiveModReading}"
                to="/modreading"
              >
                Reading Materials Manager
            </router-link>
            </li>
          </ul>

          <ul class="navbar-nav me-auto mb-2 mb-lg-0" v-if="login &&!isAdmin">
            <li class="navbar-brand" >
              <router-link class="nav-link bi bi-book"
                :class="{'text-white': isActiveWriting}"
                to="/writing"
              >
                Writing Practice
            </router-link>
            </li>
            <li class="navbar-brand" >
              <router-link class="nav-link bi bi-mic"
                :class="{'text-white': isActiveSpeaking}"
                to="/speaking"
              >
                Speaking Practice
            </router-link>
            </li>
            <li class="navbar-brand" >
              <router-link class="nav-link bi bi-pen"
                :class="{'text-white': isActiveReading}"
                to="/reading"
              >
                Reading Practice
            </router-link>
            </li>
          </ul>

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
import { onMounted, ref , computed } from "vue";
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
    
    const isActiveWriting = computed(() => {
      return router.path === '/writing';
    });

    const isActiveSpeaking = computed(() => {
      return router.path === '/speaking';
    });

    const isActiveReading = computed(() => {
      return router.path === '/reading';
    });

    const isActiveModReading = computed(() => {
      return router.path === '/modreading';
    });

    const isActiveUser = computed(() => {
      return router.path === '/student';
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
      isActiveWriting,
      isActiveSpeaking,
      isActiveReading,
      isActiveModReading,
      isActiveUser
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
  width: 100vw;
  z-index: 999;
}



/**/
</style>
