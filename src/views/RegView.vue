<template>
  <div>
    <Reg/>
  </div>
</template>

<script>
import Reg from "@/components/Reg.vue";
import BreadcrumbUI from "@/components/BreadcrumbUI.vue";

export default {

  name: 'RegView',
  components: {
    BreadcrumbUI,
    Reg,
  }
}
</script>