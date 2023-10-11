<template>
  <div>
    <BreadcrumbUI />
    <Card />
    <!-- <Card user-type="stationManager" /> -->
    <!-- <Card item.role="stationManager" /> -->
  </div>
</template>

<script>
import BreadcrumbUI from '@/components/BreadcrumbUI.vue'
import Card from '@/components/UsersCard.vue'

export default ({
  name: 'UsersStationMangerView',
  components: {
    BreadcrumbUI,
    Card
  }
})
</script>
