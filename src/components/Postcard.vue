<template>
  <div class="card">
    <div class="top-block">
      <img class="student-image" :src="student.image_path" />
      <div class="top-block-info">
          
          <!-- Name, grade, and class row-->
          <div class="row-container border">
            <div class="cell-container name "><p class="content ">{{ student.name.last }}, {{ student.name.first }}</p></div>
            <div class="cell-container class-info center"><p class="content">{{ student.grade }}</p></div>
            <div class="cell-container class-info center"><p class="content">{{ student.teacher }}</p></div>
          </div>
          
          <!-- Identifiers -->
          <div class="row-container identifiers side-borders">
            <div class="cell-container center identifier" 
              :style="{
                'width': 100 / student.identifiers.length + '%',  // Auto sizes identifier cells
                'border-right': index != student.identifiers.length - 1 ? '1px solid black' : 'none'  // Borders in-between identifiers, none on the last one since row is bordered
              }" 
              v-for="(identifier, index) in student.identifiers" :key="index">
              <p class="center ">{{ identifier }}</p>
            </div>
          </div>

        <!-- Exam Table -->
        <table class="exam-table">
          <tr>
            <th class="all-caps">{{ subject }}</th>
            <th>English</th>
            <th>Spanish</th>
          </tr>
          <tr>
            <th class="left">STAAR</th>
            <td class="score center cell">{{ student.data[subject].STAAR ? student.data[subject].STAAR.eng  : "" }}</td>
            <td class="score center cell">{{ student.data[subject].STAAR ? student.data[subject].STAAR.span : "" }}</td>
          </tr>
          <tr>
            <th class="left">BOY 360</th>
            <td class="score center cell">{{ student.data[subject].BOY ? student.data[subject].BOY.eng  : ""}}</td>
            <td class="score center cell">{{ student.data[subject].BOY ? student.data[subject].BOY.span : ""}}</td>
          </tr>
          <tr>
            <th class="left">MOY 360</th>
            <td class="score center cell">{{ student.data[subject].MOY ? student.data[subject].MOY.eng  : "" }}</td>
            <td class="score center cell">{{ student.data[subject].MOY ? student.data[subject].MOY.span : "" }}</td>
          </tr>
          <tr>
            <th class="left">EOY 360</th>
            <td class="score center cell">{{ student.data[subject].EOY ? student.data[subject].EOY.eng  : "" }}</td>
            <td class="score center cell">{{ student.data[subject].EOY ? student.data[subject].EOY.span : "" }}</td>
          </tr>
        </table>
      </div>
    </div>
    <!-- Interim result tables -->
    <table class="achieving-table">
      <tr>
        <th class="left sized-row-label">Probability of Achieving:</th>
        <th>Approaches</th>
        <th>Meets</th>
        <th>Masters</th>
      </tr>
      <tr>
        <th class="capitalize left sized-row-label">{{ subject }} Interim 1</th>
        <td class="center">{{ student.data[subject].interim_1 ? student.data[subject].interim_1.approaches : ""}}</td>
        <td class="center">{{ student.data[subject].interim_1 ? student.data[subject].interim_1.meets : "" }}</td>
        <td class="center">{{ student.data[subject].interim_1 ? student.data[subject].interim_1.masters : "" }}</td>
      </tr>
      <tr>
        <th class="capitalize left sized-row-label">{{ subject }} Interim 2</th>
        <td class="center">{{ student.data[subject].interim_2 ? student.data[subject].interim_2.approaches : ""}}</td>
        <td class="center">{{ student.data[subject].interim_2 ? student.data[subject].interim_2.meets : "" }}</td>
        <td class="center">{{ student.data[subject].interim_2 ? student.data[subject].interim_2.masters : "" }}</td>
      </tr>
    </table>
  </div>

</template>

<script>
//import fs from "fs";

export default {
  name: "Postcard",
  props: ["student", "subject"], //type is either math or english
  data() {
    return {
      identifier_width: null
    };
  },
  mounted() {
    this.identifier_width = (100 / this.student.identifiers.length) + "%";
    console.log(this.student)
  },
  methods: {

  },
};
</script>

<style>
/* Top block */
.top-block {
  width: 100%;
  height: 11.2em;

  display: flex;
  flex-direction: row;
}
.top-block-info {
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;
}
.student-image {
  height: 100%;
}

/* Student Profile */
.row-container {
  height: Calc(1.6em - 1px);
  border: 1px solid black;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
}
.name {
  width: 45%;
  text-align: left;
  padding: 0 0.5em;
}
.class-info {
  width: 27.5%;
}
.identifiers {
  height: Calc(1.6em - 2px);
  position: relative;
  top: -1px;
  justify-content: space-around;
  align-content: stretch;
}
.identifier {
  height: 100%;

}

/* Exam Table */
.exam-table {
  height: Calc(8em + 2px);
  width: Calc(100% + 1px);
  position: relative;
  top: -2px;
  right: 0px;
  border-collapse: collapse;
  table-layout: auto;
}
.cell-container {
  display: flex;
  flex-direction: row;
  align-items: center;
}


/* General Table Stylings */
table {
  border-collapse: collapse;
  table-layout: auto;
}

td, th {
  border: 1px solid black;
}
.sized-row-label {
  width: 11.1em;
}

.achieving-table {
  height: Calc(4.8em);
  width: 100%;
  position: relative;
}


th {
  background-color:#D8D8D8;
}

/* Card */
.card {
  position: relative;
  overflow: hidden;
  width: 28em;
  height: 16em;
}

/* Util */
.center {
  text-align: center;
  justify-content: center;
}
.left {
  text-align: left;
  padding: 0 0.5em;
}
.all-caps {
  text-transform: uppercase;
}
.capitalize {
  text-transform: capitalize;
}

/* Cells */
.cell {
  position: relative;
  border: 1px solid black;
  margin: auto 0;
  padding: 0 0.5em;
}
</style>
