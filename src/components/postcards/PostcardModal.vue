<template>
  <div class="modal-sheet-container">
    <div class="modal-card-container"
      v-for="(student, index) in students"
      :key="'modal-student-' + index"
    >
      <Postcard class="modal-postcard"
        v-for="subject in Object.keys(student.data)"
        :key="'modal-' + student.student_id + '-' + subject"
        :student="student" :subject="subject"
      />
    </div>
  </div>
</template>

<script>
import Postcard from "./Postcard.vue";

export default {
  name: "PostcardModal",

  props: ["classroom"],

  components: {
    Postcard,
  },

  computed: {
    students() {
      if (Object.keys(this.classroom).length == 0) 
        return [];
      
      var key = Object.keys(this.classroom)[0]
      return this.classroom[key];
    }
  },

}

</script>

<style>
.modal-sheet-container {
  display: flex;
  flex-flow: row wrap;
  overflow-y: scroll;
}
.modal-card-container {
  width: 100%;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-around;
}
.modal-postcard {
  height: 200px;
  width: 350px;
}


</style>