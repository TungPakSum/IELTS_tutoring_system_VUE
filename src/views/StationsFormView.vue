<template>
  <div>
    <BreadcrumbUI />
    <StationsForm />
  </div>
</template>

<script>
import StationsForm from "@/components/StationsForm.vue";
import BreadcrumbUI from "@/components/BreadcrumbUI.vue";

export default {
  name: "StationsFormView",
  components: {
    BreadcrumbUI,
    StationsForm
  }
}
</script>
