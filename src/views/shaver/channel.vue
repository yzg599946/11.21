<template>
  <channelTable :category="category"/>
</template>
<script>
import channelTable from "@/components/channelTable";

export default {
  name:'shaver-channel',
  components: {
    channelTable
  },
  data() {
    return {
      category:"shaver"
    };
  }
};
</script>

<style scoped>
</style>
