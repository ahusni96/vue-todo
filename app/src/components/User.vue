<template>
    <v-form>
        <v-card light>
            <v-row align="center" justify="center">
                <v-col class="text-center" cols="11">
                    <v-text-field label="Username" v-model="user.username"></v-text-field>
                    <v-text-field
                        v-model="user.password"
                        :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
                        :rules="[rules.required, rules.min]"
                        :type="showPass ? 'text' : 'password'"
                        name="input-10-1"
                        label="Password"
                        hint="At least 1 character"
                        counter
                        @click:append="showPass = !showPass"
                    ></v-text-field>
                    
                    <div class="d-flex justify-center">
                        <v-btn class="ma-2" @click="onEdit(callback)">Edit</v-btn>
                        <v-btn class="ma-2" @click="callback">Cancel</v-btn>
                    </div>
                </v-col>
            </v-row>
        </v-card>
    </v-form>
</template>

<script>
export default {
    props: {
        'user': Object,
        'callback': Function 
    },
    data: () => ({
        showPass: false,
        rules: {
            required: value => !!value || 'Required.',
            min: v => v.length >= 1 || 'Min 1 characters'
        },
    }),
    methods: {
        onEdit(cb) {
            let temp = {
                username: this.user.username,
                password: this.user.password
            }

            this.$http.put(`http://localhost:5000/user/edit/${this.user._id}`, temp)
            .then(() => {
                this.$session.set('user', temp.username)
                cb()
            })
            .catch(error => console.log(error))
        },
    },
}
</script>