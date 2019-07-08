<template>
  <channelTable :category="category"/>
</template>
<script>
import channelTable from "@/components/channelTable";

export default {
  name:'heater-channel',
  components: {
    channelTable
  },
  data() {
    return {
      category:"heater"
    };
  }
};
</script>

<style scoped>
</style>
