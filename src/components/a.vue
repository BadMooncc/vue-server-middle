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
      this.$http.post('/abc', { params: { 'key': '12344' } });
    }
  }
}
</script>

