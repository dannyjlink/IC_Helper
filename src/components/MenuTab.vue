<template>
  <div class="tab-wrapper">
    <div 
      class="tab-top"
      :style="{'border-bottom-color': color }"
      />
    <div class="tab" :style="{'background-color': color }">
      <span class="tab-label">{{label}}</span>
    </div>
    <div 
      class="tab-bottom"
      :style="{'border-top-color': color }"
    />
    
  </div>
</template>

<script>
export default {
  name: "MenuTab",
  props: ["label", "color"],
};
</script>

<style scoped>
.tab-wrapper {
  position: relative;
  height: 12.5em;
  width: 2.5em;
}
.tab {
  position: absolute;
  top: 50%;
  transform: translate(0, -50%);
  height: 7.5em;
  width: 2.5em;
  border-radius: 0 1em 1em 0;
  
  writing-mode: vertical-lr;
  text-orientation: sideways;
}
.tab-label {
  position: absolute;
  top: 50%;
  left: 50%;
  font-size: 1.5em;
  transform: translate(-50%, -50%);
  font-family: 'Spoof';
  cursor: pointer;
}
.tab-top {
  position: absolute;
  width: 0;
  height: 0;
  top: .6em;
  border-bottom: 2.25em solid;
  border-right: 2.25em solid transparent;
  cursor: pointer;  
}
.tab-bottom {
  position: absolute;
  width: 0;
  height: 0;
  bottom: .6em;
  border-top: 2.25em solid;
  border-right: 2.25em solid transparent;
  cursor: pointer;
}
</style>
