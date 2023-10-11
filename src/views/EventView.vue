<template>
  <EventForm />
  <Breadcrumb />
</template>

<script>
import Breadcrumb from '@/components/BreadcrumbUI.vue'
import EventForm from '@/components/EventsForm.vue'

export default ({
    name: 'EventView',
    components: {
        EventForm,
        Breadcrumb
    }
})
</script>