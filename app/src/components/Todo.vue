<template>
    <v-form>
        <v-container>
            <v-snackbar v-model="alert">
                {{ message }}
            </v-snackbar>

            <v-overlay :value="editing">
                <v-card width="500" class="ma-2" light>
                    <v-row class="d-flex justify-center">
                        <v-col cols="11">
                            <v-text-field 
                                label="Task"
                                v-model="title"
                            ></v-text-field>

                            <v-select
                                label="Status"
                                :items="statuses"
                                v-model="status"
                            ></v-select>

                            <div class="d-flex justify-center">
                                <v-btn class="ma-2" @click="submit" v-if="id === ''">Submit</v-btn>
                                <v-btn class="ma-2" @click="submitEdit" v-else>Edit</v-btn>
                                <v-btn class="ma-2" @click="clear">Cancel</v-btn>
                            </div>
                        </v-col>
                    </v-row>
                </v-card>
            </v-overlay>

            <v-list>
                <v-list-item-group>
                    <v-list-item @click="addTask">
                        <v-list-item-content>
                            <v-list-item-title>Add New Task</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                    <v-list-item v-for="item in tasks" :key="item._id" inactive>
                        <v-list-item-content>
                            <v-list-item-title>{{ item.title }}</v-list-item-title>
                            <v-list-item-subtitle>{{ item.status }}</v-list-item-subtitle>
                        </v-list-item-content>
                        <v-list-item-icon>
                            <v-btn class="ma-2" @click="deleteTask(item._id)">
                                <v-icon>mdi-trash-can</v-icon>
                            </v-btn>
                            <v-btn class="ma-2" @click="editTask(item)">
                                <v-icon>mdi-pencil</v-icon>
                            </v-btn>
                        </v-list-item-icon>
                    </v-list-item>
                </v-list-item-group>
            </v-list>
        </v-container>
    </v-form>
</template>

<script>
export default {
    data: () => ({
        editing: false,
        alert: false,
        alertType: "success",
        message: "I am not real!",
        id: "",
        title: "",
        status: "",
        statuses: ["Incomplete", "Ongoing", "Completed"],
        tasks: []
    }),
    mounted() {
        this.getTodos()
    },
    methods: {
        addTask() {
            this.id = ""
            this.title = ""
            this.status = ""
            this.editing = true
        },
        submit() {
            let task = {
                title: this.title,
                status: this.status
            }

            this.$http.post('http://localhost:3000/todos/add', task)
            .then(response => {
                //console.log(response.body)
                this.showAlert(response.body)
                this.getTodos()
            }, error => console.log(error))

            this.clear()
        },
        submitEdit() {
            let task = {
                title: this.title,
                status: this.status
            }

            this.$http.put(`http://localhost:3000/todos/edit/${this.id}`, task)
            .then(response => {
                //console.log(response.body)
                this.showAlert(response.body)
                this.getTodos()
                this.editing = false
            }, error => console.log(error))
        },
        deleteTask(id) {
            this.$http.delete(`http://localhost:3000/todos/delete/${id}`)
            .then(response => {
                //console.log(response.body)
                this.showAlert(response.body)
                this.getTodos()
            }, error => console.log(error))
        },
        editTask(task) {
            console.log(`Edit with id: ${task._id}`)
            this.id = task._id
            this.title = task.title
            this.status = task.status

            this.editing = true
        },
        clear() {
            this.id = ""
            this.title = ""
            this.status = ""
            this.editing = false
        },
        getTodos() {
            this.$http.get('http://localhost:3000/todos')
            .then(response => {
                this.tasks = response.body
            }, error => console.log(error))
        },
        showAlert(msg) {
            this.message = msg
            this.alert = true
        }
    },
    watch: {
        alert(val) {
            if (!val) return
            setTimeout(() => (this.alert = false), 4000)
        }
    }
}
</script>