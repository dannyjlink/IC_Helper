import Vue from "vue";
import App from "@/App.vue";
import { router } from "@/vue-router";
import "regenerator-runtime";

import * as XLSX from 'xlsx';

Vue.use(XLSX);
new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
