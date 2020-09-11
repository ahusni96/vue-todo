<template>
  <v-app id="inspire">
    <v-navigation-drawer
      v-if="loggedIn"
      v-model="drawer"
      app
    >
      <v-list dense>
        <v-list-item link>
          <v-list-item-action>
            <v-icon>mdi-home</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Home</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link>
          <v-list-item-action>
            <v-icon>mdi-email</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Contact</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      app
      color="indigo"
      dark
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" v-if="loggedIn"></v-app-bar-nav-icon>
      <v-toolbar-title>Todo</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-menu open-on-hover bottom offset-y v-if="loggedIn">
        <template v-slot:activator="{ on, attrs }">
          <v-btn 
            text
            v-bind="attrs"
            v-on="on"
          >
            Profile
          </v-btn>
        </template>
        <v-list>
            <v-list-item @click="editProfile">
              <v-list-item-title>Edit</v-list-item-title>
            </v-list-item>

            <v-list-item @click="dialog = true">
              <v-list-item-title>Delete</v-list-item-title>
            </v-list-item>
        </v-list>
      </v-menu>
      <v-btn icon @click="logout" v-if="loggedIn">
        <v-icon>mdi-exit-to-app</v-icon>
      </v-btn>
    </v-app-bar>

    <v-overlay v-model="overlay">
      <User :user="user" :callback="disableOverlay" />
    </v-overlay>

    <v-dialog v-model="dialog" width="500">
      <v-card>
        <v-card-title class="headline">
          Are you sure?
        </v-card-title>
        
        <v-card-text>
          This will delete your profile indefinitely.
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn 
            color="primary"
            @click="deleteProfile"
          >
            Sure
          </v-btn>
          <v-btn
            color="error"
            @click="dialog = false"
          >
            Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-main>
      <router-view></router-view>
    </v-main>

    <v-snackbar v-model="alert">
      {{ msg }}
    </v-snackbar>

    <v-footer
      color="indigo"
      app
    >
      <span class="white--text">&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
  import User from '@/components/User.vue'
  export default {
    props: {
      source: String,
    },
    components: {
      User
    },
    data: () => ({
      drawer: false,
      loggedIn: true,
      overlay: false,
      user: null,
      alert: false,
      msg: "",
      dialog: false
    }),
    beforeUpdate() {
      this.checkLogin()
    },
    updated() {
      this.checkLogin()
      if (this.loggedIn && this.$router.currentRoute.path === "/takeoff") {
        this.$router.push("/")
      }
    },
    methods: {
      getUser() {
        this.$http.get(`http://localhost:5000/user/${this.$session.get('user')}`)
        .then(response => {
          this.user = response.body
          this.overlay = true
        })
        .catch(error => console.log(error))
      },
      disableOverlay() {
        this.overlay = false
        this.user = null
        this.msg = "Profile has been updated!"
        this.alert = true
      },
      logout() {
        this.loggedIn = false
        this.$session.destroy()
        this.$router.push('/takeoff')
      },
      checkLogin() {
        if (this.$session.has('user')) {
          this.loggedIn = true
        }
        else {
          this.loggedIn = false

          if (this.$router.currentRoute.path !== "/takeoff") {
            this.$router.push("/takeoff")
          }
        }
      },
      editProfile() {
        this.getUser()
      },
      deleteProfile() {
        this.$http.delete(`http://localhost:5000/user/delete/${this.$session.get('user')}`)
        .then((response) => {
          console.log(response.body)
          this.dialog = false
          this.logout()
        })
        .catch(error => console.log(error))
      }
    },
  }
</script>