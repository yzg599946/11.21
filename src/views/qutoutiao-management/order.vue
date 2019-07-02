<template>
  <toutiaoTable
    :category="category"
  />
</template>

<script>
import toutiaoTable from "@/components/toutiaoTable";
export default {
  components: {
    toutiaoTable
  },
  data() {
    return {
      category:'qtt'
    };
  }
};
</script>

<style scoped>
</style>
