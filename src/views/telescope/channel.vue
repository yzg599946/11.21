<template>
  <channelTable :category="category"/>
</template>
<script>
import channelTable from "@/components/channelTable";

export default {
  name:'telescope-channel',
  components: {
    channelTable
  },
  data() {
    return {
      category:"telescope"
    };
  }
};
</script>

<style scoped>
</style>
