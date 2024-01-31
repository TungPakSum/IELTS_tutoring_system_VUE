<template>
  <div>
    <BreadcrumbUI />
    <Speaking />
  </div>
</template>

<script>
import BreadcrumbUI from "@/components/BreadcrumbUI.vue";
import Speaking from "@/components/Speaking.vue";

export default {
  name: "SpeakingView",
  components: {
    BreadcrumbUI,
    Speaking,
  },
};
</script>
