<template>
  <div>
    <BreadcrumbUI />
    <Home />
  </div>
</template>

<script>
import BreadcrumbUI from "@/components/BreadcrumbUI.vue";
import Home from "@/components/Home.vue";

export default {
  name: "ChatView",
  components: {
    BreadcrumbUI,
    Home,
  },
};
</script>
