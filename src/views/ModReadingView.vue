<template>
  <div>
    <BreadcrumbUI />
    <ReadingForm usertype="admin" />
  </div>
</template>

<script>
import ReadingForm from "@/components/ReadingForm.vue";
import BreadcrumbUI from "@/components/BreadcrumbUI.vue";

export default {
  name: "ModReadingView",
  components: {
    BreadcrumbUI,
    ReadingForm,
  },
};
</script>
