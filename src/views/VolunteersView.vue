<template>
  <BreadcrumbUI />
  <VolunteersCard />
  <QrCode data="test" />
</template>

<script>

import VolunteersCard from "@/components/VolunteersCard.vue";
import BreadcrumbUI from "@/components/BreadcrumbUI.vue";
import QrCode from "@/components/QrCode.vue";

export default {
  name: "VolunteersView",
  components: {
    QrCode,
    BreadcrumbUI,
    VolunteersCard,

  },
};
</script>
