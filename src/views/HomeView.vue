<template>
  <main id="main">
    <TabMenus class="all-menu" />
    <MainTitle id="main-title" />
  </main>
</template>

<script>
import { TabMenus } from "@/components/menus"
import MainTitle from "@/components/MainTitle.vue";
//import Store from "electron-store";

export default {
  name: "HomeView",
  components: {
    MainTitle,
    TabMenus,
  },

  data() {
    return {
    };
  },

  mounted() {
  },

  methods: {
  },
};
</script>

<style scoped>
main {
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  position: absolute;
  overflow: hidden;
  background-color: #EEF1EF;
}

#main-title {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 325px;
  height: 170px;
  display: flex;
  flex-direction: column;
  z-index: 0;
}
</style>
