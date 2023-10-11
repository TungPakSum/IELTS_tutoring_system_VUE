<template>
  <div>
    <BreadcrumbUI />
    <UsersForm usertype='stationManager'/>
  </div>
</template>

<script>
import UsersForm from "@/components/UsersForm.vue";
import BreadcrumbUI from "@/components/BreadcrumbUI.vue";

export default {
  name: "UsersFormStationMangerView",
  components: {
    BreadcrumbUI,
    UsersForm
  }
}
</script>
