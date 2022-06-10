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
          ><div class="label">{{ file.label }}</div>
          <FileButton class="button" :label="file.id" :type="file.type" />
          <input
            v-if="file.type === 'directory'"
            @input="change(file.id, $event.target.files)"
            :id="file.id + '-input'"
            class="file-input"
            type="file"
            :style="{ display: 'none' }"
            webkitdirectory
          />
          <input
            v-else
            :id="file.id + '-input'"
            class="file-input"
            type="file"
            :accept="file.accept"
            @input="change(file.id, $event.target.files)"
            :style="{ display: 'none' }"
          />
        </label>
      </div>

      <!-- Right column will be for all the postcard outputs -->
      <div class="page-column output-column">
        <div v-if="students.length > samples">
          <Postcard v-for="i in samples" :key="i" :student="students[i]" :subject="'reading'"></Postcard>
        </div>
      </div>
    </div>
    <input type="submit" @click="submit()" />
  </main>
</template>

<script>
/*
import Printd from 'printd';
*/
import * as XLSX from "xlsx";
import fs from "fs";
import Postcard from "@/components/Postcard.vue";
import { HomeTab } from "@/components/menus";
import { FileButton } from "@/components/inputs";

export default {
  name: "PostcardMaker",

  components: {
    HomeTab,
    FileButton,
    Postcard,
  },

  data() {
    return {
      num_students: 0,
      processed: 0,
      samples: 1,
      files: [
        {
          label: "Student Data",
          id: "student_data",
          type: "single file",
          accept: ".xlsx, .csv",
          path: "D:\\Complete Data Set\\Student Data Files.xlsx",
        },
        {
          label: "Math Scores",
          id: "math",
          type: "directory",
          accept: ".xlsx, .csv",
          path: "D:\\Complete Data Set\\Math\\",
        },
        {
          label: "Reading Scores",
          id: "reading",
          type: "directory",
          accept: ".xlsx, .csv",
          path: "D:\\Complete Data Set\\Reading\\",
        },
        {
          label: "Student Photos",
          id: "photos",
          type: "directory",
          accept: ".png, .jpg",
          path: "D:\\Complete Data Set\\Student Photos 21-22\\images",
        },
      ],
      students: [],
      settings: {
        "3-5": true,
        "k-2": false,
        reading: true,
        math: true,
      },
    };
  },

  mounted() {
    XLSX.set_fs(fs);
    // Check for pre-existing file information
  },

  methods: {
    // Save filepath on user input
    change(id, files) {
      var path;
      // Find the filepath they chose if its a directory
      if (files.length > 1) {
        var paths = [];
        files.forEach((file) => paths.push(file.path));

        var k = paths[0].length;
        for (let i = 1; i < paths.length; i++) {
          k = Math.min(k, paths[i].length);
          for (let j = 0; j < k; j++) {
            if (paths[i][j] != paths[0][j]) {
              k = j;
              break;
            }
          }
        }
        path = paths[0].slice(0, k);
      } else path = files[0].path;
      
      this.files.find((file) => { return file.id === id; }).path = path;
      console.log("Path set for " + id + ": " + this.files.find((file) => { return file.id === id; }).path);
      this.save_files();
    },

    submit() {
      this.generate_postcards();
    },

    generate_postcards() {
      var students = [], studentIDs = [];
      // Get list of student names and their identifiers

      var studentData = this.parse_data(this.getPathByID("student_data"))[0]["data"];

      // DO CUSTOM FILTERS HERE NITWIT
      // Filter out inactive students and those in early enrollment
      studentData = studentData.filter((student) => {
        return (
          (student["Current Active"] || student["Current Active"] == "TRUE") &&
          student["Grade"] != "EE"
        );
      });

      console.log("Building " + studentData.length + " Student Profiles");

      let image_path = this.getPathByID('photos');
      for (let i = 0; i < studentData.length; i++) {
        let xlsx_student = studentData[i];
        let student = {
          name: {
            first: xlsx_student["First Name"],
            last: xlsx_student["Last Name"],
          },
          grade: this.grade_alias(xlsx_student["Grade"]),
          teacher: this.teacher_alias(xlsx_student["Teacher"]),
          student_id: xlsx_student["Student Number"],
          image_path: image_path + "\\" + xlsx_student["Student Number"] + ".jpg",
          identifiers: [],
          data: {
            math: {},
            reading: {},
          },
        };

        // Identifiers
        student.identifiers.push(this.race_alias(xlsx_student["Reported Federal Race"])); // Race first in array
        if (xlsx_student["LEP"] == "TRUE" || xlsx_student["LEP"] == true)
          student.identifiers.push("LEP");
        if (!isNaN(parseInt(xlsx_student["Eco Dis"])) && parseInt(xlsx_student["Eco Dis"]) > 0)
          student.identifiers.push("Eco Dis");
        if (this.checkTrue(xlsx_student["SPED"]))
          student.identifiers.push("SPED");
        if (this.checkTrue(xlsx_student["Dyslexia"]))
          student.identifiers.push("Dyslexic");
        if (this.checkTrue(xlsx_student["504"]))
          student.identifiers.push("504");
        if (this.checkTrue(xlsx_student["At Risk"]))
          student.identifiers.push("At Risk");
        if (this.checkTrue(xlsx_student["Gifted Talented"]))
          student.identifiers.push("GT");

        students.push(student);
        studentIDs.push(xlsx_student["Student Number"]);
        this.processed++;
      }

      // Handle Reading Scores
      if (this.settings.reading) {
        let subject = "reading";
        let files = this.ls(this.getPathByID(subject), true); // Collect all the files we'll need to parse
        // Run through files
        for (let f = 0; f < files.length; f++) {
          let file = files[f];
          let file_type = this.get_file_type(file);

          // Parse data and give it to appropriate student
          let data = this.parse_data(file.path)[0]["data"];

          // Filter data for only the students we're making cards for ["Student ID", "LOCAL-STUDENT-ID"]
          let id_label;
          if (file_type.test.match(/[B,M,E]OY/))
            id_label = "Student ID";
          else id_label = "LOCAL-STUDENT-ID";

          //console.log("Targetted students in " + file.name + ": " + data.length);

          for (let s = 0; s < data.length; s++) {
            let xlsx_student = data[s];
            let datapoints;
            let label = "";
            let student = students.find((s) => {
              return s["student_id"] == xlsx_student[id_label];
            });
            if (!student) continue;

            // Interim
            if (file_type.test.includes("Interim")) {
              label = file_type.test == "Interim 2" ? "interim_2" : "interim_1";
              datapoints = {
                approaches: xlsx_student["PROBABILITY OF ACHIEVING APPROACHES GRADE LEVEL"] + file_type.language[0].toUpperCase(),
                meets: xlsx_student["PROBABILITY OF ACHIEVING MEETS GRADE LEVEL"] + file_type.language[0].toUpperCase(),
                masters: xlsx_student["PROBABILITY OF ACHIEVING MASTERS GRADE LEVEL"] + file_type.language[0].toUpperCase(),
              };
            }
            // Star 360
            else if (file_type.test.match(/[B,M,E]OY/)) {
              label = file_type.test;
              datapoints = {
                eng: null,
                span: null,
              };
              datapoints[file_type.language] = xlsx_student["GE"];
              if (datapoints.eng != null && datapoints.span == null) {
                datapoints.span = "-";
              } else if (datapoints.eng == null && datapoints.span != null) {
                datapoints.eng = "-";
              }
            }
            // STAAR
            else if (file_type.test == "STAAR") {
              let columns = Object.keys(xlsx_student);
              let target;
              columns = columns.filter((key) => {
                return (key.indexOf("STAAR") > -1 && key.indexOf("Grade") > -1 && key.indexOf("Performance") > -1);
              });
              if (columns.length != 1) {
                console.log("Error in determining target column: " + file.name);
                continue;
              } else {
                target = columns[0];
              }

              label = file_type.test;
              datapoints = {
                eng: null,
                span: null,
              };
              datapoints[file_type.language] = this.STAAR_alias(xlsx_student[target]);

              if (datapoints.eng != null && datapoints.span == null)
                datapoints.span = "-";
              else if (datapoints.eng == null && datapoints.span != null)
                datapoints.eng = "-";
  
            }
            student.data[subject][label] = datapoints;
          }

          
        }
      }

      // Handle Math Scores
      if (this.settings.math) {
        let subject = "math";
        let files = this.ls(this.getPathByID(subject), true); // Collect all the files we'll need to parse
        // Run through files
        for (let f = 0; f < files.length; f++) {
          let file = files[f];
          let file_type = this.get_file_type(file);

          let data = this.parse_data(file.path)[0]["data"];
          let id_label;
          if (file_type.test.match(/[B,M,E]OY/)) id_label = "Student ID";
          else id_label = "LOCAL-STUDENT-ID";

          for (let s = 0; s < data.length; s++) {
            let xlsx_student = data[s];
            let datapoints;
            let label = "";
            let student = students.find((s) => { return s["student_id"] == xlsx_student[id_label]; });
            if (!student) continue;

            // Interim
            if (file_type.test.includes("Interim")) {
              label = file_type.test == "Interim 2" ? "interim_2" : "interim_1";
              datapoints = {
                approaches: xlsx_student["PROBABILITY OF ACHIEVING APPROACHES GRADE LEVEL"] + file_type.language[0].toUpperCase(),
                meets: xlsx_student["PROBABILITY OF ACHIEVING MEETS GRADE LEVEL"] + file_type.language[0].toUpperCase(),
                masters: xlsx_student["PROBABILITY OF ACHIEVING MASTERS GRADE LEVEL"] + file_type.language[0].toUpperCase(),
              };
            }
            // Star 360
            else if (file_type.test.match(/[B,M,E]OY/)) {
              label = file_type.test;
              datapoints = {
                eng: null,
                span: null,
              };
              datapoints[file_type.language] = xlsx_student["GE"];
              if (datapoints.eng != null && datapoints.span == null) {
                datapoints.span = "-";
              } else if (datapoints.eng == null && datapoints.span != null) {
                datapoints.eng = "-";
              }
            }
            // STAAR
            else if (file_type.test == "STAAR") {
              let columns = Object.keys(xlsx_student);
              let target;
              columns = columns.filter((key) => {
                return (
                  key.indexOf("STAAR") > -1 &&
                  key.indexOf("Grade") > -1 &&
                  key.indexOf("Performance") > -1
                );
              });
              if (columns.length != 1) {
                console.log("Error in determining target column: " + file.name);
                continue;
              } else {
                target = columns[0];
              }

              label = file_type.test;
              datapoints = {
                eng: null,
                span: null,
              };
              datapoints[file_type.language] = xlsx_student[target];
              if (datapoints.eng != null && datapoints.span == null) {
                datapoints.span = "-";
              } else if (datapoints.eng == null && datapoints.span != null) {
                datapoints.eng = "-";
              }
            }
            student.data[subject][label] = datapoints;
          }
        }
      }
      this.students = students;
    },

    /* Utility and Parsing Functions */
    checkTrue(val) {  // I'm extremely lazy but paranoid :^)
      return (val == "TRUE" || val == true);
    },
    parse_data(path) {
      //console.log("Attempting excel conversion: " + path);

      const excelData = XLSX.readFile(path);
      return Object.keys(excelData.Sheets).map((name) => ({
        name,
        data: XLSX.utils.sheet_to_json(excelData.Sheets[name]),
      }));
    },

    getPathByID(id) {
      var result = this.files.find((file) => {
        return file.id === id;
      }).path;
      //console.log("Got path for " + id + ": " + result);
      return result;
    },

    // Gets full paths of subdirectories of the path given
    getSubFolders(path) {
      var filenames = fs.readdirSync(path);
      var result = [];
      for (let i = 0; i < filenames.length; i++) {
        var filename = path + filenames[i];
        // Filename & extension will be the same if no '.' since it would be substring(-1 + 1) => substring(0)
        var extension = filename.substring(filename.lastIndexOf(".") + 1);
        console.log("ext: " + extension);
        if (extension === filename) {
          result.push(filename);
        }
      }
      return result;
    },

    // Gets full path of all files within the path you give it.
    ls(path, recursive = false) {
      const entries = fs.readdirSync(path, { withFileTypes: true });

      // Get files within the current directory and add a path key to the file objects
      const files = entries
        .filter((file) => !file.isDirectory())
        .map((file) => ({ ...file, path: path + file.name }));

      // Get folders within the current directory
      const folders = entries.filter((folder) => folder.isDirectory());
      if (recursive) {
        for (const folder of folders)
          files.push(...this.ls(`${path}${folder.name}\\`));
      }
      return files;
    },

    /* Test Score related functions */
    // Breaks down file name and path into a JSON object
    get_file_type(file) {
      var result = {};
      // Determine file type and timepoint
      // result.test: ["BOY", "MOY", "EOY", "STAAR", "Interim 1", "Interim 2"]
      // result.grade: ["Pre-K", "Kinder", "1st", ... , "5th"]
      // result.language: ["eng", "span"]

      // Find test and timepoint
      if (
        file.path.indexOf("Interim 2") > -1 ||
        file.name.indexOf("Interim2") > -1
      )
        result.test = "Interim 2";
      else if (file.path.indexOf("Interim") > -1) result.test = "Interim 1";
      else if (file.path.indexOf("STAAR") > -1) result.test = "STAAR";
      else if (
        file.path.indexOf("Star 360") > -1 ||
        file.name.search(/[B,M,E]OY/) > -1
      ) {
        var i = file.name.search(/[B,M,E]OY/);
        if (i > -1) {
          result.test = file.name.substring(i, i + 3);
        }
      }

      // Find grade possible targets to look for where X is the grade number: ["GradeX", "Xth", "Xrd", "Xst", "Xnd"]
      // Look for "1st"- "5th" in file name. TODO: Pre-K and Kinder regex
      var case1 = file.name.search(/([1-5]([a-z]{2}))/);
      var case2 = file.name.search(/(Grade[1-5])/);
      if (case1 > -1) {
        result.grade = file.name.match(/([1-5]([a-z]{2}))/)[0];
      } else if (case2 > -1) {
        var grade = file.name.match(/(Grade[1-5])/)[0];
        grade = grade[grade.length - 1]; // Should just be a number at this point
        switch (grade) {
          case "1":
            result.grade = "1st";
            break;
          case "2":
            result.grade = "2nd";
            break;
          case "3":
            result.grade = "3rd";
            break;
          case "4":
            result.grade = "4th";
            break;
          case "5":
            result.grade = "5th";
            break;
        }
      }

      // Language
      if (file.name.indexOf("Span") > -1 || file.name.indexOf("span") > -1)
        result.language = "span";
      else {
        result.language = "eng";
      }
      return result;
    },

    /* Settings related functions */
    save_files() {
      //Store.set('files', this.files);
    },

    initialize_files() {
      /*
      // Initialize file paths
      if (Store.get('files') == null) {
        // First time user
        this.save_files();
      } else {  // Return user
        this.files = Store.get('files');
      }
      */
    },

    /* Student data renaming functions */
    race_alias(race) {
      switch (race) {
        case "Two or More Races":
          return "Multi";
        case "Hispanic/Latino":
          return "Hispanic";
        case "Black or African American":
          return "Black";
        case "White":
          return "White";
        case "American Indian or Alaska Native":
          return "AI/AN";
        case "Native Hawaiian or Other Pacific Islander":
          return "NH/PI";
        case "":
          return null;
      }
    },

    grade_alias(grade) {
      switch (grade) {
        case "PK":
          return "Pre-K";
        case "KG":
          return "Kinder";
        case "01":
          return "1st grade";
        case "02":
          return "2nd grade";
        case "03":
          return "3rd grade";
        case "04":
          return "4th grade";
        case "05":
          return "5th grade";
      }
    },
    // Finds teacher last name and returns it formatted
    teacher_alias(teacher) {
      if (teacher == "" || teacher == null) return;
      // Split into first, middle, and last name
      var names = teacher.split(" ");
      var name = names.length == 1 ? names[0] : names[names.length - 1]; // If only one name, assume it's their last name
      // Normalize caps and format
      name = name.toLowerCase();
      name = name[0].toUpperCase() + name.substring(1);
      //console.log("Teacher: " + name);
      return name;
    },
    // Shortens STAAR results
    STAAR_alias(score) {
      if (score.includes("Masters")) return "Masters"
      else if(score.includes("Meets")) return "Meets"
      else if(score.includes("Approaches")) return "Approaches"
    }
  },
};
</script>

<style scoped>
/* File input elements */
.file-input-container {
  width: 75%;
  height: 3.5em;
  padding: 1em;

  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.label {
  order: 1;
}
.button {
  order: 2;
  position: relative;
  width: 10em;
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
  align-items: center;
}
.page-header {
  width: 95%;
  text-align: center;
  order: 1;
}
.two-column-container {
  width: 95%;
  height: 50%;
  order: 2;
  margin: 1em auto;
  display: flex;
  flex-direction: row;
}
.page-column {
  width: 50%;
  margin: auto 5em;
  display: flex;
  flex-direction: column;
  flex-basis: flex-start;
}

.output-column {
  overflow-y: scroll !important;
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
