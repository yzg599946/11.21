<template>
  <channelTable :category="category"/>
</template>
<script>
import channelTable from "@/components/channelTable";

export default {
  name:'watch-channel',
  components: {
    channelTable
  },
  data() {
    return {
      category:"watch"
    };
  }
};
</script>

<style scoped>
</style>
