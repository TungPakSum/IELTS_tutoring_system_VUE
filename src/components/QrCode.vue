<script setup>
import { defineProps, onMounted, ref } from 'vue'
import QRCode from 'qrcode'


const props = defineProps({
    data: {
        type: Object,
        required: true
    }
});

const src = ref("");
const resolvedData = ref([]);
const isValidProps = ref(true);

onMounted(async () => {
   try {
        resolvedData.value = await props.data;
        src.value = await QRCode.toDataURL(resolvedData.value._id, {
          color: {
            dark: '#000000',
            light: '#ffffff'
          }
        });
        console.log(resolvedData.value)
    } catch (error) {
        isValidProps.value = false;
        console.error(error);
    }
  
});

// eslint-disable-next-line no-unused-vars
const printQrCode = function() {
  const qrcodeImg = document.createElement('img')
  qrcodeImg.src = src.value
  const printWindow = window.open('', 'Print', 'height=400,width=600')
  printWindow.document.write('<html><head><title>QRCode-'+ resolvedData.value.name +' '+ resolvedData.value._id +'</title></head><body>')
  printWindow.document.write(qrcodeImg.outerHTML)
  printWindow.document.write('</body></html>')
  printWindow.document.close()
  printWindow.focus()
  printWindow.print()
  //printWindow.close()
}
</script>

<template>
  <div v-if="isValidProps">
    <img
      ref="qrcodeImg"
      :src="src"
      style="cursor: pointer;"
      @click="printQrCode"
    >
    <li
      class="list-group-item fw-bold h6" 
      :class="{ 'text-danger': (resolvedData.flagStatus ? resolvedData.flagStatus.status : 'N/A' )=== 'not-issued',
                'text-success': (resolvedData.flagStatus ? resolvedData.flagStatus.status : 'N/A') === 'received',
                'text-primary': (resolvedData.flagStatus ? resolvedData.flagStatus.status : 'N/A') === 'issued'}"
    >
      旗袋狀態: {{ resolvedData.flagStatus ? resolvedData.flagStatus.name : 'N/A' }}
    </li>
  </div>
</template>
