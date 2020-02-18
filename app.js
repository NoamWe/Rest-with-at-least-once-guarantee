require('dotenv').config()
const Bull = require('bull')
const tasks = new Bull('tasks', process.env.REDIS);
const dataCache = require('./dataCach')
const express = require('express')
const app = express()
const router = require('./route/api')
const {sendToAPIAndUpdate} = require('./utils')
const port = process.env.PORT
let server

main()

async function main() {
    try {
        await dataCache.init()
        addNonCompletedToTasksQueue()
        server = app.listen(port, () => console.log(`App listening on port ${port}!`))
    } catch (error) {
        console.log(`error on loading app: ${error.message}`)
    }
}

app.use('/',router)

//get all non completed etries from db and add them to the tasks queue
async function addNonCompletedToTasksQueue() {
    try {
        const nonCompleted = await dataCache.selectNonCompleted()

        for (const task of nonCompleted) {
            const id = task.id
            const name = task.name
            await tasks.add({
                id,
                name
            })
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