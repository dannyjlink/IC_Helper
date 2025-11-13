<template>
  <div 
    :id="alias" 
    class="text-button"
    :style="{ 'border': '2px solid ' + color }"
    @click="$emit('btn-click')"
    v-on:mouseenter="on_enter()"
    v-on:mouseleave="on_leave()"
  >
    <div class="text">{{ placeholder }}</div>
  </div>
</template>

<script>
import anime from "animejs";

export default {
  name: "TextButton",

  props: [
    "text", 
    "bgc", 
    "alias"
  ],

  data() {
    return {
      placeholder: null,
      color: '#7d98a1', 
    };
  },

  mounted() {
    if (this.bgc != null) {
      this.color = this.bgc;
    }
    if (this.text != null) {
      this.placeholder = this.text;
    }
    this.ready = true;
    
  },

  methods: {
    async on_enter() {
      anime({
        targets: "#" + this.alias,
        'background-color': ['rgba(0, 0, 0, 0)', this.color],
        scale: 1.2,
        duration: 1000,
        elasticity: 400,
      })
    },

    on_leave() {
      anime({
        targets: "#" + this.alias,
        'background-color': [this.color, 'rgba(0, 0, 0, 0)'],
        scale: 1,
        duration: 1000,
        elasticity: 300,
      })
    },
  },
};
</script>

<style scoped>
.text-button {
  position: relative;
  width: 11em;
  height: 2.5em;
  border-radius: 1em;

  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  cursor: pointer;
}
</style>
