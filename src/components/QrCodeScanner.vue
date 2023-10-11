<script setup>
import {  defineProps, onMounted} from 'vue'
import { Html5QrcodeScanner } from "html5-qrcode"
import soundFile from '@/assets/alarm.mp3';

const props = defineProps({
  qrbox: {
    type: Number,
    default: 250
  },
  fps: {
    type: Number,
    default: 10
  }, 
});

const audio = new window.Audio();
audio.src = soundFile;
//const emit = defineEmits(['result']);


const onScanSuccess = async function(decodedText) 
{
  audio.play();
  if (window.confirm('FlagBag ID: ' + decodedText + ' is scanned. Do you want to confirm?'))
  {
        // Perform the action when the user clicks "OK"
        console.log('Confirmed');
        //console.log("decodedText:"+ decodedText);
        //console.log("decodedResult:"+ decodedResult);
        const id = decodedText;
        const response = await fetch(`/api/flagbags/updateQr/${id}`, {
        method: 'put',
        });

        if(response.ok)
        {
          alert("旗袋已收回");
        }
  } else
  {
        // Perform the action when the user clicks "Cancel"
        console.log('Cancelled');
  }
  
  
}

onMounted(() => {
  const html5QrcodeScanner = new Html5QrcodeScanner('qr-code-full-region', props);
  html5QrcodeScanner.render(onScanSuccess);
});
</script>

<template>
<div id="qr-code-full-region"></div>
</template>
