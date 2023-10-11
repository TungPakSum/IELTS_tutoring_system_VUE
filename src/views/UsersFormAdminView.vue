<template>
  <div>
    <BreadcrumbUI />
    <UsersForm usertype="admin" />
  </div>
</template>

<script>
import UsersForm from "@/components/UsersForm.vue";
import BreadcrumbUI from "@/components/BreadcrumbUI.vue";

export default {
  name: "UsersFormAdminView",
  components: {
    BreadcrumbUI,
    UsersForm
  }
}
</script>
