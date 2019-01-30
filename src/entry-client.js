import { createApp } from './app'
const { app, router } = createApp()
console.log(createApp())
console.log(router.onReady)
router.onReady(function() {
//   console.log(213);
  app.$mount('#app');
}, function(err) {
  console.log(err);
})