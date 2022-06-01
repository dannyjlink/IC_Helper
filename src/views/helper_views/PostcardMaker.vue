<template>
  <main>
    <HomeTab id="back-tab" />
    <div class="page-header">
      <h1 class="page-title">Postcard Maker</h1>
      <div class="text-container">
        <p>
          This page will generate 'postcards' for the students you give it data
          for.
        </p>
      </div>
    </div>
    <div class="two-column-container">
      <!-- Left column will be for all the file inputs -->
      <div id="input-column" class="page-column">
        <label
          :for="file.id + '-input'"
          class="file-input-container"
          v-for="file in files"
          :key="file.id"
        ><div class="file-input-label">{{file.label}}</div>

        <div class="file-input-button">
          <img class="button-icon" src="@/assets/file_upload.svg" />
            <span class="button-label">{{ 
            file.name != null ? file.name : "Choose File..." 
          }}</span>
        
        </div>
          
          
          
          <input :id="file.id + '-input'" class="file-input" type="file" :accept="file.accept" />
        </label>
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
import Printd from 'printd';
*/
import { HomeTab } from "@/components/menus";
export default {
  name: "PostcardMaker",

  components: {
    HomeTab,
  },

  data() {
    return {
      files: [
        {
          label: "Student Demographics",
          id: "demographics",
          path: null,
          accept: ".xlsx",
          name: null,
        },
      ],
    };
  },

  methods: {},
};
</script>

<style scoped>
/* File input elements */
.file-input-container {
  width: 100%;
  height: 3.5em;

  display: flex;
  flex-direction: row;
  flex-basis: flex-start;
  align-items: center;
}
.file-input-label {
  order: 1;
  padding: 1em;
}
.file-input-button {
  position: relative;
  height: 2.5em;
  border: solid 1px red;
  border-radius: .25em;
  order: 2;
  
  display: flex;
  text-align: center;
  align-items: center;
  cursor: pointer;
}
.button-icon {
  height: 1.5em;
  order: 1;
  padding: 0 1em 0 1em;

}
.button-label {
  order: 2;
  padding: 0 1em 0 1em;
  
}

.file-input {
  display: none;
}

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
