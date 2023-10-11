<template>
    <BreadcrumbUI />
    <VolunteerForm url="game" type="game" />
</template>

<script>
import VolunteerForm from "@/components/VolunteerForm.vue";
import BreadcrumbUI from "@/components/BreadcrumbUI.vue";

export default {
    name: "VolunteerView",
    components: {
        BreadcrumbUI,
        VolunteerForm
    },
}
</script>
