const bodyParser = require('body-parser')
const express = require('express')
const cors = require('cors')
const app = express()
const port = 5000

const MongoClient = require('mongodb').MongoClient
const ObjectID = require('mongodb').ObjectID

const connString = "mongodb+srv://ahusni96:ahusni96@cluster0.gjnax.gcp.mongodb.net/playground?retryWrites=true&w=majority"

MongoClient.connect(connString, {
    useUnifiedTopology: true
}, (err, client) => {
    if (err) {
        return console.error(err)
    }
    app.listen(port)
	console.log(`Connected to Database at port:${port}!`)
    
    const db = client.db('playground')
    const todo = db.collection('todo')
    const users = db.collection('users')

    app.use(bodyParser.json())
    app.use(cors())

    app.get('/', (req, res) => {
        res.send("Hello World from Express.js!")
    })

    /* ******************** */
    /* Todos                */
    /* ******************** */

    app.get('/todos/:user', (req, res) => {
        todo.find({ user: req.params.user }).toArray()
        .then(results => {
            res.send(results)
        })
        .catch(error => console.log(error))
    })

    app.post('/todos/add', (req, res) => {
        todo.insertOne(req.body)
        .then(() => {
            res.send("Data added successfully!")
        })
        .catch(error => console.error(error))
    })

    app.put('/todos/edit/:taskId', (req, res) => {
        todo.findOneAndUpdate(
            { 
                _id: ObjectID(req.params.taskId) 
            }, 
            {
                $set: {
                    title: req.body.title,
                    status: req.body.status
                }
            },
            {
                upsert: true
            }
        )
        .then(() => {
            res.send("Data updated succesfully")
        })
        .catch(error => console.log(error))
    })

    app.delete('/todos/delete/:taskId', (req, res) => {
        todo.deleteOne({ 
            _id: ObjectID(req.params.taskId)
        })
        .then(() => {
            res.send("Data has been deleted forever!")
        })
        .catch(error => console.log(error))
    })

    /* ******************** */
    /* Profile              */
    /* ******************** */

    app.get('/user/:username', (req, res) => {
        users.findOne({
            username: req.params.username
        })
        .then(result => {
            res.send(result)
        })
        .catch(error => console.log(error))
    })

    app.post('/register', (req, res) => {
        users.findOne({
            username: req.body.username
        })
        .then(result => {
           if (result === null) {
                users.insertOne(req.body)
                .then(() => {
                    // Registration success
                    res.send(true)
                })
                .catch(error => console.log(error))
           }
           else {
               // Username has been taken
               res.send(false)
           }
        })
        .catch(error => {
            console.log(error)
        })
    })

    app.post('/login', (req, res) => {
        users.findOne({
            $and: [
                { username: req.body.username },
                { password: req.body.password }
            ]
        })
        .then(result => {
            if (result === null) {
                // Login fail
                res.send(false)
            }
            else {
                // Login success
                res.send(true)
            }
        })
        .catch(error => console.log(error))
    })

    app.put('/user/edit/:userID', (req, res) => {
        users.findOneAndUpdate(
            {
                _id: ObjectID(req.params.userID)
            },
            {
                $set: {
                    username: req.body.username,
                    password: req.body.password
                }    
            },
            {
                upsert: false
            }
        )
        .then(() => {
            res.send("Profile has been updated!")
        })
        .catch(error => console.log(error))
    })

    app.delete('/user/delete/:user', (req, res) => {
        users.deleteOne(
            {
                username: req.params.user
            }
        )
        .then(() => {
            todo.deleteMany({
                user: req.params.user
            })
            .then(() => console.log(`All entries for ${req.params.user} has been deleted!`))
            .catch(error => console.log(error))

            res.send("User has been deleted!")
        })
        .catch(error => console.log(error))
    })
})
