<template>
  <div id="login">
    <v-app>
        <v-content>
          <v-container
            fluid
            fill-height
          >
            <v-layout
              align-center
              justify-center
            >
              <v-flex
                xs12
                sm8
                md4
              >
                <v-card class="elevation-12">
                  <v-toolbar
                    color="primary"
                    dark
                    flat
                  >
                    <v-toolbar-title>Login form</v-toolbar-title>
                    <v-spacer></v-spacer>
                  </v-toolbar>
                  <v-card-text>
                    <v-form>
                      <v-text-field
                        label="Login"
                        name="login"
                        prepend-icon="person"
                        type="text"
                      ></v-text-field>

                      <v-text-field
                        id="password"
                        label="Password"
                        name="password"
                        prepend-icon="lock"
                        v-model="password"
                        type="password"
                      ></v-text-field>
                    </v-form>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" @click="setPassword">Login</v-btn>
                  </v-card-actions>
                </v-card>
                <v-dialog v-model="isPasswordWrong" max-width="400">
                  <v-card>
                    <v-card-title
                      class="headline justify-center"
                    >Incorrect Password</v-card-title>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn text @click="closeWrongPasswordPopUp">Try Again</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-flex>
            </v-layout>
          </v-container>
        </v-content>
      </v-app>
  </div>
</template>

<script>
var crypto = require('crypto');

export default {
  name: "login",
  data() {
    return {
      password: "",
      isPasswordWrong: false
    };
  },
  methods: {
    openWrongPasswordPopUp() {
      this.isPasswordWrong = true
    },
    closeWrongPasswordPopUp() {
      this.isPasswordWrong = false
    },
    setPassword() {
      const correctPasswordHash = "19d8ab3b0210ddf9a86771ffc38d0a9d";
      const currentPasswordHash = this.hashMD5(this.password);
      if (currentPasswordHash === correctPasswordHash) {
        this.$store.commit("authenticateUser");
        this.$router.push({ path: "uploadcsv" });
      } else {
        this.showWrongPasswordPopUp()
      }
    },
    hashMD5(password) {
      return crypto.createHash('md5').update(password).digest("hex");
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
