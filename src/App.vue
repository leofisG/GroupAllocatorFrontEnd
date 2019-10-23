<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
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
    setResults(result) {
      this.results = result;
      this.allocated = true;
    },
    resetGroups() {
      this.results = null;
      this.allocated = false;
    }
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
