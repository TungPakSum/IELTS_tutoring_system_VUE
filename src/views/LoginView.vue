<template>
  <div class>
    <Login />
  </div>
</template>

<script>
import Login from "@/components/Login.vue";
import BreadcrumbUI from "@/components/BreadcrumbUI.vue";

export default {

  name: 'LoginView',
  components: {
    BreadcrumbUI,
    Login,
  }
}
</script>

<style>

</style>