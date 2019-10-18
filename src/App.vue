<template>
  <div id="app">
    <transition name="fade">
      <UploadCSV v-if="!uploaded" @parsed="setData"></UploadCSV>
    </transition>

    <transition name="fade">
      <DisplayStudents
        v-if="uploaded && !allocated"
        v-bind:data="data"
        v-bind:headers="headers"
        @back="resetDisplay"
        @results="setResults"
      ></DisplayStudents>
    </transition>

    <transition name="fade">
      <DisplayGroups v-if="allocated" v-bind:results="results" @back="resetGroups"></DisplayGroups>
    </transition>
  </div>
</template>

<script>
import UploadCSV from "./components/UploadCSV.vue";
import DisplayStudents from "./components/DisplayStudents.vue";
import DisplayGroups from "./components/DisplayGroups.vue";

export default {
  name: "app",
  data: function() {
    return {
      uploaded: false,
      allocated: false,
      data: [],
      headers: [],
      results: null
    };
  },
  methods: {
    setData(result) {
      this.data = result.data;
      this.headers = result.headers;
      this.uploaded = true;
    },
    resetDisplay() {
      this.uploaded = false;
    },
    setResults(result) {
      this.results = result;
      this.allocated = true;
    },
    resetGroups() {
      this.results = null;
      this.allocated = false;
    }
  },
  components: {
    UploadCSV,
    DisplayStudents,
    DisplayGroups
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
