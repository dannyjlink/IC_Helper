<template>
  <div class="menu-container" :style="{'border-right': 'solid 5px' + menu.color, 'background-color': bgc, 'width': (menu_width * 100) + 'vw'}">
    
    <!-- Menu Header and label-->
    <div class="menu-header" :style="{'border-bottom': 'solid 3px ' + menu.color}">
      <div class="menu-name">
        {{ menu.label }}
      </div>
    </div>

    <!-- Menu Options -->
    <div class="options-container" :style="{'border-bottom': 'solid 1px ' + menu.color}">
      <div class="option-content" v-for="option in menu.options"
        :key="option.text"
        v-on:click="on_click(option)"
      >
        {{ option.text }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SideMenu",
  props: ["menu", "bgc", "menu_width"],

  data() {
    return {};
  },

  methods: {
    on_click(option) {
      var type = option.type;
      if (type === "router-link") {
        this.$router.push(option.path);
      }
    },
  },
};
</script>

<style scoped>
.menu-container {
  position: absolute;
  top: 0;
  height: 100vh;
  background-color: #EEF1EF;
  z-index: 20;
}
.menu-header {
  position: relative;
  width: 95%;
  height: 3em;
  margin: 0 auto;
}
.menu-name {
  font-size: 2em;
  font-family: "Spoof Bold", "Lucida Sans Unicode", "Lucida Grande", "Lucida Sans", Arial, sans-serif;
  text-align: center;
}
.options-container {
  position: relative;
  width: 80%;
  height: 2em;
  margin: 1em auto;
  font-size: larger;
  font-family: "Spoof", "Lucida Sans Unicode", "Lucida Grande", "Lucida Sans", Arial, sans-serif;
  text-align: center;
}
.option-content {
  height: 100%; 
  width: 100%;
  cursor: pointer;
}

</style>
