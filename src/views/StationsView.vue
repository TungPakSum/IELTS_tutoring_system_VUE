/*eslint no-trailing-spaces: "error"*/
<template>
  <div>
    <BreadcrumbUI />
    <StationsCard />
  </div>
</template>

<script>
import BreadcrumbUI from '@/components/BreadcrumbUI.vue'
import StationsCard from '@/components/StationsCard.vue'
import {onMounted} from "vue";

export default ({
  name: 'StationsView',
  components: {
    BreadcrumbUI,
    StationsCard
  },
  props: {
    // eslint-disable-next-line vue/require-default-prop
    eid: String
  },
  setup(props) {
    onMounted(() => {
      console.log(props.eid)
    })
    return {
      props
    }
  }
})
</script>
  
