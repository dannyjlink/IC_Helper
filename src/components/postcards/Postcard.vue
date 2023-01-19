<template>
  <div class="card">
    <div class="top-block">
      <img class="student-image" :src="student.image_path" />
      <div class="top-block-info">
          
          <!-- Name, grade, and class row-->
          <div class="profile-row border">
            <div class="cell-container name "><p class="profile-content">{{ student.name.last }}, {{ student.name.first }}</p></div>
            <!--div class="class-info-container"-->
              <div class="cell-container grade center"><p class="profile-content">{{ student.grade }}</p></div>
              <div class="cell-container teacher center"><p class="profile-content">{{ student.teacher }}</p></div>
            <!--/div-->
          </div>
          
          <!-- Identifiers -->
          <div class="row-container identifiers side-borders">
            <div class="cell-container center identifiers" 
              :style="{
                'width': 100 / student.identifiers.length + '%',  // Auto sizes identifier cells
                'border-right': index != student.identifiers.length - 1 ? '1px solid black' : 'none',  // Borders in-between identifiers, none on the last one since row is bordered
              }" 
              v-for="(identifier, index) in student.identifiers" :key="index">
              <p class="center" :style="{'font-size': identifierFontSize }">{{ identifier }}</p>
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
        <th class="left sized-row-label prob">Probability of Achieving:</th>
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
export default {
  name: "Postcard",
  props: ["student", "subject"], //type is either math or english

  computed: {
    identifierFontSize() {
      if (this.student.identifiers.length >= 5)
        return 'x-small !important';
      else 
        return 'smaller';
    },
  }
};
</script>

<style>
.prob {
  font-size: 12.5px !important;
}

/* Card */
.card {
  position: relative;
  overflow: hidden;
  width: 350px;
  height: 200px;
}
/* Top block */
.top-block {
  width: 100%;
  height: 140px;

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
  height: 19px;
  width: 100% - 3px;
  border: 1px solid black;
  display: flex;
  flex-flow: row nowrap;
}
.profile-row {
  height: 19px;
  width: 100% - 3px;
  border: 1px solid black;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
}
.profile-content {
  font-size: smaller;
}
.name {
  order: 0;
  text-align: left;
  padding: 0 6px;
}
.grade {
  order: 1;
}
.teacher {
  order: 2;
  position: relative;
  right: 0;
  padding: 0 6px;
}
.identifiers {
  height: 19px;
  position: relative;
  top: -1px;
  justify-content: space-around;
  align-content: stretch;
}

/* Exam Table */
.exam-table {
  height: 102px;
  width: Calc(100% + 1px);
  position: relative;
  top: -3px;
  left: 0px;
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
td {
  font-size: smaller;
}
td, th {
  border: 1px solid black;
}
.sized-row-label {
  width: 139px;
}
.achieving-table {
  height: 60px;
  width: 100%;
  position: relative;
}
th {
  background-color:#D8D8D8;
}

/* Util */
.center {
  text-align: center;
  justify-content: center;
}
.left {
  text-align: left;
  padding: 0 6px;
}
.all-caps {
  text-transform: uppercase;
}
.capitalize {
  text-transform: capitalize;
}
th {
  font-size: smaller;
}

/* Cells */
.cell {
  position: relative;
  border: 1px solid black;
  margin: auto 0;
  padding: 0 6px;
}
</style>
