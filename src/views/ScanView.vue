<template>
  <div>
    <BreadcrumbUI />
    <QrCodeScanner :qrbox="500" :fps="60" style="width: 1000px;" @result="onScan"/>
  </div>
</template>

<script>
import BreadcrumbUI from '@/components/BreadcrumbUI.vue'
import QrCodeScanner from '../components/QrCodeScanner.vue';

export default ({
  name: 'ScanView',
  components: {
    BreadcrumbUI,
    QrCodeScanner
},
methods: {
    onScan(decodedText, decodedResult) {
      alert(decodedText);
      console.log(decodedText, decodedResult);
    }
  }


})

</script>


