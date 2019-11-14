<template>
  <div id="upload">
    <v-app>
      <v-content>
        <v-row align="start" justify="start">
          <v-col cols="3">
            <v-row align="baseline">
              <p class="display-3 mx-3">Student Allocator</p>
              <p align="center" justify="center">with</p>
            </v-row>
          </v-col>
          <v-col cols="9">
            <v-img max-width="9%" src="../assets/Logo/IB_LOGO_STACK_RGB_POSITIVE_RED.png"></v-img>
          </v-col>
        </v-row>
        <v-container fluid>
          <v-row justify="center">
            <p class="display-2">A quick guide:</p>
          </v-row>
          <v-row justify="center">
            <v-col cols="6" align="center" justify="center">
              <v-carousel v-model="tutorialCarousel">
                <v-carousel-item>
                  <v-sheet color="white lighten-1" height="100%" tile>
                    <v-row class="fill-height" align="center" justify="center">
                      <div class="display-1 black--text">Upload a valid student CSV file</div>
                      <v-img max-width="90%" src="../assets/tutorial/EXCEL_x34u2VxmaP.png"></v-img>
                    </v-row>
                  </v-sheet>
                </v-carousel-item>
                <v-carousel-item>
                  <v-sheet color="white lighten-3" height="100%" tile>
                    <v-row align="start" justify="center">
                      <div class="display-1 black--text">Select desired filters</div>
                    </v-row>
                    <v-row class="fill-height" align="center" justify="center">
                      <v-img max-width="30%" src="../assets/tutorial/chrome_SXtjE1ZVEe.png"></v-img>
                    </v-row>
                  </v-sheet>
                </v-carousel-item>
                <v-carousel-item>
                  <v-sheet color="white" height="100%" tile>
                    <v-row align="start" justify="center">
                      <div class="display-1 black--text">Adjust filters</div>
                    </v-row>
                    <v-row class="fill-height" align="center" justify="center">
                      <v-spacer></v-spacer>
                      <v-img max-width="30%" src="../assets/tutorial/chrome_alvUfTT6KZ.png"></v-img>
                      <v-spacer></v-spacer>
                      <v-img max-width="30%" src="../assets/tutorial/chrome_HR41FhvWbU.png"></v-img>
                      <v-spacer></v-spacer>
                    </v-row>
                  </v-sheet>
                </v-carousel-item>
                <v-carousel-item>
                  <v-sheet color="white" height="100%" tile>
                    <v-row align="start" justify="center">
                      <div class="display-1 black--text">Submit allocation when ready</div>
                    </v-row>
                    <v-row class="fill-height" align="center" justify="center">
                      <v-img max-width="30%" src="../assets/tutorial/chrome_M5Ad1FoxF8.png"></v-img>
                    </v-row>
                  </v-sheet>
                </v-carousel-item>
                <v-carousel-item>
                  <v-sheet color="white" height="100%" tile>
                    <v-row align="start" justify="center">
                      <div class="display-1 black--text">Adjust manually if necessary</div>
                    </v-row>
                    <v-row class="fill-height" align="center" justify="center">
                      <v-spacer></v-spacer>
                      <v-img max-width="20%" src="../assets/tutorial/chrome_9dFNeCSr7P.png"></v-img>
                      <v-spacer></v-spacer>
                      <v-img max-width="30%" src="../assets/tutorial/chrome_26VVbYWwSd.png"></v-img>
                      <v-spacer></v-spacer>
                    </v-row>
                  </v-sheet>
                </v-carousel-item>
                <v-carousel-item>
                  <v-sheet color="white" height="100%" tile>
                    <v-row align="start" justify="center">
                      <div class="display-1 black--text">Allocate remaining students</div>
                    </v-row>
                    <v-row class="fill-height" align="center" justify="center">
                      <v-img max-width="40%" src="../assets/tutorial/chrome_Lbe0hjuBZC.png"></v-img>
                    </v-row>
                  </v-sheet>
                </v-carousel-item>
                <v-carousel-item>
                  <v-sheet color="white" height="100%" tile>
                    <v-row align="start" justify="center">
                      <div class="display-1 black--text">Check validation statuses</div>
                    </v-row>
                    <v-row class="fill-height" align="center" justify="center">
                      <v-img max-width="40%" src="../assets/tutorial/chrome_wXReyQM7o9.png"></v-img>
                    </v-row>
                  </v-sheet>
                </v-carousel-item>
                                <v-carousel-item>
                  <v-sheet color="white" height="100%" tile>
                    <v-row align="start" justify="center">
                      <div class="display-1 black--text">Download when ready!</div>
                    </v-row>
                    <v-row class="fill-height" align="center" justify="center">
                      <v-img max-width="40%" src="../assets/tutorial/chrome_EutW9oQj3H.png"></v-img>
                    </v-row>
                  </v-sheet>
                </v-carousel-item>
              </v-carousel>
            </v-col>
          </v-row>
          <v-row justify="center">
            <v-col cols="6">
              <v-card class="elevation-12">
                <v-toolbar color="primary" dark flat>
                  <v-spacer></v-spacer>
                  <v-toolbar-title>Start by uploading a CSV file</v-toolbar-title>
                  <v-spacer></v-spacer>
                </v-toolbar>
                <v-card-text>
                  <v-form>
                    <v-file-input
                      @change="resetMsg"
                      v-model="file"
                      ref="file"
                      accept=".csv"
                      label="Choose a CSV file"
                      show-size
                    ></v-file-input>
                  </v-form>
                  <v-alert
                    type="error"
                    v-bind:style="messageStyle"
                    v-if="message != &quot;&quot;"
                  >{{ message }}</v-alert>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn v-if="this.file" @click="parse" color="primary">Continue</v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-content>
    </v-app>
  </div>
</template>

<script>
import { parse } from "../utility/parser/myparser";

export default {
  name: "upload",
  data() {
    return {
      tutorialCarousel: 0,
      message: "",
      messageStyle: {
        color: "black"
      },
      file: null,
      validFile: true
    };
  },
  methods: {
    processCSV() {
      this.noFile = false;
      this.file = this.$refs.file.files[0];
      this.fileName = `You have uploaded ${this.file.name}`;
      parse(this.file);
    },
    resetMsg() {
      this.message = "";
    },
    parse() {
      parse(this.file, this);
    },
    displayErrors(amount) {
      this.file = null;
      this.message = `There were ${amount} errors parsing the csv file!`;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
