<template>
  <div>
    <BreadcrumbUI />
    <EventsCard />
  </div>
</template>

<script>
import BreadcrumbUI from '@/components/BreadcrumbUI.vue'
import EventsCard from '@/components/EventsCard.vue'

export default ({
  name: 'EventView',
  components: {
    BreadcrumbUI,
    EventsCard
  },
  methods: {
    onScan(decodedText, decodedResult) {
      alert(decodedText);
      console.log(decodedText, decodedResult);
    }
  }


})

</script>


