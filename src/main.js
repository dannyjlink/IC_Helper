import Vue from "vue";
import App from "@/App.vue";
import { router } from "@/vue-router";
import "regenerator-runtime";

import VueHtml2pdf from 'vue-html2pdf'
import * as XLSX from 'xlsx';

Vue.use(VueHtml2pdf);
Vue.use(XLSX);
new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
