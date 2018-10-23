<template>
  <div>
    hello world
    <button @click="put">点击</button>
  </div>
</template>
<script>
export default {
  data () {
    return {

    }
  },
  methods: {
    put() {
      this.$http.get('/abc', { params: { name: 'tom' } });
    }
  }
}
</script>

