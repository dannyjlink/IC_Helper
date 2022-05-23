<template>
  <div
    class="menu-container"
    :style="{ 
      'border-right': 'solid 5px' + menu.color,
      'background-color': bgc 
    }"
  >
    <div class="menu-header">{{ menu.label }}</div>
    <div
      v-for="option in menu.options"
      :key="option.text"
      v-on:click="on_click(option)"
    >
      {{ option.text }}
    </div>
  </div>
</template>

<script>
export default {
  name: "SideMenu",
  props: ["menu", "bgc"],

  data() {
    return {};
  },

  methods: {
    //on_click(option) {},
  },
};
</script>

<style scoped>
.menu-container {
  position: absolute;
  top: 0;
  height: 100vh;
  width: 30vw;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  background-color: #dcdfe4;
  z-index: 20;
}
.menu-header {
  width: 100%;
  height: 4em;
  background-color: red;
}
</style>
