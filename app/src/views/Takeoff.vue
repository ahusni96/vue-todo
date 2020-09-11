<template>
    <v-form class="fill-height">
        <v-container class="fill-height" fluid>
            <v-row align="center" justify="center">
                <v-col class="text-center" cols="11">
                    <v-text-field label="Username" v-model="username"></v-text-field>
                    <v-text-field
                        v-model="password"
                        :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
                        :rules="[rules.required, rules.min]"
                        :type="showPass ? 'text' : 'password'"
                        name="input-10-1"
                        label="Password"
                        hint="At least 1 character"
                        counter
                        @click:append="showPass = !showPass"
                    ></v-text-field>
                    
                    <div class="d-flex justify-center" v-if="!isRegistering">
                        <v-btn class="ma-2" @click="onLogin">Login</v-btn>
                        <v-btn class="ma-2" @click="isRegistering = !isRegistering">Register</v-btn>
                    </div>

                    <div class="d-flex justify-center" v-else>
                        <v-btn class="ma-2" @click="onRegister">Register</v-btn>
                        <v-btn class="ma-2" @click="onCancel">Cancel</v-btn>
                    </div>
                </v-col>
            </v-row>
        </v-container>

        <v-dialog max-width="500" max-height="250" v-model="dialog" :scrollable="scrollable">
            <v-card>
                <v-card-title>Error</v-card-title>
                <v-card-text>{{ message }}</v-card-text>
            </v-card>
        </v-dialog>
    </v-form>
</template>

<script>
export default {
    data: () => ({
        showPass: false,
        rules: {
            required: value => !!value || 'Required.',
            min: v => v.length >= 1 || 'Min 1 characters'
        },
        dialog: false,
        scrollable: false,
        message: "Default error message",
        isRegistering: false,
        username: "",
        password: ""
    }),
    methods: {
        onLogin() {
            let user = {
                username: this.username,
                password: this.password
            }

            this.$http.post('http://localhost:5000/login', user)
            .then(response => {
                if (!response.body) {
                    this.message = "Incorrect username/password"
                    this.dialog = true
                }
                else {
                    this.$session.start()
                    this.$session.set('user', this.username)
                    this.$router.push('/')
                }
            })
            .catch(error => console.log(error))
        },
        onRegister() {
            let user = {
                username: this.username,
                password: this.password
            }

            this.$http.post('http://localhost:5000/register', user)
            .then(response => {
                if (!response.body) {
                    this.message = "Username has been taken!"
                    this.dialog = true
                }
                else {
                    this.message = "Registration successful!"
                    this.dialog = true
                    this.isRegistering = false
                }
            })
            .catch(error => console.log(error))
        },
        onCancel() {
            this.username = ""
            this.password = ""
            this.isRegistering = false
        }
    }
}
</script>