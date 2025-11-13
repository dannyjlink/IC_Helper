<template>
  <div
    :id='label'
    class="file-button"
    :style="{ 'border': '2px solid ' + color }"
    v-on:mouseenter="on_enter()"
    v-on:mouseleave="on_leave()"
  >
    <img class="icon" src="@/assets/file_upload.svg" />
    <div class="label">{{ placeholder }}</div>
  </div>
</template>

<script>
import anime from "animejs";

export default {
  name: "FileButton",
  props: [
    "type",   // Folder or Directory, effects button placeholder
    "label",  // Label text, not required but will display if given
    "bgc"
  ],

  data() {
    return {
      placeholder: "Choose File",
      color: '#7d98a1'
    };
  },

  mounted() {
    if (this.bgc != null) {
      this.color = this.bgc;
    }
    if (this.type == 'directory') {
      this.placeholder = "Choose Folder"
    }
  },

  methods: {
    async on_enter() {
      anime({
        targets: "#" + this.label,
        'background-color': ['rgba(0, 0, 0, 0)', this.color],
        scale: 1.2,
        duration: 1000,
        elasticity: 400,
      })
    },

    on_leave() {
      anime({
        targets: "#" + this.label,
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
.file-button {
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
.icon {
  height: 1.5em;
  order: 1;
}
.label {
  order: 2;
}
</style>
