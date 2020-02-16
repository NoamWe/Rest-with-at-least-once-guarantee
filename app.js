require('dotenv').config()
const Bull = require('bull')
const tasks = new Bull('tasks', process.env.REDIS);
const dataCache = require('./dataCach')
const request = require('request');
const express = require('express')
const app = express()
const port = process.env.PORT
let server

main().catch(e => {
    console.log(e)
})

async function main() {
    await dataCache.init()
    addNonCompletedToTasksQueue()
    server = app.listen(port, () => console.log(`App listening on port ${port}!`))
}

app.put('/:name', async (req, res) => {
    try {
        const name = req.params.name
        console.log(`received a message with name: ${name}`)
        const id = await dataCache.insert(name)
        console.log(`inserted data for message with name: ${name}`)
        await sendToAPIAndUpdate({ id, name })
        res.status(200).send("OK!")
    } catch (error) {
        res.status(503).send("Something went seriously wrong but we will take care of it later")
    }
})

//get all non completed etries from db and add them to the tasks queue
async function addNonCompletedToTasksQueue() {
    try {
        const nonCompleted = await dataCache.selectNonCompleted()

        for (const task of nonCompleted) {
            const id = task.id
            const name = task.name
            await tasks.add({ id, name })
        }
    } catch (error) {
        console.log(error)
    }
}

//Start handling left-over tasks
tasks.process(async (job) => {
    try {
        await sendToAPIAndUpdate(job.data)
    } catch (error) {
        const msg = `Could not finish processing dataId: ${job.data.id} Error: ${error.message}`
        console.log(msg)
    }
})

async function sendToAPIAndUpdate(data) {
    try {
        await sendToApi(data);
        console.log(`api call succesful for name: ${data.name}`)
        await dataCache.update(data.id)
        console.log(`Finished processing dataId: ${data.id}`)
    } catch (error) {
        await tasks.add({ id: data.id, name: data.name })
        throw error
    }
}

function sendToApi(job) {
    return new Promise((resolve, reject) => {
        request('http://www.google.com', function (error, response, body) {
            if (error || response.statusCode != 200) {
                console.error('error:', error.message);
                reject(error)
            } else {
                console.log('statusCode from external api:', response && response.statusCode);
                resolve()
            }
        });
    })
}

//gracefull shutdown
const sigs = ['SIGINT', 'SIGTERM', 'SIGQUIT']
sigs.forEach(sig => {
    process.on(sig, () => {
        console.info(`${sig} signal received.`);
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
