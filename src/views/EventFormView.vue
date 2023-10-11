<template>
  <div>
    <BreadcrumbUI />
    <EventsForm />
  </div>
</template>

<script>
import EventsForm from '@/components/EventsForm.vue'
import BreadcrumbUI from '@/components/BreadcrumbUI.vue'

export default ({
  name: 'EventsFormView',
  components: {
    EventsForm,
    BreadcrumbUI
  }
})
</script>
