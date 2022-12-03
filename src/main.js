import { createApp } from 'vue'
import App from './App.vue'
import {createRouter, createWebHistory} from 'vue-router'
import HomeView from './views/HomeView.vue'
import ComplexView from './views/TeamScrutiny.vue'
import CompareView from './views/TeamComparator.vue'

const routes = [
    {
      path: '/',
      name: 'Home',
      component: HomeView
    },
    {
      path: '/about/:teamid',
      name: "About",
      component: ComplexView
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      // component: () => import(/* webpackChunkName: "about" */ '../views/TeamScrutiny.vue')
    },
    {
      path: '/compare',
      name: "Compare",
      component: CompareView
  
    }
  ]


const router = createRouter({
    history: createWebHistory(),
    routes
})


createApp(App).use(router).mount('#app')
