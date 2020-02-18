var express = require('express')
var router = express.Router()

const dataCache = require('../dataCach')
const sendToAPIAndUpdate = require('../utils').sendToAPIAndUpdate

router.put('/:name', async (req, res) => {
    try {
        const name = req.params.name
        console.log(`received a message with name: ${name}`)
        const id = await dataCache.insert(name)
        console.log(`inserted data for message with name: ${name}`)
        await sendToAPIAndUpdate({
            id,
            name
        })
        res.status(200).send("OK!")
    } catch (error) {
        console.log(`error in router. Error: ${error.message}`)
        res.status(503).send("Something went seriously wrong but we will take care of it later")
    }
})

module.exports = router
