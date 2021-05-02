const express = require('express')
const {insertAnimal, getAnimal} = require("./service/data")

const app = express()
const APP_PORT = process.env.APP_PORT
const EXPOSED_APP_PORT = process.env.EXPOSED_APP_PORT

app.use(express.json())

// Used to log every requesting coming in
app.use((req,res,next)=>{
    const date = new Date(Date.now());
    console.log(`${req.method} ${req.url} Requested at ${date.toISOString()}`)
    next()
})

app.get('/', (req,res)=>{
    res.send("Ok")
})

app.post("/animal", insertAnimal)
app.get("/animal/:name", getAnimal)


app.listen(APP_PORT, ()=>{
    console.log(`App is listening on port ${APP_PORT} and exposed to ${EXPOSED_APP_PORT}`)
})