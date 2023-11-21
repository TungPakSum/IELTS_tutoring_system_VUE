<template>
  <div>
    <BreadcrumbUI />
    <ChatsCard />
  </div>
</template>

<script>
import BreadcrumbUI from '@/components/BreadcrumbUI.vue'
import ChatsCard from '@/components/ChatsCard.vue'

export default ({
  name: 'ChatView',
  components: {
    BreadcrumbUI,
    ChatsCard
  },
  methods: {
    onScan(decodedText, decodedResult) {
      alert(decodedText);
      console.log(decodedText, decodedResult);
    }
  }


})

</script>


