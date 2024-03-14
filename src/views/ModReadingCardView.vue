<template>
  <div>
    <BreadcrumbUI/>
    <ReadingCard/>
  </div>
</template>

<script>
import BreadcrumbUI from '@/components/BreadcrumbUI.vue'
import ReadingCard from '@/components/ReadingCard.vue'

export default ({
  name: 'UsersView',
  components: {
    BreadcrumbUI,
    ReadingCard
  }
})
</script>
