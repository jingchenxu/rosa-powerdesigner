import Vue from 'vue'

export default function () {
  let FormPreview = Vue.component('FormPreview', {
    // el: 'form-preview',
    template: '<template><h1>FormPreview</h1></template>'
  })
  return new FormPreview()
}
