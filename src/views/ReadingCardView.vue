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
  name: 'ReadingCardView',
  components: {
    BreadcrumbUI,
    ReadingCard
  }
})
</script>
