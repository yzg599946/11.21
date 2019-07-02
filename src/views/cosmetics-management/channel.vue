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
      category:"cosmetic"
    };
  }
};
</script>

<style scoped>
</style>
