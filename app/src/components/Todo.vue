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

            <v-row class="d-flex justify-center">
                <v-col cols="12" sm="6" md="4">
                    <ul>
                        <li v-for="item in tasks" :key="item.title">
                            {{ item }}
                        </li>
                    </ul>
                </v-col>
            </v-row>
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
    methods: {
        submit() {
            this.tasks.push({
                title: this.title,
                status: this.status
            })
            this.title = ""
            this.status = ""
        },
        clear() {
            this.title = ""
            this.status = ""
        }
    }
}
</script>