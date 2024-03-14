<template>
  <div>
    <BreadcrumbUI/>
    <Reading/>
  </div>
</template>

<script>
import BreadcrumbUI from '@/components/BreadcrumbUI.vue'
import Reading from '@/components/Reading.vue'

export default ({
  name: 'ReadingView',
  components: {
    BreadcrumbUI,
    Reading
  }
})
</script>
