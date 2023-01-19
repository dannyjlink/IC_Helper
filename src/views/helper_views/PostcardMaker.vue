<template>
  <main>
    <HomeTab id="back-tab" />
    <div class="page-header" ref="top">
      <h1 class="page-title">Postcard Maker</h1>
      <div class="text-container">
        <p>
          This page will generate 'postcards' for the students you give it data for.
          Some data may not be collected due to variation in formatting or incorrect cell targetting.
          Anything marked with '-' means it's a correct omission. No data goes there for that student.
          Blank cells should be cross-referenced with the source data before
        </p>
      </div>
    </div>

    <div class="body-container">
      <!--User Input Form-->
      <form class="options">
        <!--Left Column: file inputs-->
        <div class="form-column">
          <h2 class="column-header">Files</h2>
          <div class="file-input-container" v-for="file in files" :key="file.id">
            <label>{{ file.label }}</label>
            <FileButton :label="file.id" :type="file.type" />
          </div>
        </div>

        <!--Right Column: filters-->

        <div class="form-column">
          <h2 class="column-header">Filters</h2>
          <div class="filter-content">

            <div v-for="(qualifier, index) in Object.keys(filters)" :key="index" class="filter-section">
              <h3 class="section-header capitalize">{{ qualifier }}</h3>
              <div class="checkbox-container" v-for="item in filters[qualifier]" :key="item.alias">
                <label>{{ item.label }}</label>
                <input type="checkbox" v-model="item.include" />
              </div>
            </div>
          </div>
        </div>
      </form>

      <!--Action Buttons-->
      <div class="multi-button-container generate-buttons">
        <TextButton class="submit-button" text="Generate Postcards" alias="submit" @btn-click="generate_postcards()" />
        <TextButton v-if="generated" class="submit-button" text="Reset" alias="reset" @btn-click="reset()" />
      </div>

      <!--Postcard Printer-->
      <vue-html2pdf class="printable" ref="html2Pdf" v-if="generated" :enable-download="true" :preview-modal="true"
        :show-layout="false" :filename="filename" :pdf-quality="2" :manual-pagination="true" pdf-format="letter"
        pdf-orientation="portrait" :html-to-pdf-options="opts">
        <PostcardPrinter class="sheet-container pdf-content" slot="pdf-content" :classroom="current_class"
          :filters="filters" />
      </vue-html2pdf>
      <PostcardModal v-if="generated" class="preview-window" :classroom="current_class" />

      <div class="multi-button-container print-buttons" v-show="generated">
        <TextButton class="submit-button" text="Previous Class" alias="prev" @btn-click="previousClass()" />
        <TextButton class="submit-button" text="Print to PDF" alias="print" @btn-click="exportToPDF()" />
        <TextButton class="submit-button" text="Next Class" alias="next" @btn-click="nextClass()" />
      </div>
    </div>
  </main>
</template>

<script>
import fs from "fs";
import * as XLSX from "xlsx";
import VueHtml2pdf from 'vue-html2pdf';
import { HomeTab } from "@/components/menus";
import { FileButton, TextButton } from "@/components/inputs";
import { PostcardPrinter, PostcardModal } from "@/components/postcards";

export default {
  name: "PostcardMaker",

  components: {
    HomeTab,
    FileButton,
    TextButton,
    VueHtml2pdf,
    PostcardPrinter,
    PostcardModal
  },

  data() {
    return {
      num_students: 0,
      num_subjects: 2,
      processed: 0,
      generated: false,

      filters: {
        // Alias refers to what that grade appears as in student data. 
        // Necessary for filtering grades
        grades: [
          {
            label: 'Pre-K',
            alias: 'PK',
            include: false,
          },
          {
            label: 'Kinder',
            alias: 'KG',
            include: false,
          },
          {
            label: '1st Grade',
            alias: '01',
            include: false,
          },
          {
            label: '2nd Grade',
            alias: '02',
            include: false,
          },
          {
            label: '3rd Grade',
            alias: '03',
            include: true,
          },
          {
            label: '4th Grade',
            alias: '04',
            include: true,
          },
          {
            label: '5th Grade',
            alias: '05',
            include: true,
          },
        ],
        // alias links the subject filter to it's respective this.file id
        // Necessary for filtering subjects
        subjects: [
          {
            label: "Reading",
            alias: "reading",
            include: true,
          },
          {
            label: "Math",
            alias: "math",
            include: true,
          }
        ]
      },
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
        {
          label: "Postcard Save Location",
          id: "output",
          type: "directory",
          path: "C:\\Users\\danny\\Downloads",
        }
      ],
      // opts: {
      //   margin: 0,
      //   image: {
      //     type: 'jpeg',
      //     quality: 2.0
      //   },

      //   enableLinks: false,
      //   html2canvas: {
      //     scale: 1,
      //     width: 850,
      //     useCORS: true
      //   },

      //   jsPDF: {
      //     unit: "px",
      //     hotfixes: ["px_scaling"],
      //     format: "letter",
      //     orientation: "portrait",
      //   },
      // },
      students: {},
      classrooms: [],
      current_class_index: 0,
    };
  },

  mounted() {
    XLSX.set_fs(fs);
  },

  computed: {
    current_class() {
      if (this.generated == false)
        return []
      return this.classrooms[this.current_class_index];
    },
    opts() {
      var fname = this.filename;
      return {
        margin: 0,
        filename: fname,
        image: {
          type: 'jpeg',
          quality: 2.0
        },

        enableLinks: false,
        html2canvas: {
          scale: 1,
          width: 850,
          useCORS: true
        },

        jsPDF: {
          unit: "px",
          hotfixes: ["px_scaling"],
          format: "letter",
          orientation: "portrait",
        }
      }
    },
    filename() {
      if (this.generated == false)
        return []

      var teacher = Object.keys(this.classrooms[this.current_class_index]);

      var grade = "";
      for (const grade_level of Object.keys(this.students)) {
        if (Object.keys(this.students[grade_level]).includes(teacher)) {
          grade = Object.keys(this.students)[grade_level];
          grade = grade_level;
          break;
        }
      }
      var subjects = "";
      // 3rd-Walker-reading+math.pdf
      for (const subject of this.filters.subjects) {
        if (subjects == "" && subject.include)
          subjects += subject.alias;
        else if (subject.include)
          subjects += '+' + subject.alias;
      }

      var filename = grade + '-' + teacher + '-' + subjects + '.pdf';
      return filename;
      // Should look something like below
      // 3rd-Walker-reading+math.pdf
      // 3rd-Walker-reading.pdf
      // 3rd-Walker-math.pdf
    }
  },

  methods: {
    reset() {
      this.generated = false;
      this.current_class_index = 0;
      this.classrooms = [];
      this.students = {};
    },
    nextClass() {
      // Check there is another class within the grade
      // TODO: Make sure it sets to 0 on over-increment
      this.current_class_index += 1;
      if (this.current_class_index >= this.classrooms.length)
        this.current_class_index = 0;

    },
    previousClass() {
      this.current_class_index -= 1;
      if (this.current_class_index < 0)
        this.current_class_index = this.classrooms.length - 1;
    },
    exportToPDF() {
      this.$refs['html2Pdf'].generatePdf()
    },
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

    generate_postcards() {
      // Need to reset sub-components
      this.generated = false;
      this.students = [];
      this.classrooms = [];
      this.current_class_index = 0;

      var students = [], studentIDs = [];

      // Get list of student names and their identifiers
      var studentData = this.parse_data(this.getPathByID("student_data"))[0]["data"];

      // Filter out inactive students and those in early enrollment
      studentData = studentData.filter((student) => {
        return (this.checkTrue(student["Current Active"]) && student["Grade"] != "EE");
      });

      /* User Filters */
      // Grade Levels
      for (let i = 0; i < this.filters.grades.length; i++) {
        var grade = this.filters.grades[i];
        if (grade.include == false) {
          //console.log("Not including " + grade.label);
          studentData = studentData.filter((student) => {
            return (this.checkTrue(student["Current Active"]) && student["Grade"] != grade.alias);
          });
        }
      }

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
          image_path: "",
          identifiers: [],
          data: {}
        };
        // Check student's image exists
        try {
          const path = image_path + "\\" + student.student_id + ".jpg"
          if (fs.existsSync(path))
            student.image_path = path;
          else
            student.image_path = image_path + "\\default.jpg";
        } catch (err) {
          console.log(err);
        }

        // Add only the selected subjects
        for (let i = 0; i < this.filters.subjects.length; i++) {
          var subject_area = this.filters.subjects[i];
          if (subject_area.include) {
            student.data[subject_area.alias] = {};
          }
        }

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

      /* Test Score Parsing */
      this.num_subjects = 0;
      for (let i = 0; i < this.filters.subjects.length; i++) {
        this.num_subjects++;
        var subject = this.filters.subjects[i];
        //console.log(subject.alias + ": " + subject.include);
        if (subject.include == false)
          continue;

        // Acquire and iterate through files for this subject
        let files = this.ls(this.getPathByID(subject.alias), true);
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
            student.data[subject.alias][label] = datapoints;
          }
        }
      }
      this.sort_students(students)
      this.generated = true;
    },

    // Sorts students into their classroom teachers and teachers into their grade
    sort_students(unsorted_students) {
      var students = unsorted_students;

      // Iterate through the grades included in the filters
      var grade_levels = this.filters.grades.filter((grade) => {
        if (grade.include)
          return true;
      })

      // Iterate through grades
      for (let i = 0; i < grade_levels.length; i++) {
        var target_grade = this.grade_revert(grade_levels[i].alias);

        var grade = students.filter((student) => {
          if (student.grade == target_grade)
            return true;
        });

        var sorted = {}
        // Split them into classes for organization purposes regarding this.students
        while (grade.length > 0) {
          let student = grade.shift();
          let teacher = student.teacher

          if (!Object.keys(sorted).includes(teacher))
            sorted[teacher] = [student];
          else
            sorted[teacher].push(student);
        }

        // Flatten grade into array of just classrooms for iteration purposes
        for (const teacher of Object.keys(sorted)) {
          var classroom = { [teacher]: sorted[teacher] }
          this.classrooms.push(classroom);
        }

        this.students[target_grade] = sorted;
      }
    },
    // Returns what the filter.grade.alias appears as in the student data
    grade_revert(grade) {
      switch (grade) {
        case "PK":
          return "Pre-K";
        case "KG":
          return "Kinder";
        case "01":
          return "1st";
        case "02":
          return "2nd";
        case "03":
          return "3rd";
        case "04":
          return "4th";
        case "05":
          return "5th";
      }
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
          return "1st";
        case "02":
          return "2nd";
        case "03":
          return "3rd";
        case "04":
          return "4th";
        case "05":
          return "5th";
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
      else if (score.includes("Meets")) return "Meets"
      else if (score.includes("Approaches")) return "Approaches"
    }
  },
};
</script>

<style scoped>
main {
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  position: absolute;
  overflow-x: hidden;
  overflow-y: scroll;
  background-color: #eef1ef;
  display: flex;
  flex-direction: column;
  align-items: center;
}

#back-tab {
  top: 0;
}

.body-container {
  display: flex;
  flex-flow: column nowrap;
  width: 100%;
  padding: 2.5em;
  order: 2;
}

.page-header {
  width: 95%;
  text-align: center;
  order: 1;
}

.page-title {
  font-size: xx-large;
  font-family: "Spoof Bold";
}

.text-container {
  width: 95%;
}

.options {
  display: flex;
  flex-flow: row nowrap;
  width: 100%;
}

.column-header {
  text-align: center;
}

/* File Input Column */
.form-column {
  display: flex;
  flex-flow: column nowrap;
  width: 50%;
}

.file-input-container {
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: space-between;
  width: 80%;
  padding: 1em 10%;
}

/* Filter Column */
.filter-content {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-around;
}

.filter-section {
  width: 30%;
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
}

.section-header {
  align-self: center;
}

.checkbox-container {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  padding: 0.25em 0;
}

.capitalize {
  text-transform: capitalize;
}

/* Action Buttons and previewer */
.multi-button-container {
  width: 60%;
  align-self: center;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-around;
}

.generate-buttons {
  order: 2;
}

.print-buttons {
  order: 4;
}

.preview-window {
  height: 750px;
  padding-top: 2em;
  order: 3;
}
</style>
