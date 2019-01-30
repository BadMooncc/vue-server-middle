import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'
// import a from '@/components/a'

Vue.use(Router)

export default function createRouter () {
  return new Router({
    mode: 'history',
    routes: [
      {
        path: '/',
        name: 'HelloWorld',
        component: () => import('@/components/HelloWorld')
      },
      {
        path: '/a',
        name: 'a',
        component: () => import('@/components/a')
      }
    ]
  })
}