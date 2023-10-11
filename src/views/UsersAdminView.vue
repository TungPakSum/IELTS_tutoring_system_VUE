<template>
  <div>
    <BreadcrumbUI />
    <!-- <UsersCard /> -->
    <UsersCard :user-role="'stationsManager'" />
  </div>
</template>

<script>
import BreadcrumbUI from '@/components/BreadcrumbUI.vue'
import UsersCard from '@/components/UsersCard.vue'

export default ({
  name: 'UsersView',
  components: {
    BreadcrumbUI,
    UsersCard
  }
})
</script>
