<template>
  <EventForm />
  <Breadcrumb />
</template>

<script>
import Breadcrumb from '@/components/BreadcrumbUI.vue'
import ChatForm from '@/components/ChatsForm.vue'

export default ({
    name: 'ChatView',
    components: {
        ChatForm,
        Breadcrumb
    }
})
</script>