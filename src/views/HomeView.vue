<template>
  <main id="main">
    <div class="all-menu">
    <MenuTab
      v-for="menu in menus"
      :key="menu.id"
      class="menu-tab"
      @click.native="open_menu(menu)"
      :label="menu.label"
      :color="menu.color"
    /> 
    <SideMenu class="slide-out-menu" v-if="active_menu != null" :menu="active_menu"/>
    </div>
    
    <MainTitle id="main-title"/>
    
  </main>
</template>

<script>
import SideMenu from "@/components/SideMenu.vue";
import MenuTab from "@/components/MenuTab.vue";
import MainTitle from "@/components/MainTitle.vue";
import anime from "animejs";

export default {
  name: "HomeView",
  components: {
    MainTitle,
    SideMenu,
    MenuTab,
  },

  data() {
    return {
      config: null,
      active_menu: null,
      menus: [
        {
          label: "Tools",
          id: "tools",
          color: "#E06C75",
          options: [{
            text: "Postcard Maker",
            link: { name: "postcard_maker" }
          }]
          
        },
        {
          label: "Settings",
          id: "settings",
          color: "#B3D39C",
        },
      ],
    };
  },

  methods: {
    open_menu(menu) {
      //if(menu == this.active_menu) return; 
      var x = Math.round(.3 * window.innerWidth);
      console.log("X" + x);
      // Get the correct menu information
      this.active_menu = menu;
      anime({
        targets: '.all-menu',
        translateX: x,
        easing: 'cubicBezier(0.895, 0.030, 0.685, 0.220)',
      })

    },
    close_menu() {


      this.active_menu = null;
    },
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
  background-color: #ffffff;
}
.all-menu {
  z-index: 1;
  position: absolute;

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
.slide-out-menu {
  position: absolute;
  top: 0;
  left: -30vw;
  z-index: 20;
}
</style>
