require('dotenv').config()
const Bull = require('bull')
const tasks = new Bull('tasks', process.env.REDIS);
const dataCache = require('./dataCach')
const request = require('request');
const express = require('express')
const app = express()
const port = 3000

main().catch(e)

async function main() {
    await dataCache.init()
    const server = app.listen(port, () => console.log(`App listening on port ${port}!`))
}

//Start handling left-over tasks
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
        res.sendStatus(200)
    } catch (error) {
        res.sendStatus(500)
    }
})

//gracefull shutdown
const sigs = ['SIGINT', 'SIGTERM', 'SIGQUIT']
sigs.forEach(sig => {
    process.on(sig, () => {
        console.info('SIGTERM signal received.');
        console.log('Closing http server.');
        server.close(() => {
            console.log('Http server closed.');
        });
        dataCache.close()
            .then(() => {
                process.exit(0)
            })
            .catch(e => process.exit(1))
    })
})
