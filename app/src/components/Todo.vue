<template>
    <v-form>
        <v-container>
            <v-row class="d-flex justify-center">
                <v-col cols="12" sm="6" md="4">
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
                        <v-btn class="ma-2" @click="submit">Submit</v-btn>
                        <v-btn class="ma-2" @click="clear">Clear</v-btn>
                    </div>
                </v-col>
            </v-row>

            <v-list>
                <v-list-item-group>
                    <v-list-item v-for="item in tasks" :key="item._id" inactive>
                        <v-list-item-content>
                            <v-list-item-title>{{ item.title }}</v-list-item-title>
                            <v-list-item-subtitle>{{ item._id }}</v-list-item-subtitle>
                        </v-list-item-content>
                        <v-list-item-icon>
                            <v-btn class="ma-2" @click="deleteTask(item._id)">
                                <v-icon>mdi-trash-can</v-icon>
                            </v-btn>
                            <v-btn class="ma-2" @click="editTask(item._id)">
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
        title: "",
        status: "",
        statuses: ["Incomplete", "Ongoing", "Completed"],
        tasks: []
    }),
    mounted() {
        this.getTodos()
    },
    methods: {
        submit() {
            let newTask = {
                title: this.title,
                status: this.status
            }

            this.$http.post('http://localhost:3000/todos/add', newTask)
            .then(response => {
                console.log(response.status)
                this.getTodos()
            }, error => console.log(error))

            this.clear()
        },
        deleteTask(id) {
            this.$http.delete(`http://localhost:3000/todos/delete/${id}`)
            .then(response => {
                console.log(response.status)
                this.getTodos()
            }, error => console.log(error))
        },
        editTask(id) {
            console.log(`Edit with id: ${id}`)
        },
        clear() {
            this.title = ""
            this.status = ""
        },
        getTodos() {
            this.$http.get('http://localhost:3000/todos')
            .then(response => {
                this.tasks = response.body
            }, error => console.log(error))
        }
    }
}
</script>