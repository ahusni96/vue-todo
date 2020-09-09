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
      <v-btn icon @click="logout" v-if="loggedIn">
        <v-icon>mdi-exit-to-app</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <router-view></router-view>
    </v-main>
    <v-footer
      color="indigo"
      app
    >
      <span class="white--text">&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
  export default {
    props: {
      source: String,
    },
    data: () => ({
      drawer: false,
      loggedIn: false
    }),
    beforeUpdate() {
      if (this.$router.currentRoute.path === "/takeoff") {
        this.loggedIn = false
      }
      else {
        this.loggedIn = true
      }
    },
    updated() {
      if (!this.$session.has('user') && (this.$router.currentRoute.path !== "/takeoff")) {
        this.$router.push('/takeoff')
      }
    },
    methods: {
      logout() {
        this.$session.destroy()
        this.$router.push('/takeoff')
      }
    }
  }
</script>