<template>
  <channelTable :category="category"/>
</template>
<script>
import channelTable from "@/components/channelTable";

export default {
  components: {
    channelTable
  },
  data() {
    return {
      category:"abdominalMW"
    };
  }
};
</script>

<style scoped>
</style>
