<template>
  <channelTable :category="category"/>
</template>
<script>
import channelTable from "@/components/channelTable";

export default {
  name:'clothes-channel',
  components: {
    channelTable
  },
  data() {
    return {
      category:"clothes"
    };
  }
};
</script>

<style scoped>
</style>
