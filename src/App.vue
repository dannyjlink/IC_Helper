<template>
  <router-view></router-view>
</template>

<script>
export default {
  name: "App",
};
</script>

<style>
@font-face {
  font-family: "Spoof Bold";
  src: local("Spoof Bold"), url(./fonts/Spoof-Bold.ttf) format("truetype");
}
@font-face {
  font-family: "Spoof";
  src: local("Spoof"), url(./fonts/Spoof-Medium.ttf) format("truetype");
}
@font-face {
  font-family: "Consolas";
  src: local("Consolas"), url(./fonts/Spoof-Medium.ttf) format("truetype");
}
</style>