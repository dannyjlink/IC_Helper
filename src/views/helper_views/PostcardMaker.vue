<template>
  <main>
    <HomeTab id="back-tab" />

    <div class="page-header">
      <h1 class="page-title">Postcard Maker</h1>
      <div class="text-container">
        <p>
          This page will generate 'postcards' for the students you give it data for.
        </p>
      </div>
    </div>
    <div class="two-column-container">
      <!-- Left column will be for all the file inputs -->
      <div id="input-column" class="page-column">
      </div>

      <!-- Right column will be for all the postcard outputs -->
      <div id="output-column" class="page-column"></div>
    </div>
  </main>
</template>

<script>
/*
import fs from 'fs';
import XLSX from 'xlsx';
import Store from 'electron-store';
*/
import { HomeTab } from "@/components/menus";
export default {
  name: "PostcardMaker",

  components: {
    HomeTab,
  },

  data() {
    return {
      
    };
  },

  methods: {},
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
  background-color: #eef1ef;
  display: flex;
  flex-direction: column;
  flex-basis: flex-start;
  align-items: center;
}
.page-header {
  width: 95%;
  text-align: center;
  order: 1;
}
.two-column-container {
  background-color: red;
  width: 95%;
  order: 2;
  height: 3em;
  margin: 1em auto;

  display: flex;
  flex-direction: row;
}
.page-column {
  width: 50%;
  margin: auto 1em;

  display: flex;
  flex-direction: column;
  flex-basis: flex-start;
  overflow-y: scroll;
}
.page-title {
  font-size: xx-large;
  font-family: "Spoof Bold";
}
.text-container {
  font-size: 1em;
}

#back-tab {
  top: 0;
}
</style>
