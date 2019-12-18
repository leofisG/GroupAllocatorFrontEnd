<template>
  <div id="login">
    <v-app>
      <v-content>
        <v-container fluid>
          <v-row justify="center">
            <v-col cols="12" align="center">
              <h2 class="display-2">Student Allocator</h2>
              <p class="subtitle-1 font-italic" id="in-collaboration">In collaboration with</p>
              <v-img
                align="end"
                max-width="30%"
                src="../assets/Edtech/IB_LOGO_EDTECH_RGB_POSITIVE_GREEN.png"
              ></v-img>
            </v-col>
          </v-row>
          <v-row justify="center" class="fill-height">
            <v-col cols="4">
              <v-card class="elevation-12">
                <v-toolbar color="primary" dark flat>
                  <v-spacer></v-spacer>
                  <v-toolbar-title>Login to continue</v-toolbar-title>
                  <v-spacer></v-spacer>
                </v-toolbar>
                <v-card-text>
                  <v-form onsubmit="return false" id="loginForm" @submit="setPassword">
                    <v-text-field label="Login" name="login" prepend-icon="person" type="text"></v-text-field>
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
                  <v-btn color="primary" type="submit" form="loginForm">Login</v-btn>
                </v-card-actions>
              </v-card>
              <v-dialog v-model="isPasswordWrong" max-width="400">
                <v-card>
                  <v-card-title class="headline justify-center">Incorrect Password</v-card-title>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="green" text @click="closeWrongPasswordPopUp">Try Again</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-col>
          </v-row>
        </v-container>
      </v-content>
    </v-app>
  </div>
</template>

<script>
var crypto = require("crypto");

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
      this.isPasswordWrong = true;
    },
    closeWrongPasswordPopUp() {
      this.isPasswordWrong = false;
    },
    setPassword() {
      const correctPasswordHash = "19d8ab3b0210ddf9a86771ffc38d0a9d";
      const currentPasswordHash = this.hashMD5(this.password);
      if (currentPasswordHash === correctPasswordHash) {
        this.$session.set('isAuthenticatedUser', true);
        this.$store.commit("authenticateUser");
        this.$router.push({ path: "uploadcsv" });
      } else {
        this.openWrongPasswordPopUp();
      }
    },
    hashMD5(password) {
      return crypto
        .createHash("md5")
        .update(password)
        .digest("hex");
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

#in-collaboration {
  margin-top: 5px;
  margin-bottom: 0;
}
</style>
