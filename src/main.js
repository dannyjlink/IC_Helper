import Vue from "vue";
import App from "@/App.vue";
import { router } from "@/vue-router";
import "regenerator-runtime";

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
