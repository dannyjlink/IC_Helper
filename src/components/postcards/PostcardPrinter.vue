<template>
  <div class="pdf">
    <div class="page" :style="page_style" v-for="(page, index) of pages" :key="'page-' + index">
      <div class="printer-card-container" v-for="(student, index) of page" :key="'printer-student-' + index"
        :style="card_container_style">
        <Postcard v-for="subject in Object.keys(student.data)" :class="'printer-postcard' + ' ' + subject"
          :key="'printer-' + student.student_id + '-' + subject" :student="student" :subject="subject" 
          />
      </div>
      <div class="html2pdf__page-break" />
    </div>
  </div>
</template>

<script>
import Postcard from "./Postcard.vue";

export default {
  name: "PostcardPrinter",
  props: ["classroom"],

  components: {
    Postcard,
  },
  computed: {
    students_per_page() {
      if (Object.keys(this.classroom).length == 0)
        return;
      
      var students = this.classroom[Object.keys(this.classroom)[0]];
      return (10 / Object.keys(students[0].data).length);
    },

    pages() {
      if (Object.keys(this.classroom).length == 0)
        return;

      var students = this.classroom[Object.keys(this.classroom)[0]];

      var pages = [], curr_page = [];
      for (let i = 0; i < students.length; i++) {
        if (i % this.students_per_page == 0 && i != 0) {
          pages.push(curr_page);
          curr_page = [students[i]];
        }
        else
          curr_page.push(students[i]);
      }
      pages.push(curr_page)
      return pages;
    },
    page_style() {
      if (!this.pages)
        return {};
      if (Object.keys(this.pages[0]).length == 5)  // 5 students per page
        return {
          width: '751px',
          height: '1051px',
          margin: '24px 48px 25px 51px',
          display: 'flex',
          'flex-flow': 'column nowrap',
          'justify-content': 'space-between',
        };
      else
        return {  // 10 students per page
          width: '751px',
          height: '1051px',
          margin: '24px 48px 25px 51px',
          display: 'flex',
          'flex-flow': 'row wrap',
          'justify-content': 'flex-start',
          'background-color': 'red',
        };
    },
    card_container_style() {
      if (!this.pages)
        return {};
      

      if (this.students_per_page == 5)  // 5 students per page
        //margin: '5px 0',
        return {
          width: '100%',
          height: '210px',
          margin: '5px 0',
          display: 'flex',
          'flex-flow': 'row nowrap',
          'justify-content': 'space-between',
        };
      else
        return {  // 10 students per page
          width: '350px',
          height: '200px',
          'margin-top': '5px',
          'margin-bottom': '5px',
        };
    },
  },
  

}

</script>

<style>
.pdf {
  width: 751px;
  display: flex;
  flex-flow: column nowrap;
}
.html2pdf__page-break {
  margin: 0 !important;
}
.printer-postcard {
  height: 200px;
  width: 350px;
}
</style>