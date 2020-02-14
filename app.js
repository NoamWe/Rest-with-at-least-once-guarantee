const Bull = require('bull')
const tasks = new Bull('tasks');
const dataCache = require('./dataCach')
const request = require('request');
const express = require('express')
const app = express()
const port = 3000

dataCache.init();

tasks.process(async (job) => {
    return sendToApi(job.data);
});

async function sendToApi(job) {

    request('http://www.google.com', function (error, response, body) {
        console.error('error:', error);
        console.log('statusCode:', response && response.statusCode);
    });
}

app.get('/:name', async (req, res) => {
    try {
        const name = req.params.name
        const dataId = await dataCache.insert(name)
        await tasks.add({ dataId, name })
        const allData = await dataCache.selectAll()
        console.log(allData)
        res.sendStatus(200)
    } catch (error) {
        res.sendStatus(500)
    }
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
