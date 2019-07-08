<template>
  <channelTable :category="category"/>
</template>
<script>
import channelTable from "@/components/channelTable";

export default {
  name:'tea-channel',
  components: {
    channelTable
  },
  data() {
    return {
      category:"tea"
    };
  }
};
</script>

<style scoped>
</style>
