import Vue from 'vue'
import Router from 'vue-router'
import Editor from './views/Editor.vue'
import FormPreview from './views/FormPreview.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'editor',
      component: Editor
    },
    {
      path: '/form-preview',
      name: 'form-preview',
      component: FormPreview
    }
  ]
})
