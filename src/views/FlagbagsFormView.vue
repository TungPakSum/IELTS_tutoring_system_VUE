<template>
  <div>
    <BreadcrumbUI />
    <FlagbagForm />
  </div>
</template>

<script>
import FlagbagForm from "@/components/FlagbagsForm.vue";
import BreadcrumbUI from "@/components/BreadcrumbUI.vue";
import { useRoute } from "vue-router";
import { ref, onMounted } from "vue";

export default {
  name: "VolunteerFormView",
  components: {
    BreadcrumbUI,
    FlagbagForm
  },
  setup()
  { 
    const items = ref({});
    const router = useRoute();
    const updateForm = ref(false);

    onMounted(() => {
      if (!(router.params.eid == null)) {
        updateForm.value = true;
        fetchName();
      }
    });

    const fetchName = async function () {
      const response = await fetch(`/api/events/get/${router.params.eid}`);
      if (response.ok) {
        let data = await response.json();
        items.value = data.items;
        selected.value = items.value.locationName;
      }
    };




  }
}
</script>
