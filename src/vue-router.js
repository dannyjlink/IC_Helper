import Vue from "vue";
import VueRouter from "vue-router";

import HomeView from "@/views/HomeView.vue";
import PostcardMaker from "@/views/helper_views/PostcardMaker.vue"

Vue.use(VueRouter);

const router = new VueRouter({
  mode: process.env.IS_ELECTRON ? 'hash' : 'history',

  routes: [
    {
      path: '/',
      name: 'homeview',
      component: HomeView,
    },
    {
      path: '/postcard_maker',
      name: 'postcard_maker',
      component: PostcardMaker
    },
  ],
});

router.beforeEach((to, _, next) => {
  // renders bad links ineffective
  next(to.matched.length > 1 || to.matched[0].path !== "*");
});

export { router };
