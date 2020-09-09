const bodyParser = require('body-parser')
const express = require('express')
const cors = require('cors')
const app = express()
const port = 3000

const MongoClient = require('mongodb').MongoClient
const ObjectID = require('mongodb').ObjectID

const connString = "mongodb+srv://ahusni96:ahusni96@cluster0.gjnax.gcp.mongodb.net/<dbname>?retryWrites=true&w=majority"

MongoClient.connect(connString, {
    useUnifiedTopology: true
}, (err, client) => {
    if (err) {
        return console.error(err)
    }
    app.listen(port)
    console.log("Connected to Database!")
    
    const db = client.db('playground')
    const todo = db.collection('todo')

    app.use(bodyParser.json())
    app.use(cors())

    app.get('/', (req, res) => {
        res.send("Hello World from Express.js!")
    })

    app.get('/todos', (req, res) => {
        todo.find().toArray()
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
                res.send("Data deleted forever!")
            })
            .catch(error => console.log(error))
    })
})
