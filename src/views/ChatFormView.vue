<template>
  <div>
    <BreadcrumbUI />
    <ChatsForm />
  </div>
</template>

<script>
import ChatsForm from '@/components/ChatsForm.vue'
import BreadcrumbUI from '@/components/BreadcrumbUI.vue'

export default ({
  name: 'ChatsFormView',
  components: {
    ChatsForm,
    BreadcrumbUI
  }
})
</script>
