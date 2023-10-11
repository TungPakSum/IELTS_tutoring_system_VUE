<template>
  <BreadcrumbUI />
  <FlagbagsCard />
</template>

<script>

import FlagbagsCard from "@/components/FlagbagsCard.vue";
import BreadcrumbUI from "@/components/BreadcrumbUI.vue";


export default {
  name: "VolunteersView",
  components: {
    BreadcrumbUI,
    FlagbagsCard,
    

  },
};
</script>
