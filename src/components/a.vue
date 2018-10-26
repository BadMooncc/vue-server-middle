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
      this.$http.get('/mock/59ce2200c5c4302238f57388/example/computed2', { params: { 'key': '12344' } });
    }
  }
}
</script>

