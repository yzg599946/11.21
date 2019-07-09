<template>
  <channelTable :category="category" />
</template>
<script>
import channelTable from "@/components/channelTable";

export default {
  name: "tt-channel",
  components: {
    channelTable
  },
  data() {
    return {
      category: "tt"
    };
  }
};
</script>

<style scoped>
</style>
