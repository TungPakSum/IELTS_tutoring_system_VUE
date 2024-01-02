<template>
  <div>
    <BreadcrumbUI />
    <ProfileForm usertype="admin" />
  </div>
</template>

<script>
import ProfileForm from "@/components/ProfileForm.vue";
import BreadcrumbUI from "@/components/BreadcrumbUI.vue";

export default {
  name: "ProfileView",
  components: {
    BreadcrumbUI,
    ProfileForm,
  },
};
</script>
