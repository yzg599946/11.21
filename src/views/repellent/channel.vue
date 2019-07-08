<template>
  <channelTable :category="category"/>
</template>
<script>
import channelTable from "@/components/channelTable";

export default {
  name:'repellent-channel',
  components: {
    channelTable
  },
  data() {
    return {
      category:"repellent"
    };
  }
};
</script>

<style scoped>
</style>
