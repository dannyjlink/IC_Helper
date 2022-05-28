<template>
  <div class="all-menu">
    <MenuTab
      v-for="menu in menus"
      :key="menu.id"
      class="menu-tab"
      @click.native="tab_click(menu)"
      :label="menu.label"
      :color="menu.color"
    />
    <SideMenu
      class="slide-out-menu"
      v-if="active_menu != null"
      :menu="active_menu"
      :menu_width="menu_width"
      :style="{'left': '-' + (menu_width * 100) + 'vw'}"
    />
  </div>
</template>

<script>
import MenuTab from "@/components/menus/MenuTab";
import SideMenu from "@/components/menus/SideMenu.vue"
//import Store from 'electron-store'
import anime from "animejs"; 

export default {
  name: "TabMenus",
  
  components: {
    SideMenu,
    MenuTab,
  },

  data() {
    return {
      active_menu: null,
      menu_width: 0.3,
      menus: [
        {
          label: "Tools",
          id: "tools",
          color: "#A9B4C2",
          options: [
            {
              text: "Postcard Maker",
              type: 'router-link',
              path: "/postcard_maker" 
            },
          ],
        },
        {
          label: "Settings",
          id: "settings",
          color: "#5E6572",
        },
      ],
    };
  },

  mounted() {},

  methods: {
    async tab_click(menu) {
      var offset = Math.round(this.menu_width * window.innerWidth);
      // Open new menu
      if (this.active_menu == null) {
        this.active_menu = menu;
        anime({
          targets: ".all-menu",
          translateX: [0, offset],
          easing: "cubicBezier(0.895, 0.030, 0.685, 0.220)",
        });
      } 
      else if (this.active_menu == menu) {  // Close the current menu
        const closed = anime({
          targets: ".all-menu",
          translateX: [offset, 0],
          easing: "cubicBezier(0.895, 0.030, 0.685, 0.220)",
        }).finished;

        await Promise.all([closed]);
        this.active_menu = null;

      } else {  // Close current menu, open a new one
          const closed = anime({
          targets: ".all-menu",
          translateX: [offset, 0],
          easing: "cubicBezier(0.895, 0.030, 0.685, 0.220)",
        }).finished;

        await Promise.all([closed]);
        this.active_menu = null;
        this.tab_click(menu); // Recursive call to open the new menu

      }
    },
  },
};
</script>

<style scoped>
.all-menu {
  z-index: 1;
  position: absolute;
}
.slide-out-menu {
  position: absolute;
  top: 0;
  z-index: 20;
}

</style>
