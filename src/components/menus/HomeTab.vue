<template>
  <div class="all">
    <div class="tab-wrapper" v-on:click="transition()">
      <div 
        class="tab-top"
        :style="{'border-bottom-color': '#5E6572' }"
        />
      <div class="tab" :style="{'background-color': '#5E6572'}">
        <img class="tab-icon" src="@/assets/close_menu.svg">
      </div>
      <div 
        class="tab-bottom"
        :style="{'border-top-color': '#5E6572' }"
      />
    </div>
    <div v-if="transitioning"
      class="slide"
      :style="{'background-color': '#EEF1EF', 'border-left': 'solid 5px' + '#5E6572'}"
    >

    </div>
  </div>
</template>

<script>
import anime from 'animejs';
export default {
  name: "HomeTab",
  props: ["color", "bgc"],
  data() {
    return {
      transitioning: false,
    }
  },

  methods: {
    async transition() {
      this.transitioning = true;
      const transition = anime({
        targets: ".all",
        translateX: [0, -window.innerWidth],
        easing: "cubicBezier(0.895, 0.030, 0.685, 0.220)",
      }).finished;
      await Promise.all([transition]);
      this.$router.back();
    }
  }
};
</script>

<style scoped>
.all {
  position: absolute;
  width: 100vw;
  height: 100vh;
  
}
.tab-wrapper {
  position: absolute;
  right: 0;
  height: 9em;
  width: 2.5em;
}
.tab {
  position: absolute;
  top: 50%;
  transform: translate(0, -50%);
  height: 4em;
  width: 2.5em;
  border-radius: 1em 0 0 1em;
}
.tab-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 2em;
  transform: translate(-50%, -50%);
  cursor: pointer;
}
.tab-top {
  position: absolute;
  width: 0;
  height: 0;
  right: 0;
  top: .6em;
  border-bottom: 2.25em solid;
  border-left: 2.25em solid transparent;
  cursor: pointer;  
}
.tab-bottom {
  position: absolute;
  width: 0;
  height: 0;
  right: 0;
  bottom: .6em;
  border-top: 2.25em solid;
  border-left: 2.25em solid transparent;
  cursor: pointer;
}
.slide {
  position: absolute;
  width: 100vw;
  height: 100vh;
  right: -100vw;
  z-index: 20;
}
</style>
