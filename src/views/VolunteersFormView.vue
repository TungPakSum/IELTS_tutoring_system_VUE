<template>
  <div>
    <BreadcrumbUI />
    <VolunteerForm />
  </div>
</template>

<script>
import VolunteerForm from "@/components/VolunteerForm.vue";
import BreadcrumbUI from "@/components/BreadcrumbUI.vue";

export default {
  name: "VolunteerFormView",
  components: {
    BreadcrumbUI,
    VolunteerForm
  }
}
</script>
