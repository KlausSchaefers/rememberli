import { createRouter, createWebHashHistory } from 'vue-router'
import Editor from '../views/Editor.vue'

const routes = [
  {
    path: '/',
    name: 'Editor',
    component: Editor
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
