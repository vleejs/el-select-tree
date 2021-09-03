import Vue from 'vue'
import App from './App.vue'
import { Form, FormItem, Select, Option, Tag, Scrollbar, Tree, Popover, Input, Button } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './styles/element-variables.scss'

Vue.config.productionTip = false
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Select)
Vue.use(Option)
Vue.use(Tag)
Vue.use(Scrollbar)
Vue.use(Tree)
Vue.use(Popover)
Vue.use(Input)
Vue.use(Button)
Vue.prototype.$ELEMENT = { size: 'small', zIndex: 3000 }
new Vue({
  render: (h) => h(App),
}).$mount('#app')
