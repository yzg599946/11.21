<template>
  <toutiaoTable
    :category="category"
  />
</template>

<script>
import toutiaoTable from "@/components/toutiaoTable";
export default {
      name:'tt-order',
  components: {
    toutiaoTable
  },
  data() {
    return {
      category:'tt'
    };
  }
};
</script>

<style scoped>
</style>
