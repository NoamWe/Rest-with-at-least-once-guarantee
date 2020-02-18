const Bull = require('bull')
const tasks = new Bull('tasks', process.env.REDIS);
const request = require('request');
const dataCache = require('./dataCach')

async function sendToAPIAndUpdate(data) {
    try {
        await sendToApi(data);
        console.log(`api call succesful for name: ${data.name}`)
        await dataCache.update(data.id)
        console.log(`Finished processing dataId: ${data.id}`)
    } catch (error) {
        await tasks.add({
            id: data.id,
            name: data.name
        })
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

module.exports = {
    sendToAPIAndUpdate
}