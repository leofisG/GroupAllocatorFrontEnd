<template>
  <div id="app">
    <transition name="fade">
      <UploadCSV v-if="!uploaded" @parsed="setData"></UploadCSV>
    </transition>

    <transition name="fade">
      <DisplayStudents
        v-if="uploaded"
        v-bind:data="data"
        v-bind:headers="headers"
        @back="resetScreen"
      ></DisplayStudents>
    </transition>
  </div>
</template>

<script>
import UploadCSV from "./components/UploadCSV.vue";
import DisplayStudents from "./components/DisplayStudents.vue";

export default {
  name: "app",
  data: function() {
    return {
      uploaded: false,
      data: [],
      headers: []
    };
  },
  methods: {
    setData(result) {
      this.data = result.data;
      this.headers = result.headers;
      this.uploaded = true;
    },
    resetScreen() {
      this.uploaded = false;
    }
  },
  components: {
    UploadCSV,
    DisplayStudents
  },
  created() {
    document.title = "Student allocator";
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
