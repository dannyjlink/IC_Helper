import Vue from "vue";
import App from "@/App.vue";
import { router } from "@/vue-router";
import "regenerator-runtime";
//import Store from "store";
import * as XLSX from 'xlsx';
//import * as VueX from 'vuex';

//import { createPersistedState, createSharedMutations } from "vuex-electron"

Vue.use(XLSX);
/*
new VueX.Store({
  plugins: [
    createPersistedState(),
    createSharedMutations(),
  ]
})
*/
new Vue({
  router,
  //store,
  render: (h) => h(App),
}).$mount("#app");
