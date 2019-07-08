<template>
  <channelTable :category="category"/>
</template>
<script>
import channelTable from "@/components/channelTable";

export default {
  name:'igBracelet-channel',
  components: {
    channelTable
  },
  data() {
    return {
      category:"igbracelet"
    };
  }
};
</script>

<style scoped>
</style>
