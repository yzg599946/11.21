<template>
  <orderTable
    :category="category"
  />
</template>

<script>
import orderTable from "@/components/orderTable";
export default {
  name:'temporary-order',
  components: {
    orderTable
  },
  data() {
    return {
      category:'temporary'
    };
  },
  created() {
  },
  methods: {
  }
};
</script>

<style scoped>
</style>
